import moment, { Duration, Moment } from "moment";
import { number } from "prop-types";

// const remoteWeeks = [
//   [1, 2, 3],
//   [3, 4, 5],
// ];
//
// const initialWeek = new Date(2021, 10, 4);
// const initialState = [1, 2];

export function getRemoteDays(
  queryDate: string,
  group: string,
  initialState: number[],
  initialWeek: Date,
  remoteWeeks: number[][]
) {
  const inputDate = new Date(queryDate);
  const remoteDays: Date[] = [];
  const firstDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
  console.log("First day:", firstDay);
  const lastDay = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth() + 1,
    0
  );

  let inputMoment: Moment;
  let initialMoment: Moment;
  let diff: Duration;
  let diffWeeks: number;
  let weekType: number;
  let daysOfWeek: number[];
  const aux = firstDay;
  while (aux < lastDay && aux !== lastDay) {
    inputMoment = moment(aux).startOf("week");
    initialMoment = moment(initialWeek);
    diff = moment.duration(inputMoment.diff(initialMoment));
    diffWeeks = Math.floor(diff.asWeeks());
    weekType = (diffWeeks + initialState[+group - 1]) % remoteWeeks.length;
    weekType = weekType === 0 ? remoteWeeks.length : weekType;
    daysOfWeek = remoteWeeks[weekType - 1];

    for (const dayOfWeek of daysOfWeek) {
      remoteDays.push(inputMoment.day(dayOfWeek).toDate());
    }
    aux.setDate(aux.getDate() + 7);
  }
  return remoteDays;
}

export function extractRemoteDaysParams(
  date: string | string[],
  group: string | string[]
) {
  let queryDate: string;
  let queryGroup: string;

  if (Array.isArray(date)) {
    queryDate = date[0];
  } else {
    queryDate = date;
  }

  if (Array.isArray(group)) {
    queryGroup = group[0];
  } else {
    queryGroup = group;
  }

  return { queryDate, queryGroup };
}

export function validateRemoteDaysParams(
  queryDate: string,
  queryGroup: string
) {
  if (!moment(queryDate, "YYYY-MM-DD", true).isValid()) {
    return false;
  }
  const groupNumber = +queryGroup;

  if (!groupNumber || groupNumber < 1 || groupNumber > 5) {
    return false;
  }
  return true;
}

function getMonday(d: Date) {
  const day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}
