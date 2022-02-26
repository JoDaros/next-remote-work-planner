import { FC, useCallback, useEffect, useState } from "react";
import moment from "moment";
import {
  Alert,
  ColorSwatch,
  Container,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  SegmentedControl,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import RedCircleIcon from "../layout/icon/red-circle-icon";
import WorkCalendar from "../layout/work-calendar";

const RemoteTeam: FC<{
  fetchUrl: string;
  groups: { label: string; value: string }[];
}> = (props) => {
  const [remoteDays, setRemoteDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedGroup, setSelectedGroup] = useState<string>("0");
  const [showError, setShowError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const theme = useMantineTheme();

  const requestRemoteDaysFromServer = useCallback(
    async (startDate: Date, group: string) => {
      if (startDate && +group > 0) {
        setShowLoading(true);
        setShowError(false);
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
          setShowError(true);
        }
        setShowLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    requestRemoteDaysFromServer(selectedDate, selectedGroup);
  }, [selectedDate, selectedGroup, requestRemoteDaysFromServer]);

  const changeMonthHandler = async (month: Date) => {
    setSelectedDate(month);
  };

  const changeGroupHandler = (group: string) => {
    setSelectedGroup(group);
  };

  const errorAlertHandler = () => {
    setShowError(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Container>
        <Group direction="column" grow>
          <LoadingOverlay visible={showLoading} />
          {showError && (
            <Alert
              icon={<RedCircleIcon />}
              title="Communication Error"
              color="red"
              withCloseButton
              onClose={errorAlertHandler}
            >
              Communication with the server has failed. Please try again later.
            </Alert>
          )}
          <SegmentedControl
            fullWidth
            value={selectedGroup}
            onChange={changeGroupHandler}
            data={props.groups}
          />
          <WorkCalendar
            onMonthChange={changeMonthHandler}
            highlightedDays={remoteDays}
          />
          <Space h="md" />
          {selectedGroup !== "0" && (
            <Group align="center" position="center">
              <ColorSwatch color={theme.colors.cyan[9]} />
              <Text color="dimmed" size="sm">
                Remote Days
              </Text>
            </Group>
          )}
        </Group>
      </Container>
    </div>
  );
};

export default RemoteTeam;
