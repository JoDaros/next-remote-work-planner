import type { GetServerSideProps, NextPage } from "next";
import { Text } from "@mantine/core";

const Home: NextPage = () => {
  return <Text>Welcome to Remote Work Planner</Text>;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: "/dos",
      permanent: true,
    },
  };
};
