/**
 * A server-side utility to interact with the local Firebase serve instance.
 */

export const firebaseApiURL = process.env.FIREBASE_API_URL || 'http://localhost:5001/heni-8a427/us-central1/api';

export async function fetchFirebaseAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${firebaseApiURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Attempt to parse out standard Koa JSON error (e.g., from errorHandler)
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Firebase API returned ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

export async function syncShopInstallationPayload(payload: any) {
    return fetchFirebaseAPI('/install', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
