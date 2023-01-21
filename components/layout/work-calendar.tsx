import { Calendar } from "@mantine/dates";
import { FC } from "react";
import { createStyles, useMantineTheme } from "@mantine/core";
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

  const useStyles = createStyles((theme) => ({
    outside: {
      opacity: 1,
    },
    weekend: {
      color: `${theme.colors.red[5]} !important`,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
    },
  }));

  const { classes, cx } = useStyles();
  return (
    <Calendar
      value={new Date()}
      onMonthChange={props.onMonthChange}
      onChange={() => {}}
      minDate={minDate}
      maxDate={maxDate}
      dayClassName={(date, modifiers) =>
        cx({ [classes.outside]: modifiers.outside, [classes.weekend]: modifiers.weekend })
      }
      dayStyle={(date) => {
        if (props.highlightedDays && props.highlightedDays.length > 0) {
          for (const highlightedDay of props.highlightedDays) {
            if (moment(date).isSame(moment(highlightedDay), "day")) {
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
            theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
          }`,
        },
        day: {
          borderRadius: 0,
        },
        weekdayCell: {
          fontSize: theme.fontSizes.md,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
          border: `1px solid ${
            theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
          }`,
        },
      })}
    />
  );
};

export default WorkCalendar;
