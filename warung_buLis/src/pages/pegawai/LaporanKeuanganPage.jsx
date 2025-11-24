import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Title,
  Paper,
  Table,
  Radio,
  Group,
  TextInput,
  Button,
  Text,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axios from "axios";

// Validation Schema
const filterLaporanSchema = Joi.object({
  tanggalStart: Joi.date().optional().allow(null, ""),
  tanggalEnd: Joi.date()
    .optional()
    .allow(null, "")
    .when("tanggalStart", {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref("tanggalStart")).optional(),
    }),
  menuId: Joi.number().integer().positive().optional().allow(null, ""),
  bahanId: Joi.number().integer().positive().optional().allow(null, ""),
});

export const LaporanKeuanganPage = () => {
  const userToken = useSelector((state) => state.user.userToken);

  const [jenisLaporan, setJenisLaporan] = useState("penjualan");
  const [dataPenjualan, setDataPenjualan] = useState([]);
  const [dataPembelian, setDataPembelian] = useState([]);
  const [dataPesanan, setDataPesanan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(filterLaporanSchema),
    defaultValues: {
      tanggalStart: "",
      tanggalEnd: "",
      menuId: "",
      bahanId: "",
    },
  });

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchPenjualan(), fetchPembelian(), fetchPesanan()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data penjualan
  const fetchPenjualan = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        tanggal_awal: filters.tanggalStart || null,
        tanggal_akhir: filters.tanggalEnd || null,
        menu_id: filters.menuId || null,
      };

      const response = await axios.get(
        "http://localhost:3000/api/laporan_keuangan/penjualan",
        {
          params,
          headers: { "x-auth-token": userToken },
        }
      );
      setDataPenjualan(response.data.data || []);
    } catch (error) {
      console.error("Error fetching penjualan:", error);
      setDataPenjualan([]);
      setError("Gagal mengambil data penjualan.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data pembelian
  const fetchPembelian = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        tanggal_awal: filters.tanggalStart || null,
        tanggal_akhir: filters.tanggalEnd || null,
        bahan_baku_id: filters.bahanId || null,
      };

      const response = await axios.get(
        "http://localhost:3000/api/laporan_keuangan/pembelian",
        {
          params,
          headers: { "x-auth-token": userToken },
        }
      );
      setDataPembelian(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pembelian:", error);
      setDataPembelian([]);
      setError("Gagal mengambil data pembelian.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data pesanan
  const fetchPesanan = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        tanggal_awal: filters.tanggalStart || null,
        tanggal_akhir: filters.tanggalEnd || null,
        menu_id: filters.menuId || null,
      };

      const response = await axios.get(
        "http://localhost:3000/api/laporan_keuangan/pesanan",
        {
          params,
          headers: { "x-auth-token": userToken },
        }
      );
      setDataPesanan(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pesanan:", error);
      setDataPesanan([]);
      setError("Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter
  const onApplyFilter = (data) => {
    const filters = {
      tanggalStart: data.tanggalStart,
      tanggalEnd: data.tanggalEnd,
      menuId: data.menuId,
      bahanId: data.bahanId,
    };

    if (jenisLaporan === "penjualan") {
      fetchPenjualan(filters);
    } else if (jenisLaporan === "pembelian") {
      fetchPembelian(filters);
    } else if (jenisLaporan === "pesanan") {
      fetchPesanan(filters);
    } else if (jenisLaporan === "all") {
      fetchPenjualan(filters);
      fetchPembelian(filters);
      fetchPesanan(filters);
    }
  };

  // Calculate totals
  const totalPenjualan = dataPenjualan.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  const totalBiayaTambahan = dataPenjualan.reduce(
    (sum, item) => sum + (item.biaya_tambahan || 0),
    0
  );

  // Total uang muka dihitung dari (subtotal * persentase_uang_muka) untuk setiap transaksi
  const totalUangMuka = dataPenjualan.reduce((sum, item) => {
    const subtotalWithBiaya = (item.subtotal || 0) + (item.biaya_tambahan || 0);
    const uangMuka =
      (subtotalWithBiaya * (item.persentase_uang_muka || 0)) / 100;
    return sum + uangMuka;
  }, 0);

  const totalPembelian = dataPembelian.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  const totalPesanan = dataPesanan.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate percentage
  const calculateUangMuka = (subtotal, biayaTambahan, persentase) => {
    const totalHarga = (subtotal || 0) + (biayaTambahan || 0);
    return (totalHarga * (persentase || 0)) / 100;
  };

  const cellStyle = {
    textAlign: "center",
    border: "1px solid #dee2e6",
    padding: "12px",
  };

  const headerCellStyle = {
    textAlign: "center",
    color: "white",
    fontWeight: 700,
    border: "1px solid #8B7355",
    padding: "12px",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingTop: 24,
        paddingBottom: 24,
        position: "relative",
      }}
    >
      <LoadingOverlay visible={loading} />

      <Container size="xl">
        <Stack spacing="lg">
          {/* Error Alert */}
          {error && (
            <Alert
              title="Error"
              color="red"
              withCloseButton
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Filter Section */}
          <Paper shadow="sm" p="md" radius="md">
            <Stack spacing="md">
              <Title order={4}>Sort By:</Title>

              {/* Jenis Filter */}
              <Group spacing="xl">
                <Text weight={500}>Jenis:</Text>
                <Radio.Group
                  value={jenisLaporan}
                  onChange={setJenisLaporan}
                  name="jenisLaporan"
                >
                  <Group spacing="md">
                    <Radio value="penjualan" label="Penjualan" />
                    <Radio value="pembelian" label="Pembelian" />
                    <Radio value="pesanan" label="Pesanan" />
                    <Radio value="all" label="All" />
                  </Group>
                </Radio.Group>
              </Group>

              {/* Tanggal Filter */}
              <Group spacing="md" align="flex-start">
                <Box style={{ flex: 1 }}>
                  <Text size="sm" weight={500} mb={5}>
                    Tanggal
                  </Text>
                  <Group spacing="xs" align="flex-start">
                    <Box>
                      <Controller
                        control={control}
                        name="tanggalStart"
                        render={({ field }) => (
                          <TextInput
                            type="date"
                            placeholder="Tanggal Mulai"
                            style={{ width: "180px" }}
                            error={errors.tanggalStart?.message}
                            {...field}
                          />
                        )}
                      />
                    </Box>
                    <Text mt={8}>Sampai</Text>
                    <Box>
                      <Controller
                        control={control}
                        name="tanggalEnd"
                        render={({ field }) => (
                          <TextInput
                            type="date"
                            placeholder="Tanggal Akhir"
                            style={{ width: "180px" }}
                            error={errors.tanggalEnd?.message}
                            {...field}
                          />
                        )}
                      />
                    </Box>
                  </Group>
                  {errors.tanggalEnd && (
                    <Text size="xs" color="red" mt={5}>
                      Tanggal akhir harus setelah atau sama dengan tanggal mulai
                    </Text>
                  )}
                </Box>
              </Group>

              {/* Menu ID Filter */}
              <Controller
                control={control}
                name="menuId"
                render={({ field }) => (
                  <TextInput
                    label="Menu ID"
                    placeholder="Masukan ID menu"
                    type="number"
                    style={{ width: "200px" }}
                    error={errors.menuId?.message}
                    {...field}
                  />
                )}
              />

              {/* Bahan ID Filter */}
              <Controller
                control={control}
                name="bahanId"
                render={({ field }) => (
                  <TextInput
                    label="Bahan Baku ID"
                    placeholder="Masukan ID bahan baku"
                    type="number"
                    style={{ width: "200px" }}
                    error={errors.bahanId?.message}
                    {...field}
                  />
                )}
              />

              <Group position="left">
                <Button
                  color="red"
                  onClick={handleSubmit(onApplyFilter)}
                  style={{ borderRadius: "20px" }}
                >
                  Apply Filter
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* Penjualan Section */}
          {(jenisLaporan === "penjualan" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Group justify="center" pb="md">
                <Title order={3}>Penjualan</Title>
              </Group>
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr style={{ backgroundColor: "#8B7355" }}>
                      <th style={headerCellStyle}>ID</th>
                      <th style={headerCellStyle}>Tanggal</th>
                      <th style={headerCellStyle}>Menu ID</th>
                      <th style={headerCellStyle}>Menu Nama</th>
                      <th style={headerCellStyle}>Harga</th>
                      <th style={headerCellStyle}>Jumlah</th>
                      <th style={headerCellStyle}>Subtotal</th>
                      <th style={headerCellStyle}>Biaya Tambahan</th>
                      <th style={headerCellStyle}>Total Harga</th>
                      <th style={headerCellStyle}>% Uang Muka</th>
                      <th style={headerCellStyle}>Uang Muka</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPenjualan.length > 0 ? (
                      dataPenjualan.map((item, index) => {
                        const totalHarga =
                          (item.subtotal || 0) + (item.biaya_tambahan || 0);
                        const uangMuka = calculateUangMuka(
                          item.subtotal,
                          item.biaya_tambahan,
                          item.persentase_uang_muka
                        );

                        return (
                          <tr
                            key={index}
                            style={{
                              backgroundColor: "white",
                              color: "black",
                            }}
                          >
                            <td style={cellStyle}>{item.penjualan_id}</td>
                            <td style={cellStyle}>
                              {formatDate(item.tanggal)}
                            </td>
                            <td style={cellStyle}>{item.menu_id}</td>
                            <td style={cellStyle}>{item.menu_nama}</td>
                            <td style={cellStyle}>
                              Rp{" "}
                              {(item.menu_harga || 0).toLocaleString("id-ID")}
                            </td>
                            <td style={cellStyle}>{item.penjualan_jumlah}</td>
                            <td style={cellStyle}>
                              Rp {(item.subtotal || 0).toLocaleString("id-ID")}
                            </td>
                            <td style={cellStyle}>
                              Rp{" "}
                              {(item.biaya_tambahan || 0).toLocaleString(
                                "id-ID"
                              )}
                            </td>
                            <td style={cellStyle}>
                              Rp {totalHarga.toLocaleString("id-ID")}
                            </td>
                            <td style={cellStyle}>
                              {item.persentase_uang_muka || 0}%
                            </td>
                            <td style={cellStyle}>
                              Rp {uangMuka.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr style={{ backgroundColor: "white", color: "black" }}>
                        <td
                          colSpan={11}
                          style={{ ...cellStyle, textAlign: "center" }}
                        >
                          Tidak ada data penjualan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Box>
              <Stack spacing="xs" align="flex-end" pt="md">
                <Text size="lg" weight={700}>
                  Total Subtotal: Rp {totalPenjualan.toLocaleString("id-ID")}
                </Text>
                <Text size="lg" weight={700}>
                  Total Biaya Tambahan: Rp{" "}
                  {totalBiayaTambahan.toLocaleString("id-ID")}
                </Text>
                <Text size="lg" weight={700}>
                  Total Uang Muka: Rp {totalUangMuka.toLocaleString("id-ID")}
                </Text>
                <Text size="xl" weight={700} style={{ color: "white" }}>
                  Grand Total: Rp{" "}
                  {(
                    totalPenjualan +
                    totalBiayaTambahan -
                    totalUangMuka
                  ).toLocaleString("id-ID")}
                </Text>
              </Stack>
            </Paper>
          )}

          {/* Pembelian Section */}
          {(jenisLaporan === "pembelian" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Group justify="center" pb="md">
                <Title order={3}>Pembelian</Title>
              </Group>
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr style={{ backgroundColor: "#8B7355" }}>
                      <th style={headerCellStyle}>ID</th>
                      <th style={headerCellStyle}>Tanggal</th>
                      <th style={headerCellStyle}>Bahan Baku ID</th>
                      <th style={headerCellStyle}>Bahan Baku Nama</th>
                      <th style={headerCellStyle}>Jumlah</th>
                      <th style={headerCellStyle}>Satuan</th>
                      <th style={headerCellStyle}>Harga/Satuan</th>
                      <th style={headerCellStyle}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPembelian.length > 0 ? (
                      dataPembelian.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: "white",
                            color: "black",
                          }}
                        >
                          <td style={cellStyle}>{item.pembelian_id}</td>
                          <td style={cellStyle}>{formatDate(item.tanggal)}</td>
                          <td style={cellStyle}>{item.bahan_baku_id}</td>
                          <td style={cellStyle}>{item.bahan_baku_nama}</td>
                          <td style={cellStyle}>{item.pembelian_jumlah}</td>
                          <td style={cellStyle}>{item.pembelian_satuan}</td>
                          <td style={cellStyle}>
                            Rp{" "}
                            {(item.pembelian_harga_satuan || 0).toLocaleString(
                              "id-ID"
                            )}
                          </td>
                          <td style={cellStyle}>
                            Rp {(item.subtotal || 0).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ backgroundColor: "white", color: "black" }}>
                        <td
                          colSpan={8}
                          style={{ ...cellStyle, textAlign: "center" }}
                        >
                          Tidak ada data pembelian
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Box>
              <Group justify="flex-end" pt="md">
                <Text size="xl" weight={700}>
                  Total: Rp {totalPembelian.toLocaleString("id-ID")}
                </Text>
              </Group>
            </Paper>
          )}

          {/* Pesanan Section */}
          {(jenisLaporan === "pesanan" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Group justify="center" pb="md">
                <Title order={3}>Pesanan</Title>
              </Group>
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr style={{ backgroundColor: "#8B7355" }}>
                      <th style={headerCellStyle}>Pesanan ID</th>
                      <th style={headerCellStyle}>Nama Pemesan</th>
                      <th style={headerCellStyle}>Status</th>
                      <th style={headerCellStyle}>Tanggal</th>
                      <th style={headerCellStyle}>Menu ID</th>
                      <th style={headerCellStyle}>Menu Nama</th>
                      <th style={headerCellStyle}>Harga</th>
                      <th style={headerCellStyle}>Jumlah</th>
                      <th style={headerCellStyle}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPesanan.length > 0 ? (
                      dataPesanan.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: "white",
                            color: "black",
                          }}
                        >
                          <td style={cellStyle}>{item.pesanan_id}</td>
                          <td style={cellStyle}>{item.pesanan_nama}</td>
                          <td style={cellStyle}>{item.pesanan_status}</td>
                          <td style={cellStyle}>{formatDate(item.tanggal)}</td>
                          <td style={cellStyle}>{item.menu_id}</td>
                          <td style={cellStyle}>{item.menu_nama}</td>
                          <td style={cellStyle}>
                            Rp {(item.menu_harga || 0).toLocaleString("id-ID")}
                          </td>
                          <td style={cellStyle}>
                            {item.pesanan_detail_jumlah}
                          </td>
                          <td style={cellStyle}>
                            Rp {(item.subtotal || 0).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ backgroundColor: "white", color: "black" }}>
                        <td
                          colSpan={9}
                          style={{ ...cellStyle, textAlign: "center" }}
                        >
                          Tidak ada data pesanan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Box>
              <Group justify="flex-end" pt="md">
                <Text size="xl" weight={700}>
                  Total: Rp {totalPesanan.toLocaleString("id-ID")}
                </Text>
              </Group>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default LaporanKeuanganPage;
