import { useRouteError } from "react-router";
import {
  AppShell,
  Title,
  Text,
  Stack,
  Image,
  MantineProvider,
} from "@mantine/core";
import warungTheme from "../theme/theme";
import img from "../asset/errorPage.png";
const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <MantineProvider theme={warungTheme}>
      <AppShell header={{ height: 0 }} padding="md">
        <AppShell.Main>
          <Stack align="center" spacing="lg" justify="center" h="100vh">
            <Image src={img} alt="error" w={300} h={300} fit="contain" />
            <Title order={1} c="white" ta="center">
              Error ({error?.status || "Unknown Status"}) :{" "}
              {error?.statusText || "Unknown Error"}
            </Title>
            <Text size="lg" c="white" ta="center">
              {error?.message || "Something went wrong!"}
            </Text>
          </Stack>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export default ErrorPage;
