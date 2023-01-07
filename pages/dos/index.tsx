import type { NextPage } from "next";
import RemoteTeam from "../../components/teams/remote-team";
import { Fragment } from "react";
import { ColorSwatch } from "@mantine/core";

const DOS: NextPage = () => {
  return (
    <Fragment>
      <RemoteTeam
        fetchUrl="/api/dos"
        name="dos"
        groups={[
          { label: "Group 1", value: "1" },
          { label: "Group 2", value: "2" },
          { label: "Group 3", value: "3" },
          { label: "Group 4", value: "4" },
          { label: "Group 5", value: "5" },
        ]}
      />
    </Fragment>
  );
};

export default DOS;
