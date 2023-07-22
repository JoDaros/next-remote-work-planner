import { Divider, Flex, Group, Tabs } from "@mantine/core";
import { FC } from "react";
import { useRouter } from "next/router";

const MainLinks: FC<{
  onClickLink: () => void;
}> = (props) => {
  const router = useRouter();

  let initialTab: string;

  if (router.pathname === "/dos") {
    initialTab = "dos";
  } else {
    initialTab = "swift";
  }

  return (
    <Flex direction="column">
      <Divider my="xs" label="Department/Teams" labelPosition="center" />
      <Tabs
        unstyled
        orientation="vertical"
        onTabChange={(value) => router.push(`/${value}`).then(() => props.onClickLink())}
        defaultValue={initialTab}
        styles={(theme) => ({
          tab: {
            ...theme.fn.focusStyles(),
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
            color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[9],
            border: `1px solid ${
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
            }`,
            padding: `30px`,
            cursor: "pointer",
            fontSize: theme.fontSizes.md,
            display: "flex",
            alignItems: "center",
            width: "100%",
            "&[data-active]": {
              backgroundColor: theme.colors.blue[7],
              borderColor: theme.colors.blue[7],
              color: theme.white,
            },
          },
          tabsList: {
            display: "flex",
          },
        })}
      >
        <Tabs.Tab value="dos">DOS</Tabs.Tab>
        <Tabs.Tab value="swift">SWIFT</Tabs.Tab>
      </Tabs>
    </Flex>
  );
};

export default MainLinks;
