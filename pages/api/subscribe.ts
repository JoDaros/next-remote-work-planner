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
import { getStringFromQueryParam } from "../../components/libs/api/api-utils";
import { getICSFileContent, getRemoteDaysForPeriod } from "../../utils/export-utils";

interface SubscribeNextApiRequest extends NextApiRequest {
  query: {
    team: string;
    group: string;
    interval: string;
  };
}

export default function handler(req: SubscribeNextApiRequest, res: NextApiResponse) {
  const {
    query: { team, group, interval },
    method,
  } = req;

  if (method === "GET") {
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

    if (Number.isNaN(group)) {
      res.status(400).send("Group must be numeric");
      return;
    }

    if (Number.isNaN(team)) {
      res.status(400).send("Team must be numeric");
      return;
    }

    const groupNumber = Number(group);

    if (groupNumber < 1 || groupNumber > 5) {
      res.status(400).send("Invalid group number");
      return;
    }

    if (interval !== "1" && interval !== "3" && interval !== "6") {
      res.status(400).send("Invalid interval number");
      return;
    }

    const startDate = moment().startOf("isoWeek").toDate();
    const endDate = moment(startDate).add(interval, "month").toDate();

    if (moment(new Date(endDate)).diff(new Date(startDate), "months", true) > 12) {
      res.status(400).send("Cannot subscribe to more than 1 year");
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
        .setHeader("Content-type", "text/calendar;method=REQUEST;charset=utf-8")
        .send(icsContent);
    } else {
      res.status(400).end("No remote days found for subscription");
      return;
    }
  }
}
