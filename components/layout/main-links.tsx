import { Divider, Group, Tabs } from "@mantine/core";
import { FC } from "react";
import { useRouter } from "next/router";

const MainLinks: FC<{
  onClickLink: () => void;
}> = (props) => {
  const router = useRouter();

  const changeTabHandler = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        router.push("/dos").then(() => {
          props.onClickLink();
        });
        break;
      case 1:
        router.push("/swift").then(() => {
          props.onClickLink();
        });
        break;
      default:
        console.log("Unknown Team");
    }
  };

  let initialTab: number;

  if (router.pathname === "/dos") {
    initialTab = 0;
  } else {
    initialTab = 1;
  }

  return (
    <Group direction="column" grow>
      <Divider my="xs" label="Department/Teams" labelPosition="center" />
      <Tabs
        orientation="vertical"
        variant="unstyled"
        onTabChange={changeTabHandler}
        initialTab={initialTab}
        styles={(theme) => ({
          tabControl: {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[9],
            fontSize: theme.fontSizes.md,
            padding: `${theme.spacing.lg * 1.5}px ${theme.spacing.xl * 1.5}px`,
          },
          tabsListWrapper: {
            width: "100%",
          },
          tabActive: {
            backgroundColor: theme.colors.blue[7],
            borderColor: theme.colors.blue[7],
            color: theme.white,
          },
        })}
      >
        <Tabs.Tab label="DOS" />
        <Tabs.Tab label="SWIFT" />
      </Tabs>
    </Group>
  );
};

export default MainLinks;
