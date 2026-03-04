import { useState, useEffect } from "react";
import {
  Page,
  Card,
  Checkbox,
  InlineStack,
  BlockStack,
  Text,
  Thumbnail,
  Select,
  Button,
  Spinner,
} from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { fetchNotifications } from "../api.server";

const PLACEHOLDER_IMG =
  "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png";

/**
 * Helper: format timestamp to relative time (e.g., "2 days ago")
 */
function timeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  return "just now";
}

/**
 * Helper: format timestamp to display date
 */
function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return `From ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
}

interface Notification {
  id: string;
  firstName: string;
  city: string;
  country: string;
  productName: string;
  productImage: string;
  timestamp: string;
  shopId: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  try {
    const result = await fetchNotifications(shop);
    console.log("==> Notifications loader result:", JSON.stringify(result).substring(0, 200));
    return { notifications: result.data || [], shop };
  } catch (error) {
    console.error("Failed to load notifications:", error);
    return { notifications: [], shop };
  }
};

export default function AppNotification() {
  const { notifications } = useLoaderData<typeof loader>();
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState("newest");

  const sortedNotifications = [...(notifications as Notification[])].sort((a, b) => {
    if (sortValue === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked);
    if (checked) {
      setSelectedItems(sortedNotifications.map((d) => d.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      setSelectedAll(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    console.log("Remove item", id);
  };

  return (
    <Page title="Notifications" subtitle="List of sales notification from Shopify">
      <Card padding="0">
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #e1e3e5",
          }}
        >
          <InlineStack gap="200" blockAlign="center">
            <Checkbox
              label=""
              checked={selectedAll}
              onChange={handleSelectAll}
            />
            <Text as="span" variant="bodySm">
              Showing {sortedNotifications.length} notifications
            </Text>
          </InlineStack>

          <div style={{ width: "200px" }}>
            <Select
              label="Sort by"
              labelInline
              options={[
                { label: "Newest update", value: "newest" },
                { label: "Oldest update", value: "oldest" },
              ]}
              value={sortValue}
              onChange={setSortValue}
            />
          </div>
        </div>

        {/* Notification list */}
        {sortedNotifications.length === 0 ? (
          <div style={{ padding: "40px 16px", textAlign: "center" }}>
            <Text as="p" variant="bodyMd" tone="subdued">
              No notifications found. Notifications will appear here when orders are synced.
            </Text>
          </div>
        ) : (
          sortedNotifications.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid #e1e3e5",
              }}
            >
              <InlineStack gap="400" blockAlign="center">
                <Checkbox
                  label=""
                  checked={selectedItems.includes(item.id)}
                  onChange={(checked) => handleSelectItem(item.id, checked)}
                />
                <Thumbnail
                  source={item.productImage || PLACEHOLDER_IMG}
                  alt={item.productName}
                  size="small"
                />
                <BlockStack gap="050">
                  <Text as="span" variant="bodySm" tone="subdued">
                    {item.firstName} in {item.city}{item.city && item.country ? ", " : ""}{item.country}
                  </Text>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Purchased {item.productName}
                  </Text>
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodySm" tone="subdued">
                      {timeAgo(item.timestamp)}
                    </Text>
                    <Text as="span" variant="bodySm" tone="success">
                      ✔ by AVADA
                    </Text>
                  </InlineStack>
                </BlockStack>
              </InlineStack>

              <InlineStack gap="400" blockAlign="center">
                <Button
                  variant="plain"
                  onClick={() => handleRemoveItem(item.id)}
                  icon={XSmallIcon}
                  accessibilityLabel="Remove notification"
                />
                <Text as="span" variant="bodySm" alignment="end">
                  {formatDate(item.timestamp)}
                </Text>
              </InlineStack>
            </div>
          ))
        )}
      </Card>
    </Page>
  );
}
