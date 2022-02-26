import type { GetServerSideProps, NextPage } from "next";
import { Text } from "@mantine/core";
import RemoteTeam from "../../components/teams/remote-team";

const HalRaz: NextPage = () => {
  return (
    <RemoteTeam
      fetchUrl="/api/swift"
      groups={[
        { label: "HAL", value: "1" },
        { label: "RAZ", value: "2" },
      ]}
    />
  );
};

export default HalRaz;
