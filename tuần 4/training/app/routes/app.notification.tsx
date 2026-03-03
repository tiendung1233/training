import { useState } from "react";
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
} from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";

const SNEAKER_IMG =
  "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png";

export default function AppNotification() {
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortValue, setSortValue] = useState("newest");

  const mockData = [
    {
      id: 1,
      location: "Someone in New York, United States",
      productName: "Purchased Sport Sneaker",
      timeAgo: "a day ago",
      by: "by AVADA",
      date: "From March 8, 2021",
    },
    {
      id: 2,
      location: "Someone in New York, United States",
      productName: "Purchased Sport Sneaker",
      timeAgo: "a day ago",
      by: "by AVADA",
      date: "From March 8, 2021",
    },
    {
      id: 3,
      location: "Someone in New York, United States",
      productName: "Purchased Sport Sneaker",
      timeAgo: "a day ago",
      by: "by AVADA",
      date: "From March 5, 2021",
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked);
    if (checked) {
      setSelectedItems(mockData.map((d) => d.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      setSelectedAll(false);
    }
  };

  const handleRemoveItem = (id: number) => {
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
              Showing {mockData.length} notifications
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
        {mockData.map((item) => (
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
                source={SNEAKER_IMG}
                alt={item.productName}
                size="small"
              />
              <BlockStack gap="050">
                <Text as="span" variant="bodySm" tone="subdued">
                  {item.location}
                </Text>
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  {item.productName}
                </Text>
                <InlineStack gap="200" blockAlign="center">
                  <Text as="span" variant="bodySm" tone="subdued">
                    {item.timeAgo}
                  </Text>
                  <Text as="span" variant="bodySm" tone="success">
                    ✔ {item.by}
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
                {item.date}
              </Text>
            </InlineStack>
          </div>
        ))}
      </Card>
    </Page>
  );
}
