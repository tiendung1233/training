const {db} = require("../config/firebase");

/**
 * GET /api/notifications?shopId=xxx
 * Retrieve notifications, sorted by timestamp desc
 * @param {object} ctx - Koa context
 */
const getNotifications = async (ctx) => {
  try {
    const {shopId} = ctx.query;

    if (!shopId) {
      ctx.status = 400;
      ctx.body = {success: false, message: "Missing shopId parameter"};
      return;
    }

    // Get all notifications and filter by shopId in JS
    // This avoids Firestore composite index requirements
    const snapshot = await db.collection("notifications").get();

    const notifications = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.shopId === shopId) {
        notifications.push({id: doc.id, ...data});
      }
    });

    // Sort by timestamp descending (newest first)
    notifications.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: notifications,
    };
  } catch (error) {
    console.error("Get notifications error:", error);
    ctx.status = 500;
    ctx.body = {success: false, message: "Internal Server Error"};
  }
};

module.exports = {
  getNotifications,
};
