import { AppProps } from "next/app";
import Head from "next/head";
import {
  AppShell,
  Burger,
  ColorScheme,
  ColorSchemeProvider,
  Divider,
  Group,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import MainLinks from "../components/layout/main-links";
import React, { useState } from "react";
import ThemeButton from "../components/layout/ThemeButton";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [opened, setOpened] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const theme = useMantineTheme();

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const closeBurgerHandler = () => {
    setOpened(false);
  };

  return (
    <>
      <Head>
        <title>Remote Work Planner</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <AppShell
            navbarOffsetBreakpoint="sm"
            fixed
            navbar={
              <Navbar
                padding="md"
                hiddenBreakpoint="sm"
                hidden={!opened}
                width={{ sm: 250, lg: 350 }}
              >
                <div>
                  <MainLinks onClickLink={closeBurgerHandler} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: 0,
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        textAlign: "center",
                      }}
                    >
                      <Divider />
                      <Text color="dimmed" size="xs">
                        João Barros © - Version 2.1 (2022-02-25)
                      </Text>
                    </div>
                  </div>
                </div>
              </Navbar>
            }
            header={
              <Header height={70} padding="md" color={theme.colors.gray[6]}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                    <Burger
                      opened={opened}
                      onClick={() => setOpened((o) => !o)}
                      size="sm"
                      color={theme.colors.gray[6]}
                      mr="xl"
                    />
                  </MediaQuery>
                  <Group position="apart" style={{ width: "100%" }}>
                    <Title order={2}>Remote Work Planner</Title>
                    <ThemeButton />
                  </Group>
                </div>
              </Header>
            }
          >
            <Component {...pageProps} />
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}