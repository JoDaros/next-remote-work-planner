import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { RxMoon, RxSun } from "react-icons/rx";

function ThemeButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const largeScreen = useMediaQuery("(min-width: 600px)");

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      size={largeScreen ? "xl" : "lg"}
    >
      {dark ? (
        <RxSun style={{ width: 18, height: 18 }} />
      ) : (
        <RxMoon style={{ width: 18, height: 18 }} />
      )}
    </ActionIcon>
  );
}

export default ThemeButton;
