import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, X, TrendingUp } from "lucide-react";
import type { Product, CompatibilityResult } from "@shared/schema";

interface CompatibilityGraphProps {
  products: Product[];
  compatibility: CompatibilityResult[];
}

export function CompatibilityGraph({ products, compatibility }: CompatibilityGraphProps) {
  if (products.length < 2) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Add at least 2 products to see compatibility
        </p>
      </Card>
    );
  }

  // Calculate overall compatibility score from pairwise comparisons
  const totalScore = compatibility.reduce((sum, result) => sum + result.score, 0);
  const avgScore = compatibility.length > 0 ? Math.round(totalScore / compatibility.length) : 0;
  const overallStatus = avgScore >= 30 ? 'compatible' : avgScore >= 10 ? 'partial' : 'incompatible';

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Stack Compatibility</h3>
            <p className="text-sm text-muted-foreground">
              Based on {compatibility.length} pairwise comparison{compatibility.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              overallStatus === 'compatible' ? 'text-green-600 dark:text-green-400' :
              overallStatus === 'partial' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-destructive'
            }`}>
              {avgScore}
            </div>
            <Badge variant={overallStatus === 'compatible' ? 'default' : 'secondary'}>
              {overallStatus === 'compatible' ? 'Highly Compatible' :
               overallStatus === 'partial' ? 'Partially Compatible' :
               'Low Compatibility'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Compatibility Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span>Compatible (30+)</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span>Partial (10-29)</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-destructive" />
            <span>Incompatible (0-9)</span>
          </div>
        </div>
      </Card>

      {/* Selected Products List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Selected Products</h3>
        <div className="grid gap-4">
          {products.map((product) => {
            const profile = product.root.profileInfos;
            const imageUrl = profile.logo || profile.icon;
            const initials = profile.name?.substring(0, 2).toUpperCase() || '??';
            const connectionScore = product.root.theGridRanking?.connectionScore;

            return (
              <Card 
                key={product.id}
                className="p-4"
                data-testid={`compat-card-${product.id}`}
              >
                <div className="flex items-center gap-4">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={profile.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{initials}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{profile.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.productType && (
                        <Badge variant="outline" className="text-xs">
                          {product.productType.name}
                        </Badge>
                      )}
                      {connectionScore !== undefined && connectionScore > 0 && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {connectionScore}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pairwise Compatibility Results */}
      {compatibility.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Compatibility Details</h3>
          <div className="grid gap-3">
            {compatibility.map((result, idx) => {
              const status = result.compatible ? 'compatible' : 
                            result.score >= 10 ? 'partial' : 'incompatible';
              
              return (
                <Card 
                  key={idx}
                  className={`p-4 ${
                    status === 'compatible' ? 'border-green-600/50' :
                    status === 'partial' ? 'border-yellow-600/50' :
                    'border-destructive/50'
                  }`}
                  data-testid={`compat-result-${idx}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {status === 'compatible' && <Check className="w-4 h-4 text-green-600" />}
                        {status === 'partial' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                        {status === 'incompatible' && <X className="w-4 h-4 text-destructive" />}
                        <span className="font-medium text-sm">
                          {status === 'compatible' ? 'Compatible' :
                           status === 'partial' ? 'Partial Match' :
                           'Low Compatibility'}
                        </span>
                      </div>
                      {result.reasons.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {result.reasons.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className={`text-2xl font-bold ${
                      status === 'compatible' ? 'text-green-600 dark:text-green-400' :
                      status === 'partial' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-destructive'
                    }`}>
                      {result.score}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
