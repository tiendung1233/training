const { db } = require("../config/firebase");

/**
 * Sync the shop data right after installation
 */
const syncShopInstall = async (ctx) => {
    try {
        const { shop, shopInfo, subscription, orders } = ctx.request.body;

        if (!shop) {
            ctx.status = 400;
            ctx.body = { success: false, message: "Missing shop domain" };
            return;
        }

        // Initialize Firestore Batch
        const batch = db.batch();

        // 1. Save Shop Session Data 
        const shopRef = db.collection("shops").doc(shop);
        batch.set(shopRef, {
            shop,
            installedAt: new Date().toISOString(),
            status: "installed",
            ...shopInfo
        }, { merge: true });

        // 2. Save Shop Info Details
        if (shopInfo) {
            const shopInfoRef = db.collection("shopInfos").doc(shop);
            batch.set(shopInfoRef, {
                ...shopInfo,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        }

        // 3. Save Subscription if available
        if (subscription) {
            const subRef = db.collection("subscriptions").doc(shop);
            batch.set(subRef, {
                ...subscription,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        }

        // 4. Create default setting for the shop
        const defaultSettings = {
            position: "bottom-left",
            hideTimeAgo: false,
            truncateProductName: true,
            displayDuration: 5,
            firstDelay: 10,
            popsInterval: 5,
            maxPopsDisplay: 20,
            includedUrls: "",
            excludedUrls: "",
            allowShow: "all",
            shopId: shop,
            createdAt: new Date().toISOString()
        };
        const settingRef = db.collection("settings").doc(shop);
        batch.set(settingRef, defaultSettings, { merge: true });

        // 5. Build notifications from the last 30 orders
        if (Array.isArray(orders) && orders.length > 0) {
            orders.forEach((order) => {
                const customer = order.customer || {};
                const lineItem = (order.line_items && order.line_items[0]) || {};
                const shippingAddress = order.shipping_address || {};

                // Find product ID (Extract from Admin GQL / REST if applicable)
                const productId = lineItem.product_id || "";

                // Base notification structure
                const notification = {
                    shopId: shop,
                    firstName: customer.first_name || shippingAddress.first_name || "Someone",
                    city: shippingAddress.city || "",
                    productName: lineItem.title || "A product",
                    country: shippingAddress.country || "",
                    productId: productId,
                    timestamp: order.created_at ? new Date(order.created_at).toISOString() : new Date().toISOString(),
                    productImage: "" // We will need a way to get the product image later
                };

                const notifRef = db.collection("notifications").doc();
                batch.set(notifRef, notification);
            });
        }

        await batch.commit();

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: "Shop data synced successfully to Firebase"
        };
    } catch (error) {
        console.error("Install sync error: ", error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: "Internal Server Error during installation sync"
        };
    }
};

module.exports = {
    syncShopInstall
};
