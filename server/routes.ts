import type { Express } from "express";
import { createServer, type Server } from "http";

const GRID_API_URL = "https://beta.node.thegrid.id/v1/graphql";

// GraphQL query to get products by type
const GET_PRODUCTS_BY_TYPE_QUERY = `
  query GetProductsByType($productTypeIds: [String!], $limit: Int = 50) {
    products(
      where: {
        productTypeId: {_in: $productTypeIds}
        productStatusId: {_eq: "5"}
      }
      limit: $limit
    ) {
      id
      name
      description
      productType {
        name
        definition
      }
      root {
        profileInfos {
          name
          logo
          icon
          descriptionShort
          profileSector {
            name
            slug
          }
        }
        theGridRanking {
          connectionScore
        }
      }
      productDeployments {
        smartContractDeployment {
          deployedOnProduct {
            id
            name
          }
        }
      }
      productAssetRelationships(limit: 10) {
        asset {
          id
          name
          ticker
          icon
        }
        assetSupportType {
          name
        }
      }
    }
  }
`;

// GraphQL query to get product details
const GET_PRODUCT_DETAILS_QUERY = `
  query GetProductDetails($productId: uuid!) {
    products(where: {id: {_eq: $productId}}) {
      id
      name
      description
      launchDate
      productType {
        name
        definition
      }
      root {
        profileInfos {
          name
          logo
          icon
          descriptionShort
          descriptionLong
          tagLine
          profileSector {
            name
          }
        }
        theGridRanking {
          connectionScore
        }
      }
      productDeployments {
        smartContractDeployment {
          deployedOnProduct {
            name
          }
          smartContracts {
            address
            name
          }
        }
      }
      productAssetRelationships {
        asset {
          name
          ticker
          icon
        }
        assetSupportType {
          name
        }
      }
      supportsProducts {
        supportsProduct {
          name
          productType {
            name
          }
        }
      }
      urls {
        urlType {
          name
        }
        url
      }
    }
  }
`;

// GraphQL query to get product relationships
const GET_PRODUCT_RELATIONSHIPS_QUERY = `
  query GetProductRelationships($productIds: [uuid!]!) {
    products(where: {id: {_in: $productIds}}) {
      id
      name
      root {
        profileInfos {
          name
          logo
          icon
          descriptionShort
          profileSector {
            name
            slug
          }
        }
        theGridRanking {
          connectionScore
        }
      }
      supportsProducts {
        supportsProduct {
          id
          name
        }
      }
      productAssetRelationships {
        asset {
          id
          name
          ticker
        }
      }
      productDeployments {
        smartContractDeployment {
          deployedOnProduct {
            id
            name
          }
        }
      }
    }
  }
`;

async function queryGraphQL(query: string, variables: any) {
  const response = await fetch(GRID_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get products by type
  app.get("/api/products", async (req, res) => {
    try {
      const productTypeIds = req.query.productTypeIds as string;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!productTypeIds) {
        return res.status(400).json({ error: "productTypeIds is required" });
      }

      const typeIds = productTypeIds.split(",");
      
      const data = await queryGraphQL(GET_PRODUCTS_BY_TYPE_QUERY, {
        productTypeIds: typeIds,
        limit,
      });

      res.json(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ 
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get product details
  app.get("/api/products/:productId", async (req, res) => {
    try {
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({ error: "productId is required" });
      }

      const data = await queryGraphQL(GET_PRODUCT_DETAILS_QUERY, {
        productId,
      });

      const product = data.products?.[0];
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ 
        error: "Failed to fetch product details",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get product relationships
  app.post("/api/products/relationships", async (req, res) => {
    try {
      const { productIds } = req.body;

      if (!productIds || !Array.isArray(productIds)) {
        return res.status(400).json({ error: "productIds array is required" });
      }

      const data = await queryGraphQL(GET_PRODUCT_RELATIONSHIPS_QUERY, {
        productIds,
      });

      res.json(data.products || []);
    } catch (error) {
      console.error("Error fetching product relationships:", error);
      res.status(500).json({ 
        error: "Failed to fetch product relationships",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
