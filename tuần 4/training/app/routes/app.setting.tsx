import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  Tabs,
  Text,
  Checkbox,
  RangeSlider,
  TextField,
  Select,
  InlineStack,
  BlockStack,
  Box,
  Button,
  Thumbnail,
  Divider,
} from "@shopify/polaris";

const SNEAKER_IMG =
  "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png";

type DesktopPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";

export default function SettingPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [desktopPosition, setDesktopPosition] = useState<DesktopPosition>("bottom-left");
  const [hideTimeAgo, setHideTimeAgo] = useState(false);
  const [truncateContent, setTruncateContent] = useState(true);
  const [displayDuration, setDisplayDuration] = useState(5);
  const [timeBeforeFirstPop, setTimeBeforeFirstPop] = useState(10);
  const [gapTime, setGapTime] = useState(2);
  const [maxPopups, setMaxPopups] = useState(20);
  const [pagesRestriction, setPagesRestriction] = useState("all");
  const [includedPages, setIncludedPages] = useState("");
  const [excludedPages, setExcludedPages] = useState("");

  const tabs = [
    { id: "display", content: "Display", panelID: "display-panel" },
    { id: "triggers", content: "Triggers", panelID: "triggers-panel" },
  ];

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    []
  );

  const handleSave = () => {
    console.log("Settings saved", {
      desktopPosition,
      hideTimeAgo,
      truncateContent,
      displayDuration,
      timeBeforeFirstPop,
      gapTime,
      maxPopups,
    });
  };

  const positionOptions: { value: DesktopPosition; label: string }[] = [
    { value: "bottom-left", label: "Bottom left" },
    { value: "bottom-right", label: "Bottom right" },
    { value: "top-left", label: "Top left" },
    { value: "top-right", label: "Top right" },
  ];

  const getPositionStyle = (position: DesktopPosition): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: "80px",
      height: "50px",
      border: desktopPosition === position ? "2px solid #5c6ac4" : "1px solid #c4cdd5",
      borderRadius: "4px",
      cursor: "pointer",
      position: "relative",
      backgroundColor: "#f6f6f7",
    };
    return base;
  };

  const getIndicatorStyle = (position: DesktopPosition): React.CSSProperties => {
    const indicator: React.CSSProperties = {
      width: "30px",
      height: "10px",
      backgroundColor: desktopPosition === position ? "#5c6ac4" : "#c4cdd5",
      borderRadius: "2px",
      position: "absolute",
    };
    if (position === "bottom-left") { indicator.bottom = "6px"; indicator.left = "6px"; }
    if (position === "bottom-right") { indicator.bottom = "6px"; indicator.right = "6px"; }
    if (position === "top-left") { indicator.top = "6px"; indicator.left = "6px"; }
    if (position === "top-right") { indicator.top = "6px"; indicator.right = "6px"; }
    return indicator;
  };

  return (
    <Page
      title="Settings"
      subtitle="Decide how your notifications will display"
      primaryAction={{ content: "Save", onAction: handleSave }}
    >
      <Layout>
        {/* Left sidebar - Notification Preview */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", position: "relative" }}>
                <Thumbnail source={SNEAKER_IMG} alt="Sport Sneaker" size="medium" />
                <BlockStack gap="050">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Someone in New York, United States
                  </Text>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Purchased Sport Sneaker
                  </Text>
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodySm" tone="subdued">
                      a day ago
                    </Text>
                    <Text as="span" variant="bodySm" tone="success">
                      ✔ by AVADA
                    </Text>
                  </InlineStack>
                </BlockStack>
                <div style={{ position: "absolute", top: 0, right: 0 }}>
                  <Button variant="plain" onClick={() => { }}>✕</Button>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Right content - Tabs & Settings */}
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
              {selectedTab === 0 && (
                <Box paddingBlockStart="400">
                  <BlockStack gap="600">
                    {/* APPEARANCE Section */}
                    <BlockStack gap="400">
                      <Text as="h3" variant="headingSm">
                        APPEARANCE
                      </Text>

                      {/* Desktop Position */}
                      <BlockStack gap="200">
                        <Text as="span" variant="bodyMd">Desktop Position</Text>
                        <InlineStack gap="200">
                          {positionOptions.map((opt) => (
                            <div
                              key={opt.value}
                              style={getPositionStyle(opt.value)}
                              onClick={() => setDesktopPosition(opt.value)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  setDesktopPosition(opt.value);
                                }
                              }}
                            >
                              <div style={getIndicatorStyle(opt.value)} />
                            </div>
                          ))}
                        </InlineStack>
                        <Text as="span" variant="bodySm" tone="subdued">
                          The display position of the pop on your website.
                        </Text>
                      </BlockStack>

                      {/* Checkboxes */}
                      <Checkbox
                        label="Hide time ago"
                        checked={hideTimeAgo}
                        onChange={setHideTimeAgo}
                      />
                      <BlockStack gap="100">
                        <Checkbox
                          label="Truncate content text"
                          checked={truncateContent}
                          onChange={setTruncateContent}
                        />
                        <Box paddingInlineStart="600">
                          <Text as="span" variant="bodySm" tone="subdued">
                            If your product name is long for one line, it will be truncated to 'Product na...'
                          </Text>
                        </Box>
                      </BlockStack>
                    </BlockStack>

                    <Divider />

                    {/* TIMING Section */}
                    <BlockStack gap="400">
                      <Text as="h3" variant="headingSm">
                        TIMING
                      </Text>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 40px", paddingRight: "16px" }}>
                        {/* Display duration */}
                        <BlockStack gap="200">
                          <Text as="span" variant="bodyMd">Display duration</Text>
                          <InlineStack gap="300" blockAlign="center" wrap={false}>
                            <div style={{ flex: 1 }}>
                              <RangeSlider
                                label=""
                                value={displayDuration}
                                onChange={(val) => setDisplayDuration(val as number)}
                                min={1}
                                max={30}
                                output
                              />
                            </div>
                            <div style={{ width: "130px" }}>
                              <TextField
                                label=""
                                value={String(displayDuration)}
                                onChange={(val) => setDisplayDuration(Number(val) || 0)}
                                suffix="second(s)"
                                autoComplete="off"
                              />
                            </div>
                          </InlineStack>
                          <Text as="span" variant="bodySm" tone="subdued">
                            How long each pop will display on your page.
                          </Text>
                        </BlockStack>

                        {/* Time before first pop */}
                        <BlockStack gap="200">
                          <Text as="span" variant="bodyMd">Time before the first pop</Text>
                          <InlineStack gap="300" blockAlign="center" wrap={false}>
                            <div style={{ flex: 1 }}>
                              <RangeSlider
                                label=""
                                value={timeBeforeFirstPop}
                                onChange={(val) => setTimeBeforeFirstPop(val as number)}
                                min={1}
                                max={60}
                                output
                              />
                            </div>
                            <div style={{ width: "130px" }}>
                              <TextField
                                label=""
                                value={String(timeBeforeFirstPop)}
                                onChange={(val) => setTimeBeforeFirstPop(Number(val) || 0)}
                                suffix="second(s)"
                                autoComplete="off"
                              />
                            </div>
                          </InlineStack>
                          <Text as="span" variant="bodySm" tone="subdued">
                            The delay time before the first notification.
                          </Text>
                        </BlockStack>

                        {/* Gap time between two pops */}
                        <BlockStack gap="200">
                          <Text as="span" variant="bodyMd">Gap time between two pops</Text>
                          <InlineStack gap="300" blockAlign="center" wrap={false}>
                            <div style={{ flex: 1 }}>
                              <RangeSlider
                                label=""
                                value={gapTime}
                                onChange={(val) => setGapTime(val as number)}
                                min={1}
                                max={30}
                                output
                              />
                            </div>
                            <div style={{ width: "130px" }}>
                              <TextField
                                label=""
                                value={String(gapTime)}
                                onChange={(val) => setGapTime(Number(val) || 0)}
                                suffix="second(s)"
                                autoComplete="off"
                              />
                            </div>
                          </InlineStack>
                          <Text as="span" variant="bodySm" tone="subdued">
                            The time interval between two popup notifications.
                          </Text>
                        </BlockStack>

                        {/* Maximum of popups */}
                        <BlockStack gap="200">
                          <Text as="span" variant="bodyMd">Maximum of popups</Text>
                          <InlineStack gap="300" blockAlign="center" wrap={false}>
                            <div style={{ flex: 1 }}>
                              <RangeSlider
                                label=""
                                value={maxPopups}
                                onChange={(val) => setMaxPopups(val as number)}
                                min={1}
                                max={80}
                                output
                              />
                            </div>
                            <div style={{ width: "130px" }}>
                              <TextField
                                label=""
                                value={String(maxPopups)}
                                onChange={(val) => setMaxPopups(Number(val) || 0)}
                                suffix="pop(s)"
                                autoComplete="off"
                              />
                            </div>
                          </InlineStack>
                          <Text as="span" variant="bodySm" tone="subdued">
                            The maximum number of popups are allowed to show after page loading. Maximum number is 80.
                          </Text>
                        </BlockStack>
                      </div>
                    </BlockStack>
                  </BlockStack>
                </Box>
              )}

              {selectedTab === 1 && (
                <Box paddingBlockStart="400">
                  <BlockStack gap="400">
                    <Text as="h3" variant="headingSm">
                      PAGES RESTRICTION
                    </Text>

                    <Select
                      label=""
                      options={[
                        { label: "All pages", value: "all" },
                        { label: "Specific pages", value: "specific" },
                      ]}
                      value={pagesRestriction}
                      onChange={setPagesRestriction}
                    />

                    {pagesRestriction === "specific" && (
                      <BlockStack gap="100">
                        <Text as="span" variant="bodyMd" tone="subdued">
                          Included pages
                        </Text>
                        <TextField
                          label=""
                          value={includedPages}
                          onChange={setIncludedPages}
                          multiline={4}
                          autoComplete="off"
                        />
                        <Text as="span" variant="bodySm" tone="subdued">
                          Page URLs to show the pop-up (separated by new lines)
                        </Text>
                      </BlockStack>
                    )}

                    <BlockStack gap="100">
                      <Text as="span" variant="bodyMd" tone="subdued">
                        Excluded pages
                      </Text>
                      <TextField
                        label=""
                        value={excludedPages}
                        onChange={setExcludedPages}
                        multiline={4}
                        autoComplete="off"
                      />
                      <Text as="span" variant="bodySm" tone="subdued">
                        Page URLs NOT to show the pop-up (separated by new lines)
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </Box>
              )}
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
