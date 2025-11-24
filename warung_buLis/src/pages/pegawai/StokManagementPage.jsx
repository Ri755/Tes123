import React, { useEffect } from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Radio,
  Group,
  TextInput,
  NumberInput,
  Button,
  Table,
  Title,
  Stack,
  Paper,
  Text,
  Select,
  Container,
  Divider,
} from "@mantine/core";
import axios from "axios";

export const StokManagementPage = () => {
  const [mode, setMode] = useState("tambah");
  const [transactionType, setTransactionType] = useState("tambah");
  const [bahanBaku, setBahanBaku] = useState([]);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      bahan_baku_id: "",
      bahan_baku_nama: "",
      bahan_baku_jumlah: 0,
      bahan_baku_satuan: "",
      bahan_baku_harga_satuan: 0,
    },
  });

  const getstok = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/bahan_baku/`);
      setBahanBaku(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getstok();
  }, []);

  const postStok = async (data) => {
    try {
      setLoading(true);
      const bahanBakuBaru = {
        bahan_baku_nama: data.bahan_baku_nama,
        bahan_baku_jumlah: data.bahan_baku_jumlah,
        bahan_baku_satuan: data.bahan_baku_satuan,
        bahan_baku_harga_satuan: data.bahan_baku_harga_satuan,
        bahan_baku_harga: data.bahan_baku_jumlah * data.bahan_baku_harga_satuan,
      };
      const response = await axios.post(
        `http://localhost:3000/api/bahan_baku/new`,
        bahanBakuBaru
      );
      setBahanBaku((s) => [...s, response.data]);
      reset();
      setMode("tambah");

      await getstok();
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStok = async (data) => {
    try {
      setLoading(true);
      const updatedBahan = {
        bahan_baku_nama: data.bahan_baku_nama,
        bahan_baku_jumlah: data.bahan_baku_jumlah,
        bahan_baku_satuan: data.bahan_baku_satuan,
        bahan_baku_harga_satuan: data.bahan_baku_harga_satuan,
        bahan_baku_harga: data.bahan_baku_jumlah * data.bahan_baku_harga_satuan,
      };
      await axios.put(
        `http://localhost:3000/api/bahan_baku/${data.bahan_baku_id}`,
        updatedBahan
      );
      setBahanBaku((s) =>
        s.map((b) =>
          b.bahan_baku_id === data.bahan_baku_id ? { ...b, ...updatedBahan } : b
        )
      );
      reset();
      setMode("tambah");

      await getstok();
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStok = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/bahan_baku/${id}`);
      setBahanBaku((s) => s.filter((b) => b.bahan_baku_id !== id));
      reset();
      setMode("tambah");

      await getstok();
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSubmit = async (data) => {
    try {
      setLoading(true);
      const currentBahan = bahanBaku.find(
        (b) => b.bahan_baku_id === data.bahan_baku_id
      );

      if (!currentBahan) {
        console.error("Bahan baku tidak ditemukan");
        return;
      }

      if (data.bahan_baku_jumlah === 0 || !data.bahan_baku_jumlah) {
        console.error("Jumlah transaksi harus lebih dari 0");
        return;
      }

      let newJumlah;
      if (transactionType === "tambah") {
        newJumlah = currentBahan.bahan_baku_jumlah + data.bahan_baku_jumlah;
      } else {
        newJumlah = currentBahan.bahan_baku_jumlah - data.bahan_baku_jumlah;
        if (newJumlah < 0) {
          console.error("Jumlah stok tidak boleh negatif");
          return;
        }
      }

      const pembelianData = {
        bahan_baku_id: data.bahan_baku_id,
        pembelian_jumlah: data.bahan_baku_jumlah,
        pembelian_satuan: data.bahan_baku_satuan,
        pembelian_harga_satuan: data.bahan_baku_harga_satuan,
      };

      await axios.post(
        `http://localhost:3000/api/bahan_baku/newPembelian`,
        pembelianData
      );

      const updatedBahan = {
        bahan_baku_nama: currentBahan.bahan_baku_nama,
        bahan_baku_jumlah: newJumlah,
        bahan_baku_satuan: currentBahan.bahan_baku_satuan,
        bahan_baku_harga_satuan: currentBahan.bahan_baku_harga_satuan,
        bahan_baku_harga: newJumlah * currentBahan.bahan_baku_harga_satuan,
      };

      await axios.put(
        `http://localhost:3000/api/bahan_baku/${data.bahan_baku_id}`,
        updatedBahan
      );

      setBahanBaku((s) =>
        s.map((b) =>
          b.bahan_baku_id === data.bahan_baku_id ? { ...b, ...updatedBahan } : b
        )
      );

      reset();

      await getstok();
    } catch (error) {
      console.error("Error processing transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    if (mode === "tambah") {
      postStok(data);
      handleClear();
    } else if (mode === "update") {
      handleTransactionSubmit(data);
      handleClear();
    }
  };

  const handleClear = () => {
    reset({
      bahan_baku_id: "",
      bahan_baku_nama: "",
      bahan_baku_jumlah: 0,
      bahan_baku_satuan: null,
      bahan_baku_harga_satuan: 0,
    });
    setMode("tambah");
    setTransactionType("tambah");
  };

  const handleModeChange = (value) => {
    setMode(value);
    if (value === "tambah") {
      reset();
      setTransactionType("tambah");
    }
    if (value === "update") {
      reset();
      setTransactionType("tambah");
    }
  };

  const handleRowClick = (item) => {
    setMode("update");
    setValue("bahan_baku_id", item.bahan_baku_id);
    setValue("bahan_baku_nama", item.bahan_baku_nama);
    setValue("bahan_baku_jumlah", 0);
    setValue("bahan_baku_satuan", item.bahan_baku_satuan);
    setValue("bahan_baku_harga_satuan", item.bahan_baku_harga_satuan);
  };

  const handleDeleteSelected = () => {
    const current = getValues();
    if (!current.bahan_baku_id) return;
    deleteStok(current.bahan_baku_id);
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

  const rows = bahanBaku.map((item, index) => (
    <tr
      key={index}
      style={{
        backgroundColor: "white",
        color: "black",
      }}>
      <td style={cellStyle}>{item.bahan_baku_id}</td>
      <td style={cellStyle}>{item.bahan_baku_nama}</td>
      <td style={cellStyle}>{item.bahan_baku_jumlah}</td>
      <td style={cellStyle}>{item.bahan_baku_satuan}</td>
      <td style={cellStyle}>{item.bahan_baku_harga_satuan}</td>
      <td style={cellStyle}>
        <Button
          size="xs"
          color="blue"
          onClick={() => handleRowClick(item)}
          disabled={loading}>
          Edit
        </Button>
      </td>
    </tr>
  ));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingTop: 24,
        paddingBottom: 24,
      }}>
      <Container size="md">
        <Stack spacing="lg">
          <Title order={3}>Stok Management</Title>

          <Paper shadow="sm" p="md" radius="md">
            <Group position="apart" align="center" spacing="xl">
              <Group align="center" spacing="sm">
                <Text weight={600}>Mode:</Text>

                <Radio.Group
                  value={mode}
                  onChange={handleModeChange}
                  name="mode">
                  <Group spacing="sm">
                    <Radio value="tambah" label="Baru" />
                    <Radio value="update" label="Update" />
                  </Group>
                </Radio.Group>
              </Group>

              <Group>
                <Button
                  variant="filled"
                  color="rgba(125, 125, 125, 1)"
                  onClick={handleClear}
                  disabled={loading}>
                  Clear
                </Button>
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteSelected}
                  disabled={!getValues().bahan_baku_id || loading}>
                  Delete
                </Button>
              </Group>
            </Group>

            <Divider my="md" />

            {mode === "update" && (
              <Group align="center" spacing="sm">
                <Text weight={600}>Tipe:</Text>
                <Radio.Group
                  value={transactionType}
                  onChange={setTransactionType}
                  name="transactionType">
                  <Group spacing="sm">
                    <Radio value="tambah" label="Tambah" />
                    <Radio value="kurang" label="Kurang" />
                  </Group>
                </Radio.Group>
              </Group>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} mt="md">
              <Stack>
                <Controller
                  control={control}
                  name="bahan_baku_nama"
                  render={({ field }) => (
                    <TextInput
                      label="Nama Bahan"
                      placeholder="Masukkan nama bahan"
                      {...field}
                      disabled={loading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bahan_baku_jumlah"
                  render={({ field }) => (
                    <NumberInput
                      label={
                        mode === "update"
                          ? `Jumlah (${
                              transactionType === "tambah" ? "Tambah" : "Kurang"
                            })`
                          : "Jumlah"
                      }
                      placeholder="Jumlah"
                      min={1}
                      {...field}
                      value={field.value || 0}
                      onChange={(val) => field.onChange(val ?? 0)}
                      disabled={loading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bahan_baku_satuan"
                  render={({ field }) => (
                    <Select
                      label="Satuan"
                      placeholder="Pilih satuan atau ketik"
                      data={["kg", "ekor", "liter", "butir", "gram", "ml"]}
                      searchable
                      {...field}
                      disabled={loading || mode === "update"}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bahan_baku_harga_satuan"
                  render={({ field }) => (
                    <NumberInput
                      label="Harga Per Satuan"
                      placeholder="Harga per satuan"
                      min={1}
                      {...field}
                      value={field.value || 0}
                      onChange={(val) => field.onChange(val ?? 0)}
                      disabled={loading || mode === "update"}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bahan_baku_id"
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                <Group justify="center" mt="sm">
                  <Button
                    type="submit"
                    color="blue"
                    disabled={
                      loading ||
                      (mode === "update" && !getValues().bahan_baku_id)
                    }
                    size="md">
                    {mode === "tambah"
                      ? "Submit"
                      : transactionType === "tambah"
                      ? "Tambah Stok"
                      : "Kurang Stok"}
                  </Button>
                </Group>
              </Stack>
            </Box>
          </Paper>

          <Paper shadow="sm" p="md" radius="md">
            <Group justify="center" pb="md">
              <Title order={4}>Bahan Baku</Title>
            </Group>
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <thead>
                  <tr style={{ backgroundColor: "#8B7355" }}>
                    <th style={headerCellStyle}>ID Bahan</th>
                    <th style={headerCellStyle}>Nama</th>
                    <th style={headerCellStyle}>Jumlah</th>
                    <th style={headerCellStyle}>Satuan</th>
                    <th style={headerCellStyle}>Harga/Satuan</th>
                    <th style={headerCellStyle}>Aksi</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
