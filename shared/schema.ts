import { z } from "zod";

// The Grid API Response Types (based on profile-first approach)

export interface ProfileInfo {
  name: string;
  logo?: string;
  icon?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  tagLine?: string;
  profileSector?: {
    name: string;
    slug: string;
  };
}

export interface TheGridRanking {
  connectionScore?: number;
}

export interface Root {
  profileInfos: ProfileInfo;
  theGridRanking?: TheGridRanking;
}

export interface ProductType {
  name: string;
  definition?: string;
}

export interface Asset {
  id: string;
  name: string;
  ticker?: string;
  icon?: string;
}

export interface AssetSupportType {
  name: string;
}

export interface ProductAssetRelationship {
  asset: Asset;
  assetSupportType?: AssetSupportType;
}

export interface SmartContract {
  address: string;
  name?: string;
}

export interface DeployedOnProduct {
  id: string;
  name: string;
}

export interface SmartContractDeployment {
  deployedOnProduct: DeployedOnProduct;
  smartContracts?: SmartContract[];
}

export interface ProductDeployment {
  smartContractDeployment: SmartContractDeployment;
}

export interface SupportsProduct {
  supportsProduct: {
    id: string;
    name: string;
    productType?: ProductType;
  };
}

export interface Url {
  urlType: {
    name: string;
  };
  url: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  launchDate?: string;
  productType: ProductType;
  root: Root;
  productDeployments: ProductDeployment[];
  productAssetRelationships: ProductAssetRelationship[];
  supportsProducts?: SupportsProduct[];
  urls?: Url[];
}

// Use Case Definitions

export interface CategoryDefinition {
  name: string;
  productTypeIds: string[];
  required: boolean;
}

export interface UseCaseTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: CategoryDefinition[];
}

export const USE_CASES: UseCaseTemplate[] = [
  {
    id: "trading",
    name: "Trading Stack",
    description: "Build your complete trading infrastructure with wallets, DEXs, and bridges",
    icon: "TrendingUp",
    categories: [
      { name: "Wallet", productTypeIds: ["692"], required: true },
      { name: "DEX", productTypeIds: ["25"], required: true },
      { name: "Bridge", productTypeIds: ["23"], required: false },
    ],
  },
  {
    id: "gaming",
    name: "Gaming Stack",
    description: "Create your gaming ecosystem with wallets, games, and NFT marketplaces",
    icon: "Gamepad2",
    categories: [
      { name: "Wallet", productTypeIds: ["692"], required: true },
      { name: "Game", productTypeIds: ["36"], required: true },
      { name: "NFT Marketplace", productTypeIds: ["37"], required: false },
    ],
  },
  {
    id: "payments",
    name: "Payments Stack",
    description: "Build payment infrastructure with wallets, gateways, and bridges",
    icon: "CreditCard",
    categories: [
      { name: "Wallet", productTypeIds: ["692"], required: true },
      { name: "Payment Gateway", productTypeIds: ["1751027652-xe6GoNmeSGG8RhO49gMPvQ"], required: true },
      { name: "Bridge", productTypeIds: ["23"], required: false },
    ],
  },
  {
    id: "nft",
    name: "NFT Stack",
    description: "Set up your NFT platform with wallets, marketplaces, and bridges",
    icon: "Image",
    categories: [
      { name: "Wallet", productTypeIds: ["692"], required: true },
      { name: "NFT Marketplace", productTypeIds: ["37"], required: true },
      { name: "Bridge", productTypeIds: ["23"], required: false },
    ],
  },
  {
    id: "developer",
    name: "Developer Stack",
    description: "Assemble developer tools with blockchains, RPC providers, and dev tools",
    icon: "Code",
    categories: [
      { name: "Blockchain", productTypeIds: ["15", "16", "17"], required: true },
      { name: "RPC Provider", productTypeIds: ["305"], required: true },
      { name: "Developer Tools", productTypeIds: ["3607"], required: true },
    ],
  },
];

// Compatibility Types

export interface CompatibilityResult {
  productId: string;
  score: number;
  compatible: boolean;
  reasons: string[];
  sharedChains: string[];
  sharedAssets: string[];
}

// Stack State

export interface SelectedProduct {
  categoryName: string;
  product: Product;
}

export interface StackState {
  useCase: UseCaseTemplate | null;
  selectedProducts: Map<string, Product>;
  currentCategoryIndex: number;
  compatibility: CompatibilityResult[];
}
