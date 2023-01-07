import type { NextApiRequest, NextApiResponse } from "next";
import moment, { Duration, Moment } from "moment";
import {
  extractRemoteDaysParams,
  getRemoteDays,
  validateRemoteDaysParams,
} from "../../utils/remote-days";

type Data = {
  monthRemoteDays: string[];
};

export const remoteWeeks = [
  [1, 5],
  [4, 5],
  [3, 4],
  [2, 3],
  [1, 2],
];

export const initialWeek = new Date(2023, 0, 2);
export const initialState = [1, 5, 4, 3, 2];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {
    query: { date, group },
    method,
  } = req;

  if (method === "GET") {
    const { queryDate, queryGroup } = extractRemoteDaysParams(date, group);

    if (!validateRemoteDaysParams(queryDate, queryGroup)) {
      res.status(400).end();
      return;
    }

    let remoteDays: Date[];
    try {
      const startDate = moment(queryDate).startOf("month").toDate();
      remoteDays = getRemoteDays(startDate, queryGroup, initialState, initialWeek, remoteWeeks).map(
        (remoteDay) => remoteDay.date
      );

      res.status(200).json({
        monthRemoteDays: remoteDays.map((d) => moment(d).format("YYYY-MM-DD")),
      });
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}
