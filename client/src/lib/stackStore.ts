import { create } from 'zustand';
import type { Product, UseCaseTemplate, CompatibilityResult } from '@shared/schema';

interface StackStore {
  useCase: UseCaseTemplate | null;
  selectedProducts: Map<string, Product>;
  currentCategoryIndex: number;
  compatibility: CompatibilityResult[];
  
  setUseCase: (useCase: UseCaseTemplate) => void;
  addProduct: (categoryName: string, product: Product) => void;
  removeProduct: (categoryName: string) => void;
  setCurrentCategoryIndex: (index: number) => void;
  calculateCompatibility: (allProducts: Product[]) => void;
  reset: () => void;
  canProceedToNext: () => boolean;
}

export const useStackStore = create<StackStore>((set, get) => ({
  useCase: null,
  selectedProducts: new Map(),
  currentCategoryIndex: 0,
  compatibility: [],
  
  setUseCase: (useCase) => set({ useCase, selectedProducts: new Map(), currentCategoryIndex: 0 }),
  
  addProduct: (categoryName, product) => {
    const newMap = new Map(get().selectedProducts);
    newMap.set(categoryName, product);
    set({ selectedProducts: newMap });
  },
  
  removeProduct: (categoryName) => {
    const newMap = new Map(get().selectedProducts);
    newMap.delete(categoryName);
    set({ selectedProducts: newMap });
  },
  
  setCurrentCategoryIndex: (index) => set({ currentCategoryIndex: index }),
  
  calculateCompatibility: () => {
    const { selectedProducts } = get();
    const selectedArray = Array.from(selectedProducts.values());
    
    if (selectedArray.length < 2) {
      set({ compatibility: [] });
      return;
    }
    
    // Calculate pairwise compatibility between all selected products
    const compatibility: CompatibilityResult[] = [];
    
    for (let i = 0; i < selectedArray.length; i++) {
      for (let j = i + 1; j < selectedArray.length; j++) {
        const product1 = selectedArray[i];
        const product2 = selectedArray[j];
        
        const result = calculatePairwiseCompatibility(product1, product2);
        compatibility.push(result);
      }
    }
    
    set({ compatibility });
  },
  
  reset: () => set({ 
    useCase: null, 
    selectedProducts: new Map(), 
    currentCategoryIndex: 0,
    compatibility: [] 
  }),
  
  canProceedToNext: () => {
    const { useCase, selectedProducts, currentCategoryIndex } = get();
    if (!useCase || currentCategoryIndex >= useCase.categories.length) return false;
    
    const currentCategory = useCase.categories[currentCategoryIndex];
    if (!currentCategory.required) return true;
    
    return selectedProducts.has(currentCategory.name);
  },
}));

// Pairwise compatibility scoring algorithm (as per PRD)
function calculatePairwiseCompatibility(
  product1: Product,
  product2: Product
): CompatibilityResult {
  let score = 0;
  const reasons: string[] = [];
  
  // Get chains for both products
  const chains1 = product1.productDeployments.map(
    d => d.smartContractDeployment.deployedOnProduct.id
  );
  const chains2 = product2.productDeployments.map(
    d => d.smartContractDeployment.deployedOnProduct.id
  );
  
  // Calculate shared chains (10 points each, max 30)
  const sharedChainSet = new Set(chains1.filter(chain => chains2.includes(chain)));
  const sharedChains = Array.from(sharedChainSet);
  const chainScore = Math.min(30, sharedChains.length * 10);
  score += chainScore;
  
  if (sharedChains.length > 0) {
    reasons.push(`Shares ${sharedChains.length} chain(s)`);
  }
  
  // Get assets for both products
  const assets1 = product1.productAssetRelationships.map(a => a.asset.id);
  const assets2 = product2.productAssetRelationships.map(a => a.asset.id);
  
  // Calculate shared assets (10 points each, max 30)
  const sharedAssetSet = new Set(assets1.filter(asset => assets2.includes(asset)));
  const sharedAssets = Array.from(sharedAssetSet);
  const assetScore = Math.min(30, sharedAssets.length * 10);
  score += assetScore;
  
  if (sharedAssets.length > 0) {
    reasons.push(`Supports ${sharedAssets.length} common asset(s)`);
  }
  
  return {
    productId: `${product1.id}-${product2.id}`,
    score,
    compatible: score >= 30,
    reasons,
    sharedChains,
    sharedAssets,
  };
}

// Helper to sort products by connection score (client-side)
export function sortByConnectionScore(products: Product[]): Product[] {
  const sorted = [...products].sort((a, b) => {
    const scoreA = a.root.theGridRanking?.connectionScore ?? 0;
    const scoreB = b.root.theGridRanking?.connectionScore ?? 0;
    return scoreB - scoreA; // Descending order - highest first
  });
  
  // Debug logging - show top 20 products with scores
  console.log('🔢 Sorted products by connection score (Top 20):', 
    sorted.slice(0, 20).map((p, index) => ({
      rank: index + 1,
      name: p.name,
      connectionScore: p.root.theGridRanking?.connectionScore ?? 0
    }))
  );
  
  return sorted;
}
