import "@shopify/shopify-app-react-router/adapters/node";
import { ApiVersion, AppDistribution, shopifyApp } from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { syncShopInstallationPayload } from "./api.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
  hooks: {
    afterAuth: async ({ session, admin }) => {
      shopify.registerWebhooks({ session });

      try {
        console.log("==> AFTER_AUTH STARTING");
        if (!admin) return;

        // 1. Fetch Shop details
        const shopResponse = await admin.graphql(`
          #graphql
          query {
            shop {
               id
               name
               email
               url
               plan {
                 displayName
               }
            }
          }
        `);
        const shopDataResult = await shopResponse.json();
        const shopInfo = shopDataResult.data?.shop || {};
        console.log("==> AFTER_AUTH SHOP INFO LOADED: ", shopInfo.name);

        // 2. Fetch the 30 standard recent orders via GraphQL
        const ordersResponse = await admin.graphql(`
          #graphql
          query {
            orders(first: 30, sortKey: CREATED_AT, reverse: true) {
              edges {
                node {
                  id
                  createdAt
                  customer {
                    firstName
                  }
                  shippingAddress {
                    city
                    country
                  }
                  lineItems(first: 1) {
                    edges {
                      node {
                        product {
                          id
                        }
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        `);

        const ordersResult = await ordersResponse.json();

        // Map GraphQL response to the format expected by our Koa Backend (simulating REST format)
        const edges = ordersResult.data?.orders?.edges || [];
        const orders = edges.map((e: any) => {
          const node = e.node;
          const firstLineItem = node.lineItems?.edges[0]?.node;

          return {
            created_at: node.createdAt,
            customer: {
              first_name: node.customer?.firstName
            },
            shipping_address: {
              city: node.shippingAddress?.city,
              country: node.shippingAddress?.country
            },
            line_items: firstLineItem ? [
              {
                title: firstLineItem.title,
                product_id: firstLineItem.product?.id?.replace("gid://shopify/Product/", "")
              }
            ] : []
          };
        });
        console.log(`==> AFTER_AUTH ORDERS LOADED: ${orders.length} orders`);

        // 3. Optional: Retrieve billing logic or subscriptions if required
        const subscription = null; // Can be filled if billing API is integrated

        // 4. Send payload to Koa Backend (to save in Firebase)
        console.log("==> AFTER_AUTH DYNAMIC IMPORT READY, SENDING TO KOA");
        await syncShopInstallationPayload({
          shop: session.shop,
          shopInfo,
          subscription,
          orders
        });

      } catch (err) {
        console.error("Failed to execute afterAuth hook operations", err);
      }
    },
  }
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
