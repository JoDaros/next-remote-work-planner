import { Accordion, Button, Group, List, Popover, Stack, Text } from "@mantine/core";
import { FC, useState } from "react";
import * as url from "url";

const AndroidHelperAccordion: FC<{
  invalid: boolean;
  onCopyUrl: () => void;
  onDownloadFile: () => void;
}> = (props) => {
  const [opened, setOpened] = useState(false);

  const copyUrlHandler = async () => {
    await props.onCopyUrl();
    setOpened((o) => !o);
  };

  return (
    <Accordion
      radius="xs"
      chevronPosition="left"
      defaultValue={navigator.userAgent.toLowerCase().includes("android") ? "android" : ""}
    >
      <Accordion.Item value="android">
        <Accordion.Control>For Android Users</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Text size="xs">
              {
                "Unfortunately Android does not support native calendar subscription. If you don't have any app capable of handling webcal protocol please follow this steps:"
              }
            </Text>
            <List size="xs">
              <List.Item>
                <Text>
                  <Text span inherit fw={700}>
                    Copy URL
                  </Text>
                  {" using button bellow"}
                </Text>
              </List.Item>
              <List.Item>
                {"Go to "}
                <Text component="a" c="blue" target="_blank" href="https://www.google.com/calendar">
                  https://www.google.com/calendar
                </Text>
              </List.Item>
              <List.Item>
                {"If you are not already "}
                <Text span inherit fw={700}>
                  log in
                </Text>
                {" with your Google account"}
              </List.Item>
              <List.Item>
                <Text>
                  {"On the left of the page, pull down the option "}{" "}
                  <Text span inherit fw={700}>
                    {"'Other Calendars'"}
                  </Text>
                </Text>
              </List.Item>
              <List.Item>
                {"Select "}
                <Text span inherit fw={700}>
                  {"'Add by URL'"}
                </Text>
              </List.Item>
              <List.Item>
                <Text span inherit fw={700}>
                  Paste
                </Text>
                {" the URL in the box entitled 'Add by URL'"}
              </List.Item>
              <List.Item>
                {"If this doesn't work or you want an offline option, you can use"}{" "}
                <Text span inherit fw={700}>
                  {"Download File"}
                </Text>
                {" button"}
              </List.Item>
            </List>
            <Group grow>
              <Popover opened={opened} onChange={setOpened} position="right" withArrow shadow="md">
                <Popover.Target>
                  <Button size="xs" onClick={copyUrlHandler} disabled={props.invalid}>
                    Copy URL
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="xs">Copied to clipboard</Text>
                </Popover.Dropdown>
              </Popover>
              <Button size="xs" onClick={props.onDownloadFile} disabled={props.invalid}>
                Download File
              </Button>
            </Group>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default AndroidHelperAccordion;
