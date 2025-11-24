import React, { useState } from "react";
import {
  AppShell,
  Group,
  Image,
  Title,
  Button,
  TextInput,
  Container,
  Table,
  Badge,
  Stack,
  Text,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import logo from "../../asset/logo.png";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setHistory([]);
    if (!email.trim()) {
      setError("Masukkan email terlebih dahulu");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/history/search?pesanan_email=${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Gagal mengambil data history");
        setHistory([]);
        return;
      }

      setHistory(data.data || []);
      if (data.data.length === 0) {
        setError("Tidak ada history pesanan untuk email ini");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat mengambil data: " + err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "diproses":
        return "blue";
      case "terkirim":
        return "green";
      default:
        return "gray";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotal = (details) => {
    return details.reduce((sum, detail) => {
      return sum + (detail.menu_harga * detail.pesanan_detail_jumlah || 0);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          align="center"
          grow={false}>
          <Image
            src={logo}
            alt="Logo"
            h={70}
            w={70}
            fit="contain"
            style={{ flexShrink: 0 }}
          />

          <Title order={3} style={{ flex: 1, textAlign: "center" }}>
            History Pesanan
          </Title>

          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/customer")}
            style={{ flexShrink: 0 }}>
            Kembali
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" py="xl">
          <Stack gap="lg">
            <Stack gap="sm">
              <Group grow>
                <TextInput
                  placeholder="nama@email.com"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  error={error && searched ? error : ""}
                />
                <Button
                  onClick={handleSearch}
                  loading={loading}
                  mt="auto"
                  style={{ backgroundColor: "#CC0000" }}>
                  Cari
                </Button>
              </Group>
            </Stack>

            {loading && (
              <Center py="xl">
                <Loader size="md" />
              </Center>
            )}

            {!loading && searched && history.length > 0 && (
              <Stack gap="md">
                <Text fw={600} size="md">
                  Ditemukan {history.length} pesanan
                </Text>

                {history.map((pesanan) => (
                  <Stack
                    key={pesanan.pesanan_id}
                    gap="sm"
                    p="md"
                    style={{
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                    }}>
                    <Group justify="space-between">
                      <div>
                        <Text size="md">Nama: {pesanan.pesanan_nama}</Text>
                      </div>
                      <Badge color={getStatusColor(pesanan.pesanan_status)}>
                        {pesanan.pesanan_status.charAt(0).toUpperCase() +
                          pesanan.pesanan_status.slice(1)}
                      </Badge>
                    </Group>

                    <Group grow>
                      <div>
                        <Text size="xs" c="dimmed">
                          Lokasi
                        </Text>
                        <Text size="sm">{pesanan.pesanan_lokasi}</Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Tanggal Pesanan
                        </Text>
                        <Text size="sm">
                          {formatDate(pesanan.pesanan_tanggal)}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Tanggal Pengiriman
                        </Text>
                        <Text size="sm">
                          {formatDate(pesanan.pesanan_tanggal_pengiriman)}
                        </Text>
                      </div>
                    </Group>

                    {pesanan.details && pesanan.details.length > 0 && (
                      <Stack gap="xs">
                        <Text size="xs" fw={500} c="dimmed">
                          Detail Pesanan:
                        </Text>
                        <Table size="sm">
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Menu</Table.Th>
                              <Table.Th align="center">Harga</Table.Th>
                              <Table.Th align="center">Jumlah</Table.Th>
                              <Table.Th align="right">Subtotal</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {pesanan.details.map((detail) => (
                              <Table.Tr key={detail.pesanan_detail_id}>
                                <Table.Td>{detail.menu_nama}</Table.Td>
                                <Table.Td align="center">
                                  {formatCurrency(detail.menu_harga)}
                                </Table.Td>
                                <Table.Td align="center">
                                  {detail.pesanan_detail_jumlah}
                                </Table.Td>
                                <Table.Td align="right">
                                  {formatCurrency(
                                    detail.menu_harga *
                                      detail.pesanan_detail_jumlah
                                  )}
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                        <Group justify="flex-end">
                          <Text fw={600}>
                            Total:{" "}
                            {formatCurrency(calculateTotal(pesanan.details))}
                          </Text>
                        </Group>
                      </Stack>
                    )}
                  </Stack>
                ))}
              </Stack>
            )}

            {!loading && !searched && (
              <Center py="xl">
                <Text>Masukkan email untuk melihat history pesanan</Text>
              </Center>
            )}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default HistoryPage;
