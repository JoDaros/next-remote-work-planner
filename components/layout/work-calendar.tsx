import { Calendar, DatePicker } from "@mantine/dates";
import React, { FC } from "react";
import { createStyles, CSSObject, Sx, useMantineTheme } from "@mantine/core";
import moment from "moment";
import { useMediaQuery } from "@mantine/hooks";

const minDate = new Date(2023, 0, 2);

const WorkCalendar: FC<{
  highlightedDays: Date[];
  onMonthChange: (month: Date) => void;
}> = (props) => {
  const theme = useMantineTheme();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);

  const largeScreen = useMediaQuery("(min-width: 600px)");
  const currentDate = new Date();

  const selectedDayStyles: CSSObject = React.useMemo(
    () => ({
      backgroundColor: theme.colors.blue,
      color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[6],
    }),
    [theme.colorScheme, theme.colors.blue, theme.colors.dark, theme.white]
  );

  const remoteWorkStyles: CSSObject = React.useMemo(
    () => ({
      borderColor: theme.colors.cyan[9],
      borderStyle: "solid",
      borderWidth: 3,
      borderRadius: "50%",
      color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark,
    }),
    [theme.colorScheme, theme.colors.cyan, theme.colors.dark, theme.white]
  );

  return (
    <Calendar
      onMonthSelect={props.onMonthChange}
      minDate={minDate}
      maxDate={maxDate}
      static
      getDayProps={(date) => {
        if (props.highlightedDays && props.highlightedDays.length > 0) {
          for (const highlightedDay of props.highlightedDays) {
            if (moment(date).isSame(moment(highlightedDay), "day")) {
              return {
                sx:
                  date.getDate() === currentDate.getDate() &&
                  date.getMonth() === currentDate.getMonth() &&
                  date.getFullYear() === currentDate.getFullYear()
                    ? { ...remoteWorkStyles, ...selectedDayStyles }
                    : remoteWorkStyles,
              };
            }
          }
        }
        if (
          date.getDate() === currentDate.getDate() &&
          date.getMonth() === currentDate.getMonth() &&
          date.getFullYear() === currentDate.getFullYear()
        ) {
          return {
            sx: selectedDayStyles,
          };
        } else {
          return {};
        }
      }}
      getMonthControlProps={(date) => {
        if (
          date.getMonth() === currentDate.getMonth() &&
          date.getFullYear() === currentDate.getFullYear()
        ) {
          return {
            sx: selectedDayStyles,
          };
        } else {
          return {};
        }
      }}
      getYearControlProps={(date) => {
        if (date.getFullYear() === currentDate.getFullYear()) {
          return {
            sx: selectedDayStyles,
          };
        } else {
          return {};
        }
      }}
      size={largeScreen ? "xl" : undefined}
      styles={{
        calendar: {
          justifyContent: "center",
          display: "flex",
        },
        day: {
          "&[data-selected]": selectedDayStyles,
          textAlign: "center",
        },
      }}
    />
  );
};

export default WorkCalendar;
