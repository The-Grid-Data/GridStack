import type { Express } from "express";
import { createServer, type Server } from "http";

const GRID_API_URL = "https://beta.node.thegrid.id/graphql";

// GraphQL query to get products by type
// Note: profileInfos is an array in the API response
const GET_PRODUCTS_BY_TYPE_QUERY = `
  query GetProductsByType($productTypeIds: [String!], $limit: Int = 50) {
    products(
      where: {
        productTypeId: {_in: $productTypeIds}
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
  // Debug endpoint to test GraphQL queries
  app.get("/api/debug/test-query", async (req, res) => {
    try {
      const productTypeIds = ["1"]; // Wallet type
      const limit = 3;
      
      console.log("=== DEBUG: Testing GraphQL Query ===");
      console.log("Query:", GET_PRODUCTS_BY_TYPE_QUERY);
      console.log("Variables:", { productTypeIds, limit });
      
      const response = await fetch(GRID_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GET_PRODUCTS_BY_TYPE_QUERY,
          variables: { productTypeIds, limit },
        }),
      });
      
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        return res.status(500).json({
          error: "Failed to parse GraphQL response",
          status: response.status,
          responseText,
        });
      }
      
      if (data.errors) {
        console.error("GraphQL Errors:", JSON.stringify(data.errors, null, 2));
        return res.status(200).json({
          status: "error",
          graphqlErrors: data.errors,
          data: data.data,
          rawResponse: data,
        });
      }
      
      const products = data.data?.products || [];
      console.log(`Found ${products.length} products`);
      if (products.length > 0) {
        console.log("First product structure:", JSON.stringify(products[0], null, 2));
      }
      
      return res.json({
        status: "success",
        productCount: products.length,
        firstProduct: products[0],
        allProducts: products,
      });
    } catch (error) {
      console.error("Debug endpoint error:", error);
      return res.status(500).json({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  });

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

      // Transform products: profileInfos is an array, take first element
      const products = (data.products || []).map((product: any) => ({
        ...product,
        root: {
          ...product.root,
          profileInfos: product.root?.profileInfos?.[0] || {
            name: product.name,
            logo: null,
            icon: null,
            descriptionShort: product.description,
            profileSector: null,
          },
        },
      }));

      res.json(products);
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
