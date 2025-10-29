import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProgressHeader } from "@/components/ProgressHeader";
import { ProductCard } from "@/components/ProductCard";
import { StackSummary } from "@/components/StackSummary";
import { SearchFilter } from "@/components/SearchFilter";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronRight } from "lucide-react";
import { useStackStore, sortByConnectionScore } from "@/lib/stackStore";
import type { Product } from "@shared/schema";

interface ProductSelectionProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function ProductSelection({ onBack, onComplete }: ProductSelectionProps) {
  const { 
    useCase, 
    selectedProducts, 
    currentCategoryIndex,
    addProduct,
    removeProduct,
    setCurrentCategoryIndex,
    reset,
    canProceedToNext
  } = useStackStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Handle missing use case without render side effect
  if (!useCase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No use case selected</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentCategory = useCase.categories[currentCategoryIndex];
  const isLastCategory = currentCategoryIndex === useCase.categories.length - 1;

  // Fetch products for current category
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', currentCategory.productTypeIds.join(',')],
    queryFn: async () => {
      const productTypeIds = currentCategory.productTypeIds.join(',');
      const res = await fetch(`/api/products?productTypeIds=${productTypeIds}`);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sort and filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = sortByConnectionScore(products);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.root.profileInfos.name?.toLowerCase().includes(query) ||
        p.root.profileInfos.descriptionShort?.toLowerCase().includes(query) ||
        p.productType.name?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [products, searchQuery]);

  const handleSelectProduct = (product: Product) => {
    const currentSelection = selectedProducts.get(currentCategory.name);
    if (currentSelection?.id === product.id) {
      removeProduct(currentCategory.name);
    } else {
      addProduct(currentCategory.name, product);
    }
  };

  const handleNext = () => {
    if (isLastCategory) {
      onComplete();
    } else {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setSearchQuery("");
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setSearchQuery("");
    } else {
      onBack();
    }
  };

  const currentSelection = selectedProducts.get(currentCategory.name);

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader
        currentStep={currentCategoryIndex + 1}
        totalSteps={useCase.categories.length}
        onBack={handleBack}
        onReset={onBack}
        title={useCase.name}
      />

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar - Stack Summary */}
        <aside className="lg:w-80 p-4 md:p-6 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:overflow-y-auto">
          <StackSummary
            products={selectedProducts}
            onRemove={removeProduct}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Category Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    Select {currentCategory.name}
                  </h2>
                  <Badge variant={currentCategory.required ? "default" : "outline"}>
                    {currentCategory.required ? "Required" : "Optional"}
                  </Badge>
                </div>
                <p className="text-sm md:text-base text-muted-foreground">
                  Step {currentCategoryIndex + 1} of {useCase.categories.length}
                </p>
              </div>
              
              {canProceedToNext() && (
                <Button 
                  onClick={handleNext}
                  size="lg"
                  className="gap-2"
                  data-testid="button-continue"
                >
                  {isLastCategory ? 'View Results' : 'Continue'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Search */}
            <SearchFilter
              onSearch={setSearchQuery}
              placeholder={`Search ${currentCategory.name.toLowerCase()}s...`}
            />
          </div>

          {/* Products Grid */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[300px]" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12 space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error connecting to The Grid API. Please try again.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search query' : 'No products available in this category'}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={currentSelection?.id === product.id}
                  onSelect={() => handleSelectProduct(product)}
                  onViewDetails={() => setSelectedProductDetail(product)}
                />
              ))}
            </div>
          )}

          {/* Action Bar */}
          {canProceedToNext() && (
            <div className="sticky bottom-4 left-0 right-0 flex justify-center">
              <Button 
                onClick={handleNext}
                size="lg"
                className="gap-2 shadow-lg"
                data-testid="button-continue-bottom"
              >
                {isLastCategory ? 'View Results' : 'Continue to Next Category'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        open={!!selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        selected={currentSelection?.id === selectedProductDetail?.id}
        onToggleSelect={() => {
          if (selectedProductDetail) {
            handleSelectProduct(selectedProductDetail);
          }
        }}
        stackProducts={Array.from(selectedProducts.values())}
      />
    </div>
  );
}
