import { Calendar } from "@mantine/dates";
import { FC, useState } from "react";
import { useMantineTheme } from "@mantine/core";

const minDate = new Date(2021, 10, 4);

const WorkCalendar: FC<{
  highlightedDays: Date[];
  onMonthChange: (month: Date) => void;
}> = (props) => {
  const theme = useMantineTheme();
  const currentDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);

  return (
    <Calendar
      value={currentDate}
      onMonthChange={props.onMonthChange}
      minDate={minDate}
      maxDate={maxDate}
      dayStyle={(date, modifiers) => {
        if (props.highlightedDays && props.highlightedDays.length > 0) {
          for (const highlightedDays of props.highlightedDays) {
            if (highlightedDays.getTime() === date.getTime()) {
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
      size="xl"
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
        day: { borderRadius: 0, height: 70, fontSize: theme.fontSizes.lg },
        weekday: { fontSize: theme.fontSizes.lg },
        weekdayCell: {
          fontSize: theme.fontSizes.xl,
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[0],
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
          height: 70,
        },
      })}
    />
  );
};

export default WorkCalendar;
