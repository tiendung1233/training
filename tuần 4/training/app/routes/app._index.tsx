import { useState } from "react";
import type {
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  Page,
  Card,
  InlineStack,
  Text,
  Button,
} from "@shopify/polaris";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const [appEnabled, setAppEnabled] = useState(false);

  const toggleAppStatus = () => {
    setAppEnabled((prev) => !prev);
  };

  return (
    <Page title="Home">
      <Card>
        <InlineStack align="space-between" blockAlign="center">
          <Text as="span" variant="bodyMd">
            App status is{" "}
            <Text as="span" variant="bodyMd" fontWeight="bold">
              {appEnabled ? "enabled" : "disabled"}
            </Text>
          </Text>
          <Button
            variant={appEnabled ? "secondary" : "primary"}
            tone={appEnabled ? "critical" : undefined}
            onClick={toggleAppStatus}
          >
            {appEnabled ? "Disable" : "Enable"}
          </Button>
        </InlineStack>
      </Card>
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
