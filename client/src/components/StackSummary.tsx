import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Share2, AlertTriangle } from "lucide-react";
import type { Product } from "@shared/schema";

interface StackSummaryProps {
  products: Map<string, Product>;
  onRemove: (categoryName: string) => void;
  onExport?: () => void;
  showExport?: boolean;
}

export function StackSummary({ 
  products, 
  onRemove,
  onExport,
  showExport = false
}: StackSummaryProps) {
  const productArray = Array.from(products.entries());

  if (productArray.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No products selected yet
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Stack</h3>
        <Badge variant="secondary">{productArray.length} Products</Badge>
      </div>

      <div className="space-y-3">
        {productArray.map(([categoryName, product]) => {
          const profile = product.root.profileInfos;
          const imageUrl = profile.logo || profile.icon;
          const initials = profile.name?.substring(0, 2).toUpperCase() || '??';

          return (
            <div 
              key={categoryName}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              data-testid={`stack-item-${categoryName}`}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={profile.name}
                  className="w-10 h-10 rounded-md object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-primary">{initials}</span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile.name}</p>
                <p className="text-xs text-muted-foreground">{categoryName}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => onRemove(categoryName)}
                data-testid={`button-remove-${categoryName}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {showExport && onExport && (
        <div className="space-y-2 pt-4 border-t">
          <Button 
            onClick={onExport}
            className="w-full gap-2"
            data-testid="button-export-png"
          >
            <Download className="w-4 h-4" />
            Export as PNG
          </Button>
          <Button 
            variant="outline"
            className="w-full gap-2"
            data-testid="button-share"
          >
            <Share2 className="w-4 h-4" />
            Share Stack
          </Button>
        </div>
      )}
    </Card>
  );
}
