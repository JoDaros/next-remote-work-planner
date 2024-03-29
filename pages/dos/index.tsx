import type { NextPage } from "next";
import RemoteTeam from "../../components/teams/remote-team";
import React, { Fragment } from "react";

const DOS: NextPage = () => {
  const groups = React.useMemo(
    () => [
      { label: "Group 1", value: "1" },
      { label: "Group 2", value: "2" },
      { label: "Group 3", value: "3" },
      { label: "Group 4", value: "4" },
      { label: "Group 5", value: "5" },
    ],
    []
  );

  return (
    <Fragment>
      <RemoteTeam fetchUrl="/api/dos" name="dos" groups={groups} />
    </Fragment>
  );
};

export default DOS;
