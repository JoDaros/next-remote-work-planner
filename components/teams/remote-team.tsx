import { FC, useCallback, useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  ColorSwatch,
  Container,
  Group,
  LoadingOverlay,
  SegmentedControl,
  Space,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import WorkCalendar from "../layout/work-calendar";
import { useMediaQuery } from "@mantine/hooks";
import SubscribeModal from "../layout/subscribe-modal";
import Notification, { ErrorMessage } from "../layout/notification";
import { BsCalendarPlusFill } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

const RemoteTeam: FC<{
  fetchUrl: string;
  name: string;
  groups: { label: string; value: string }[];
}> = (props) => {
  const [remoteDays, setRemoteDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedGroup, setSelectedGroup] = useState<string>("0");
  const [error, setError] = useState<ErrorMessage>({
    show: false,
    title: "",
    message: "",
    severity: "error",
  });
  const [showLoading, setShowLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const theme = useMantineTheme();
  const largeScreen = useMediaQuery("(min-width: 600px)");
  const smallScreen = useMediaQuery("(max-height: 700px)");

  const requestRemoteDaysFromServer = useCallback(
    async (startDate: Date, group: string) => {
      if (startDate && +group > 0) {
        setShowLoading(true);
        setError({ show: false });
        const response = await fetch(
          props.fetchUrl +
            "?" +
            new URLSearchParams({
              date: moment(startDate).format("YYYY-MM-DD"),
              group: group,
            })
        );

        if (response && response.ok) {
          const data: { monthRemoteDays: string[] } = await response.json();
          setRemoteDays(data.monthRemoteDays.map((rm) => new Date(rm)));
        } else {
          const errorMessage = await response.blob().then((blob) => blob.text());
          setError({
            show: true,
            title: "Communication Error",
            message: errorMessage,
            severity: "error",
          });
        }
        setShowLoading(false);
      }
    },
    [props.fetchUrl]
  );

  useEffect(() => {
    const cookieValue = document.cookie;
    if (cookieValue) {
      const groupValue = cookieValue
        .split("; ")
        .find((row) => row.startsWith(`group=`))
        ?.split("=")[1];
      const teamValue = cookieValue
        .split("; ")
        .find((row) => row.startsWith(`team=`))
        ?.split("=")[1];
      if (teamValue === props.name) {
        setSelectedGroup(groupValue ? groupValue : "0");
      }
    }
  }, [props.name]);

  useEffect(() => {
    requestRemoteDaysFromServer(selectedDate, selectedGroup);
  }, [selectedDate, selectedGroup, requestRemoteDaysFromServer]);

  const changeMonthHandler = async (month: Date) => {
    setSelectedDate(month);
  };

  const changeGroupHandler = (group: string) => {
    setSelectedGroup(group);
    document.cookie = `group=${group};max-age=15780000`; // 6 months
    document.cookie = `team=${props.name};max-age=15780000`; // 6 months
  };

  const errorHandler = (error: ErrorMessage) => {
    setError(error);
  };

  const errorAlertHandler = () => {
    setError({ show: false });
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Container fluid={true}>
        <Stack spacing={smallScreen ? "xs" : "xl"}>
          <LoadingOverlay visible={showLoading} />
          {error.show && <Notification error={error} onClose={errorAlertHandler} />}
          <SegmentedControl
            fullWidth
            value={selectedGroup}
            onChange={changeGroupHandler}
            data={props.groups}
            size={largeScreen ? "sm" : "xs"}
          />
          <Stack spacing="xs">
            <WorkCalendar onMonthChange={changeMonthHandler} highlightedDays={remoteDays} />
            {selectedGroup !== "0" ? (
              <Group align="center" position="center">
                <ColorSwatch color={theme.colors.cyan[9]} size={largeScreen ? 30 : 20} />
                <Text color="dimmed" size={largeScreen ? "sm" : "xs"}>
                  Remote Days
                </Text>
              </Group>
            ) : (
              <Space h="md" />
            )}
          </Stack>
          <Button
            rightIcon={<BsCalendarPlusFill />}
            onClick={() => setExportOpen(true)}
            disabled={selectedGroup === "0"}
          >
            Add to My Calendar
          </Button>
          <SubscribeModal
            opened={exportOpen}
            group={selectedGroup}
            startDate={selectedDate}
            team={props.name}
            onError={errorHandler}
            onClose={() => setExportOpen(false)}
          />
          <Space h="md" />
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Button
              size="xs"
              component="a"
              href="https://discord.gg/BnM9DHTG8y"
              variant="outline"
              leftIcon={<FaDiscord size={14} />}
            >
              Join Our Discord
            </Button>
          </div>
        </Stack>
      </Container>
    </div>
  );
};

export default RemoteTeam;
