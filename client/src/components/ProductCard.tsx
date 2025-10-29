import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Check, AlertCircle, TrendingUp } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  selected?: boolean;
  compatibilityScore?: number;
  onSelect: () => void;
  onViewDetails: () => void;
}

export function ProductCard({ 
  product, 
  selected = false, 
  compatibilityScore,
  onSelect,
  onViewDetails 
}: ProductCardProps) {
  const profile = product.root.profileInfos;
  const connectionScore = product.root.theGridRanking?.connectionScore;
  
  // Determine compatibility status
  let compatibilityStatus: 'compatible' | 'partial' | 'incompatible' | null = null;
  if (compatibilityScore !== undefined) {
    if (compatibilityScore >= 30) compatibilityStatus = 'compatible';
    else if (compatibilityScore >= 10) compatibilityStatus = 'partial';
    else compatibilityStatus = 'incompatible';
  }

  // Get logo or use icon as fallback
  const imageUrl = profile.logo || profile.icon;
  // Use product name for initials, not profile name
  const initials = product.name?.substring(0, 2).toUpperCase() || '??';

  // Get supported assets (limit to 3 for display)
  const supportedAssets = product.productAssetRelationships
    .slice(0, 3)
    .map(rel => rel.asset.ticker || rel.asset.name)
    .filter(Boolean);

  return (
    <Card
      data-testid={`card-product-${product.id}`}
      className={`relative p-6 md:p-8 transition-all duration-150 hover-elevate ${
        selected ? 'border-primary ring-2 ring-primary/20' : ''
      } ${
        compatibilityStatus === 'incompatible' ? 'border-destructive/50' : ''
      }`}
    >
      {/* Debug Hover Badge */}
      <div className="absolute top-4 left-4 z-50">
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <div className="bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-[10px] font-bold cursor-pointer">
              DE
            </div>
          </HoverCardTrigger>
          <HoverCardContent 
            side="right" 
            align="start" 
            className="w-[600px] max-h-[500px] overflow-auto p-4 z-[100]"
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Raw Product Data</h4>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                {JSON.stringify(product, null, 2)}
              </pre>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Connection Score Badge */}
      {connectionScore !== undefined && connectionScore > 0 && (
        <div className="absolute top-4 right-4">
          <Badge 
            variant="secondary" 
            className="rounded-full px-2 py-1 text-xs font-medium"
            data-testid={`badge-score-${product.id}`}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {connectionScore}
          </Badge>
        </div>
      )}

      {/* Selected Checkmark */}
      {selected && (
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="w-4 h-4" />
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Logo/Icon */}
        <div className="flex items-center gap-4">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-contain bg-card"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">{initials}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-semibold" data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          
          {profile.tagLine && (
            <p className="text-sm font-medium text-foreground/90 leading-relaxed">
              {profile.tagLine}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {product.productType && (
              <Badge variant="outline" className="text-xs">
                {product.productType.name}
              </Badge>
            )}
            {profile.profileSector && (
              <Badge variant="secondary" className="text-xs">
                {profile.profileSector.name}
              </Badge>
            )}
          </div>

          {profile.descriptionShort && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.descriptionShort}
            </p>
          )}

          {supportedAssets.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <Check className="w-3 h-3 inline mr-1" />
              Supports {supportedAssets.join(', ')}
            </p>
          )}
        </div>

        {/* Compatibility Status */}
        {compatibilityStatus && (
          <div className={`flex items-center gap-2 text-xs font-medium ${
            compatibilityStatus === 'compatible' ? 'text-green-600 dark:text-green-400' :
            compatibilityStatus === 'partial' ? 'text-yellow-600 dark:text-yellow-400' :
            'text-destructive'
          }`}>
            {compatibilityStatus === 'compatible' && <Check className="w-4 h-4" />}
            {compatibilityStatus === 'partial' && <AlertCircle className="w-4 h-4" />}
            {compatibilityStatus === 'incompatible' && <AlertCircle className="w-4 h-4" />}
            {compatibilityStatus === 'compatible' ? 'Compatible' :
             compatibilityStatus === 'partial' ? 'Partial Match' :
             'Low Compatibility'}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onSelect}
            variant={selected ? "default" : "outline"}
            size="default"
            className="flex-1"
            data-testid={`button-select-${product.id}`}
          >
            {selected ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Selected
              </>
            ) : (
              'Select Product'
            )}
          </Button>
          <Button
            onClick={onViewDetails}
            variant="ghost"
            size="default"
            data-testid={`button-details-${product.id}`}
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
