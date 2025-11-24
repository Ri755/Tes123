import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  Image,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../asset/logo.png";

const PageLayoutPegawai = () => {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header>
        <Container
          fluid
          h="100%"
          style={{ display: "flex", alignItems: "center" }}>
          <Group h="100%" justify="space-between" style={{ flex: 1 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Image src={logo} alt="Logo" h={65} fit="contain" />
            </Link>

            <Group visibleFrom="sm">
              <Link
                to="/pegawai/pesanan"
                style={{ textDecoration: "none", color: "white" }}>
                Pesanan
              </Link>
              <Link
                to="/pegawai/penjualan"
                style={{ textDecoration: "none", color: "white" }}>
                Penjualan
              </Link>
              <Link
                to="/pegawai/menu"
                style={{ textDecoration: "none", color: "white" }}>
                Menu
              </Link>
              <Link
                to="/pegawai/stok"
                style={{ textDecoration: "none", color: "white" }}>
                Stok
              </Link>
              <Link
                to="/pegawai/laporan"
                style={{ textDecoration: "none", color: "white" }}>
                Laporan
              </Link>
              <Link
                to="/pegawai"
                style={{
                  backgroundColor: "red",
                  borderRadius: "10PX",
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "bolder",
                  padding: "5px 10px",
                  textDecoration: "none",
                }}>
                Log Out
              </Link>
            </Group>

            <Menu
              opened={opened}
              onClose={close}
              position="bottom-end"
              offset={15}
              transitionProps={{ transition: "pop", duration: 150 }}
              middlewares={{ shift: true, flip: true }}
              shadow="md"
              width={200}>
              <Menu.Target>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                  color="white"
                />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  to="/pegawai/pesanan"
                  onClick={close}>
                  Pesanan
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  to="/pegawai/penjualan"
                  onClick={close}>
                  Penjualan
                </Menu.Item>
                <Menu.Item component={Link} to="/pegawai/menu" onClick={close}>
                  Menu
                </Menu.Item>
                <Menu.Item component={Link} to="/pegawai/stok" onClick={close}>
                  Stok
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  to="/pegawai/laporan"
                  onClick={close}>
                  Laporan
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  to="/pegawai"
                  onClick={close}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    fontWeight: "bolder",
                  }}>
                  Log Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default PageLayoutPegawai;
