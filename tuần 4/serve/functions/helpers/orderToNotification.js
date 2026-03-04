/**
 * Convert a raw order object into a notification document.
 * Reused by both install sync (Part 3) and webhook (Part 4).
 *
 * @param {Object} order - The order object (REST-like format)
 * @param {string} shopId - The shop domain
 * @return {Object} notification document
 */
function convertOrderToNotification(order, shopId) {
  const customer = order.customer || {};
  const lineItem = (order.line_items && order.line_items[0]) || {};
  const shippingAddress = order.shipping_address || {};

  const productId = lineItem.product_id || "";

  return {
    shopId,
    firstName: customer.first_name || shippingAddress.first_name || "Someone",
    city: shippingAddress.city || "",
    productName: lineItem.title || "A product",
    country: shippingAddress.country || "",
    productId: productId,
    timestamp: order.created_at ?
            new Date(order.created_at).toISOString() :
            new Date().toISOString(),
    productImage: lineItem.image || "",
  };
}

module.exports = {convertOrderToNotification};
