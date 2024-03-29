import { NextApiRequest, NextApiResponse } from "next";
import {
  initialState as dosInitialState,
  initialWeek as dosInitialWeek,
  remoteWeeks as dosRemoteWeeks,
} from "./dos";

import {
  initialState as swiftInitialState,
  initialWeek as swiftInitialWeek,
  remoteWeeks as swiftRemoteWeeks,
} from "./swift";
import moment from "moment/moment";
import { getICSFileContent, getRemoteDaysForPeriod } from "../../utils/export-utils";

interface ExportNextApiRequest extends NextApiRequest {
  query: {
    team: string;
    startDate: string;
    endDate: string;
    group: string;
  };
}

export default function handler(req: ExportNextApiRequest, res: NextApiResponse) {
  const {
    query: { team, startDate: startDateStr, endDate: endDateStr, group },
    method,
  } = req;

  if (method === "GET") {
    const startDate = moment(startDateStr).startOf("isoWeek").toDate();
    const endDate = new Date(endDateStr);

    let initialState: number[];
    let initialWeek: Date;
    let remoteWeeks: number[][];

    if (team == "dos") {
      initialState = dosInitialState;
      initialWeek = dosInitialWeek;
      remoteWeeks = dosRemoteWeeks;
    } else if (team == "swift") {
      initialState = swiftInitialState;
      initialWeek = swiftInitialWeek;
      remoteWeeks = swiftRemoteWeeks;
    } else {
      res.status(400).send("Unknown Team");
      return;
    }

    if (startDate >= endDate) {
      res.status(400).send("Start date is equal or after end date");
      return;
    }

    if (moment(new Date(endDate)).diff(new Date(startDate), "months", true) > 12) {
      res.status(400).send("Cannot export more than 1 year");
      return;
    }

    const remoteDays = getRemoteDaysForPeriod(
      group,
      startDate,
      endDate,
      initialState,
      initialWeek,
      remoteWeeks
    );

    if (remoteDays.length > 1) {
      const icsContent = getICSFileContent(remoteDays, group, team);
      res
        .status(200)
        .setHeader("Content-disposition", "attachment; filename=remote-days.ics")
        .setHeader("Content-type", "text/calendar;method=REQUEST;charset=utf-8")
        .send(icsContent);
    } else {
      res.status(204).end();
      return;
    }
  }
}
