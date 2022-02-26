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

const remoteWeeks = [
  [1, 2, 3],
  [3, 4, 5],
];

const initialWeek = new Date(2021, 10, 4);
const initialState = [2, 1];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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
      remoteDays = getRemoteDays(
        queryDate,
        queryGroup,
        initialState,
        initialWeek,
        remoteWeeks
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
