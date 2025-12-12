import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@shared/schema";
import { Check, ExternalLink, TrendingUp } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  selected?: boolean;
  onToggleSelect?: () => void;
  stackProducts?: Product[];
}

export function ProductDetailModal({
  product,
  open,
  onClose,
  selected = false,
  onToggleSelect,
  stackProducts = []
}: ProductDetailModalProps) {
  if (!product) return null;

  const profile = product.root.profileInfos;
  const connectionScore = product.root.gridRank?.score;
  const imageUrl = profile.icon || profile.logo;
  const initials = profile.name?.substring(0, 2).toUpperCase() || '??';

  // Find compatible products in stack
  const compatibleInStack = stackProducts.filter(p => {
    const productChains = product.productDeployments.map(d => d.smartContractDeployment.deployedOnProduct.id);
    const stackChains = p.productDeployments.map(d => d.smartContractDeployment.deployedOnProduct.id);
    return productChains.some(chain => stackChains.includes(chain));
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="modal-product-detail">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={profile.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">{initials}</span>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <DialogTitle className="text-2xl md:text-3xl font-semibold">
                {profile.name}
              </DialogTitle>

              <div className="flex flex-wrap gap-2">
                {product.productType && (
                  <Badge variant="outline">{product.productType.name}</Badge>
                )}
                {profile.profileSector && (
                  <Badge variant="secondary">{profile.profileSector.name}</Badge>
                )}
                {connectionScore !== undefined && connectionScore > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {connectionScore}
                  </Badge>
                )}
              </div>

              {profile.tagLine && (
                <p className="text-sm text-muted-foreground italic">
                  {profile.tagLine}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="compatibility" data-testid="tab-compatibility">Compatibility</TabsTrigger>
            <TabsTrigger value="technical" data-testid="tab-technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {profile.descriptionLong && (
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.descriptionLong}
                </p>
              </div>
            )}

            {product.launchDate && (
              <div>
                <h4 className="text-sm font-medium mb-2">Launch Date</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(product.launchDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {product.productAssetRelationships.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Supported Assets</h4>
                <div className="flex flex-wrap gap-2">
                  {product.productAssetRelationships.map((rel, idx) => (
                    <Badge key={idx} variant="outline">
                      {rel.asset.ticker || rel.asset.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.productDeployments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Deployed On</h4>
                <div className="flex flex-wrap gap-2">
                  {product.productDeployments.map((deployment, idx) => (
                    <Badge key={idx} variant="secondary">
                      {deployment.smartContractDeployment.deployedOnProduct.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-4 mt-4">
            {compatibleInStack.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Compatible with {compatibleInStack.length} product(s) in your stack
                </h4>
                <div className="space-y-2">
                  {compatibleInStack.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{p.root.profileInfos.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add more products to your stack to see compatibility information.
              </p>
            )}

            {product.supportsProducts && product.supportsProducts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Officially Supports</h4>
                <div className="space-y-2">
                  {product.supportsProducts.map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <span className="text-sm">{sp.supportsProduct.name}</span>
                      {sp.supportsProduct.productType && (
                        <Badge variant="outline" className="text-xs">
                          {sp.supportsProduct.productType.name}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="technical" className="space-y-4 mt-4">
            {product.productDeployments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Smart Contracts</h4>
                {product.productDeployments.map((deployment, idx) => (
                  <div key={idx} className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      {deployment.smartContractDeployment.deployedOnProduct.name}
                    </p>
                    {deployment.smartContractDeployment.smartContracts?.map((contract, cidx) => (
                      <div key={cidx} className="p-2 rounded-md bg-muted/50">
                        <p className="text-xs font-mono break-all">{contract.address}</p>
                        {contract.name && (
                          <p className="text-xs text-muted-foreground mt-1">{contract.name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {product.urls && product.urls.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Links</h4>
                <div className="space-y-2">
                  {product.urls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover-elevate text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {url.urlType.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {onToggleSelect && (
          <>
            <Separator className="my-4" />
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  onToggleSelect();
                  onClose();
                }}
                data-testid="button-toggle-select"
              >
                {selected ? 'Remove from Stack' : 'Add to Stack'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
