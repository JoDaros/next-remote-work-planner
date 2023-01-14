import moment, { Duration, Moment } from "moment";
import { number } from "prop-types";

export type RemoteDay = {
  date: Date;
  weekSequence: number;
};

export function getRemoteDays(
  startDate: Date,
  group: string,
  initialState: number[],
  initialWeek: Date,
  remoteWeeks: number[][]
): RemoteDay[] {
  const remoteDays: RemoteDay[] = [];
  let weekType: number;
  let daysOfWeek: number[];
  let weekSequence = 1;

  // first day of the month or initial week
  const firstDay = moment(startDate < initialWeek ? initialWeek : startDate).startOf("day");
  //last friday of the month
  const lastDay = moment(firstDay).add(1, "month").weekday(5);

  const diffWeeksToLastDay = Math.ceil(lastDay.diff(firstDay, "week", true).valueOf());
  const diffWeeksToInitialDate = firstDay.diff(initialWeek, "week", false).valueOf();
  const firstDayOfWeek = firstDay.clone().startOf("isoWeek");

  for (let i = 0; i <= diffWeeksToLastDay; ++i) {
    weekType = (diffWeeksToInitialDate + i + initialState[+group - 1]) % remoteWeeks.length;
    weekType = weekType === 0 ? remoteWeeks.length : weekType;
    daysOfWeek = remoteWeeks[weekType - 1];
    weekSequence = 1;

    for (const dayOfWeek of daysOfWeek) {
      remoteDays.push({ date: firstDayOfWeek.clone().day(dayOfWeek).toDate(), weekSequence });
      ++weekSequence;
    }
    firstDayOfWeek.add("1", "week");
  }

  return remoteDays;
}

export function extractRemoteDaysParams(
  date: string | string[] | undefined,
  group: string | string[] | undefined
) {
  let queryDate: string;
  let queryGroup: string;

  if (Array.isArray(date)) {
    queryDate = date[0];
  } else {
    queryDate = date ? date : "";
  }

  if (Array.isArray(group)) {
    queryGroup = group[0];
  } else {
    queryGroup = group ? group : "";
  }

  return { queryDate, queryGroup };
}

export function validateRemoteDaysParams(queryDate: string, queryGroup: string) {
  if (!moment(queryDate, "YYYY-MM-DD", true).isValid()) {
    return false;
  }
  const groupNumber = +queryGroup;

  return !(!groupNumber || groupNumber < 1 || groupNumber > 5);
}
