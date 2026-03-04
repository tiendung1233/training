import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { sendWebhookOrder } from "../api.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { shop, topic, payload } = await authenticate.webhook(request);

    console.log(`Received ${topic} webhook for ${shop}`);

    if (!shop || !payload) {
        return new Response("Missing shop or payload", { status: 400 });
    }

    try {
        // Convert Shopify webhook payload to the format our backend expects
        const lineItems = payload.line_items || [];
        const firstLineItem = lineItems[0] || {};
        const shippingAddress = payload.shipping_address || {};
        const customer = payload.customer || {};

        const order = {
            created_at: payload.created_at,
            customer: {
                first_name: customer.first_name
            },
            shipping_address: {
                city: shippingAddress.city,
                country: shippingAddress.country
            },
            line_items: lineItems.length > 0 ? [{
                title: firstLineItem.title,
                product_id: firstLineItem.product_id,
                image: firstLineItem.image || ""
            }] : []
        };

        await sendWebhookOrder(shop, order);
        console.log(`Webhook: Notification created for ${shop}`);
    } catch (error) {
        console.error(`Failed to process orders/create webhook for ${shop}:`, error);
    }

    return new Response();
};
