const {db} = require("../config/firebase");
const {convertOrderToNotification} = require("../helpers/orderToNotification");

/**
 * POST /webhook/orders-create
 * Handle orders/create webhook
 * @param {object} ctx - Koa context
 */
const handleOrderCreated = async (ctx) => {
  try {
    const {shopId, order} = ctx.request.body;

    if (!shopId || !order) {
      ctx.status = 400;
      ctx.body = {success: false, message: "Missing shopId or order data"};
      return;
    }

    const notification = convertOrderToNotification(order, shopId);

    const notifRef = db.collection("notifications").doc();
    await notifRef.set(notification);

    console.log(
        `Webhook: notification for ${shopId}, doc ${notifRef.id}`,
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Notification created from webhook",
      data: {id: notifRef.id, ...notification},
    };
  } catch (error) {
    console.error("Webhook orders-create error:", error);
    ctx.status = 500;
    ctx.body = {success: false, message: "Internal Server Error"};
  }
};

module.exports = {
  handleOrderCreated,
};
