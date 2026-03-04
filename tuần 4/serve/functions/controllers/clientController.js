const { db } = require("../config/firebase");

/**
 * GET /api/client/:shopId
 * Public endpoint — returns settings + notifications.
 * @param {object} ctx - Koa context
 */
const getClientData = async (ctx) => {
    try {
        const { shopId } = ctx.params;

        if (!shopId) {
            ctx.status = 400;
            ctx.body = { success: false, message: "Missing shopId parameter" };
            return;
        }

        // Fetch settings and notifications in parallel
        const [settingDoc, notificationsSnapshot] = await Promise.all([
            db.collection("settings").doc(shopId).get(),
            db.collection("notifications").get(),
        ]);

        const settings = settingDoc.exists ? settingDoc.data() : {};

        const notifications = [];
        notificationsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.shopId === shopId) {
                notifications.push({
                    id: doc.id,
                    firstName: data.firstName || "",
                    city: data.city || "",
                    productName: data.productName || "",
                    country: data.country || "",
                    productId: data.productId || null,
                    timestamp: data.timestamp || null,
                    productImage: data.productImage || "",
                });
            }
        });

        // Sort by timestamp descending (newest first)
        notifications.sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: {
                settings,
                notifications,
            },
        };
    } catch (error) {
        console.error("Get client data error:", error);
        ctx.status = 500;
        ctx.body = { success: false, message: "Internal Server Error" };
    }
};

module.exports = {
    getClientData,
};
