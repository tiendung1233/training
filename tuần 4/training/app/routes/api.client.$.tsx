import type { LoaderFunctionArgs } from "react-router";

/**
 * Route: /api/client/*
 * Proxies storefront requests to Firebase emulator's client API.
 * This bypasses CORS since the storefront calls the Cloudflare tunnel.
 */

const FIREBASE_URL =
    process.env.FIREBASE_API_URL ||
    "http://127.0.0.1:5001/heni-8a427/us-central1/api";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const shopId = params["*"] || "";
    const firebaseUrl = `${FIREBASE_URL}/api/client/${shopId}`;

    try {
        const response = await fetch(firebaseUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("[API Proxy] Error forwarding to Firebase:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to connect to Firebase API",
            }),
            {
                status: 502,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }
};
