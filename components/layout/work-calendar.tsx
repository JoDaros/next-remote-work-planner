import { Calendar } from "@mantine/dates";
import { FC, useState } from "react";
import { MantineSize, useMantineTheme } from "@mantine/core";
import moment from "moment";
import { useMediaQuery } from "@mantine/hooks";

const minDate = new Date(2021, 10, 4);
const comparisonFormat = "YYYY-MM-DD";

const WorkCalendar: FC<{
  highlightedDays: Date[];
  onMonthChange: (month: Date) => void;
}> = (props) => {
  const theme = useMantineTheme();
  const currentDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);

  const largeScreen = useMediaQuery("(min-width: 600px)");

  return (
    <Calendar
      value={currentDate}
      onMonthChange={props.onMonthChange}
      minDate={minDate}
      maxDate={maxDate}
      dayStyle={(date, modifiers) => {
        if (props.highlightedDays && props.highlightedDays.length > 0) {
          const dateString = moment(date).format("YYYY-MM-DD");

          for (const highlightedDay of props.highlightedDays) {
            if (moment(highlightedDay).format("YYYY-MM-DD") === dateString) {
              return {
                backgroundColor: theme.colors.cyan[9],
                color: theme.white,
              };
            }
          }
          return {};
        }
        return {};
      }}
      fullWidth
      size={largeScreen ? "xl" : "md"}
      styles={(theme) => ({
        calendarBase: {
          justifyContent: "center",
        },
        cell: {
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        },
        day: {
          borderRadius: 0,
        },
        weekdayCell: {
          fontSize: theme.fontSizes.md,
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[0],
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        },
        weekend: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        },
      })}
    />
  );
};

export default WorkCalendar;
