import { Button, Flex, Modal, Select, Space, Text } from "@mantine/core";
import { FC, useCallback, useEffect, useState } from "react";
import moment from "moment/moment";
import { ErrorMessage } from "./notification";
import AndroidHelperAccordion from "./android-helper-accordion";

const SubscribeModal: FC<{
  opened: boolean;
  startDate: Date;
  group: string;
  team: string;
  onClose: () => void;
  onError: (error: ErrorMessage) => void;
}> = (props) => {
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState<string | null>();

  useEffect(() => {
    setInterval(null);
  }, [props]);

  useEffect(() => {
    if (!interval) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [interval]);

  const getCalendarUrl = (protocol: string) => {
    return (
      `${protocol}//${window.location.host}/api/subscribe` +
      "?" +
      new URLSearchParams({
        group: props.group,
        team: props.team,
        interval: interval ? interval : "0",
      })
    );
  };

  const copyUrlHandler = async () => {
    await navigator.clipboard.writeText(getCalendarUrl(window.location.protocol));
  };

  const onSubscribe = async () => {
    setLoading(true);

    if (!interval) {
      return;
    }

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = getCalendarUrl("webcal:");
    document.body.appendChild(a);
    a.click();

    setLoading(false);
    props.onClose();
  };

  const exportHandler = useCallback(async () => {
    setLoading(true);
    if (!interval) {
      return;
    }
    const startDate = moment();
    const endDate = moment(new Date()).add(interval, "month");
    const response = await fetch(
      "/api/export" +
        "?" +
        new URLSearchParams({
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
          group: props.group,
          team: props.team,
        })
    );

    if (response && response.ok && response.status === 200) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/calendar;charset=utf-8" })
      );
      let a = document.createElement("a");
      a.href = url;
      const ts = moment().format("YYMMDDHHmmss");
      a.download = `rwprd_${props.team}_${props.group}_${ts}.ics`;
      a.click();
      props.onError({ show: false });
    } else {
      if (response.status === 204) {
        props.onError({
          show: true,
          message: "No remote days found for the selected range",
          title: "No results available",
          severity: "warning",
        });
      } else {
        const errorMessage = await response.blob().then((blob) => blob.text());
        props.onError({
          show: true,
          message: errorMessage,
          title: "Export Error",
          severity: "error",
        });
      }
    }
    setLoading(false);
    props.onClose();
  }, [interval, props.group, props.team, props.onError, props.onClose]);

  return (
    <Modal opened={props.opened} onClose={props.onClose} title="Subscription Options">
      <Flex direction="column" gap="md">
        <Space />
        <Text size="sm">
          <Text span inherit fw={600}>
            {"Start Date: "}
          </Text>
          <Text span inherit>
            {moment().startOf("isoWeek").format("YYYY-MM-DD")}
          </Text>
        </Text>
        <Select
          label="Subscription Range"
          placeholder="Pick one"
          size="sm"
          data={[
            { value: "1", label: "1 month" },
            { value: "3", label: "3 months" },
            { value: "6", label: "6 months" },
          ]}
          defaultValue={undefined}
          value={interval}
          onChange={setInterval}
          styles={(theme) => ({
            input: {
              fontSize: 17,
            },
          })}
        />
        <Space h="sm" />
        <Button loading={loading} disabled={invalid} onClick={onSubscribe}>
          Subscribe Calendar
        </Button>
        <AndroidHelperAccordion
          invalid={invalid}
          onCopyUrl={copyUrlHandler}
          onDownloadFile={exportHandler}
        />
      </Flex>
    </Modal>
  );
};

export default SubscribeModal;
