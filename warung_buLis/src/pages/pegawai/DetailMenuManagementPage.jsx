import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Group,
  NumberInput,
  Button,
  Table,
  Title,
  Stack,
  Paper,
  Text,
  Select,
  Container,
} from "@mantine/core";
import { useParams } from "react-router";
import axios from "axios";

export const DetailMenuManagementPage = () => {
  const { id } = useParams();
  const [bahanMenu, setBahanMenu] = useState([]);
  const [bahanOptions, setBahanOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      detail_menu_nama_bahan: "",
      detail_menu_jumlah: "",
      detail_menu_satuan: "",
      detail_menu_harga: "",
    },
  });

  useEffect(() => {
    fetchDataDetailMenu();
    fetchBahanOptions();
  }, [id]);

  const fetchDataDetailMenu = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/menu_management/detail/${id}`
      );

      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : response.data.data
        ? [response.data.data]
        : [];

      setBahanMenu(dataArray);
    } catch (err) {
      console.error(err);
      setBahanMenu([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBahanOptions = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/bahan_baku/`);

      const options = Array.isArray(response.data)
        ? response.data.map((item) => ({
            value: item.bahan_baku_id.toString(),
            label: item.bahan_baku_nama,
          }))
        : [];

      setBahanOptions(options);
    } catch (err) {
      console.error("Failed to fetch bahan options:", err);
      setBahanOptions([]);
    }
  };

  const onAdd = async (data) => {
    try {
      setLoading(true);

      if (
        !data.detail_menu_nama_bahan ||
        !data.detail_menu_satuan ||
        !data.detail_menu_jumlah ||
        !data.detail_menu_harga
      ) {
        return;
      }

      // Find the selected bahan name from options
      const selectedBahan = bahanOptions.find(
        (option) => option.value === data.detail_menu_nama_bahan
      );

      const payload = {
        detail_menu_nama_bahan:
          selectedBahan?.label || data.detail_menu_nama_bahan,
        detail_menu_jumlah: Number(data.detail_menu_jumlah),
        detail_menu_satuan: data.detail_menu_satuan,
        detail_menu_harga: Number(data.detail_menu_harga),
        menu_id: Number(id),
      };

      const response = await axios.post(
        `http://localhost:3000/api/menu_management/detail`,
        payload
      );

      if (response.data && response.data.data) {
        setBahanMenu((prev) => [...prev, response.data.data]);
        reset({
          detail_menu_nama_bahan: null,
          detail_menu_jumlah: "",
          detail_menu_satuan: null,
          detail_menu_harga: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data) => {
    try {
      setLoading(true);

      if (!editingId) {
        return;
      }

      // Find the selected bahan name from options
      const selectedBahan = bahanOptions.find(
        (option) => option.value === data.detail_menu_nama_bahan
      );

      const payload = {
        detail_menu_nama_bahan:
          selectedBahan?.label || data.detail_menu_nama_bahan,
        detail_menu_jumlah: Number(data.detail_menu_jumlah),
        detail_menu_satuan: data.detail_menu_satuan,
        detail_menu_harga: Number(data.detail_menu_harga),
      };

      const response = await axios.put(
        `http://localhost:3000/api/menu_management/detail/${editingId}`,
        payload
      );

      if (response.data && response.data.data) {
        setBahanMenu((prev) =>
          prev.map((item) =>
            item.detail_menu_id === editingId ? response.data.data : item
          )
        );
        reset({
          detail_menu_nama_bahan: null,
          detail_menu_jumlah: "",
          detail_menu_satuan: null,
          detail_menu_harga: "",
        });
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:3000/api/menu_management/detail/${deleteId}`
      );
      setBahanMenu((prev) =>
        prev.filter((item) => item.detail_menu_id !== deleteId)
      );
      reset({
        detail_menu_nama_bahan: null,
        detail_menu_jumlah: "",
        detail_menu_satuan: null,
        detail_menu_harga: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.detail_menu_id);

    // Find the bahan_baku_id from the name
    const selectedBahan = bahanOptions.find(
      (option) => option.label === item.detail_menu_nama_bahan
    );

    setValue("detail_menu_nama_bahan", selectedBahan?.value || "");
    setValue("detail_menu_jumlah", item.detail_menu_jumlah);
    setValue("detail_menu_satuan", item.detail_menu_satuan);
    setValue("detail_menu_harga", item.detail_menu_harga);
  };

  const handleClear = () => {
    reset({
      detail_menu_nama_bahan: null,
      detail_menu_jumlah: "",
      detail_menu_satuan: null,
      detail_menu_harga: "",
    });
    setEditingId(null);
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

  const rows =
    bahanMenu && bahanMenu.length > 0 ? (
      bahanMenu.map((item) => (
        <tr
          key={item.detail_menu_id}
          style={{
            backgroundColor: "white",
            color: "black",
          }}>
          <td style={cellStyle}>{item.detail_menu_id}</td>
          <td style={cellStyle}>{item.detail_menu_nama_bahan}</td>
          <td style={cellStyle}>{item.detail_menu_jumlah}</td>
          <td style={cellStyle}>{item.detail_menu_satuan}</td>
          <td style={cellStyle}>
            {Number(item.detail_menu_harga).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </td>
          <td style={cellStyle}>
            <Group spacing="xs" justify="center">
              <Button
                size="xs"
                color="blue"
                onClick={() => handleEdit(item)}
                disabled={loading}>
                Edit
              </Button>
              <Button
                size="xs"
                color="red"
                onClick={() => handleDelete(item.detail_menu_id)}
                disabled={loading}>
                Delete
              </Button>
            </Group>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
          No data available
        </td>
      </tr>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingTop: 24,
        paddingBottom: 24,
        backgroundColor: "#6b5344",
      }}>
      <Container size="md">
        <Stack spacing="lg">
          <Title order={3}>Detail Menu Management</Title>

          <Paper shadow="sm" p="md" radius="md">
            <Box component="form" onSubmit={handleSubmit(onAdd)}>
              <Stack>
                <Controller
                  control={control}
                  name="detail_menu_nama_bahan"
                  rules={{ required: "Nama bahan is required" }}
                  render={({ field }) => (
                    <Select
                      label="Nama Bahan"
                      placeholder="Masukan nama bahan"
                      data={bahanOptions}
                      searchable
                      {...field}
                      disabled={loading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="detail_menu_jumlah"
                  rules={{ required: "Jumlah is required" }}
                  render={({ field }) => (
                    <NumberInput
                      label="Jumlah"
                      placeholder="Masukan jumlah"
                      {...field}
                      value={field.value || ""}
                      onChange={(value) => field.onChange(value)}
                      disabled={loading}
                      min={1}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="detail_menu_satuan"
                  rules={{ required: "Satuan is required" }}
                  render={({ field }) => (
                    <Select
                      label="Satuan"
                      placeholder="Pilih satuan"
                      data={["kg", "ekor", "liter", "butir", "gram", "ml"]}
                      searchable
                      {...field}
                      disabled={loading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="detail_menu_harga"
                  rules={{ required: "Harga is required" }}
                  render={({ field }) => (
                    <NumberInput
                      label="Harga"
                      placeholder="Masukan harga"
                      {...field}
                      value={field.value || ""}
                      onChange={(value) => field.onChange(value)}
                      disabled={loading}
                      min={1}
                    />
                  )}
                />

                <Group justify="center" mt="lg">
                  <Button
                    type="submit"
                    color="red"
                    size="md"
                    disabled={loading}>
                    Add
                  </Button>

                  <Button
                    type="button"
                    color="blue"
                    size="md"
                    onClick={() => handleSubmit(onUpdate)()}
                    disabled={loading || !editingId}>
                    Update
                  </Button>

                  <Button
                    type="button"
                    color="gray"
                    size="md"
                    onClick={handleClear}
                    disabled={loading}>
                    Clear
                  </Button>
                </Group>
              </Stack>
            </Box>
          </Paper>

          <Paper shadow="sm" p="md" radius="md">
            <Group justify="center" pb="md">
              <Title order={4}>Bandeng Goreng</Title>
            </Group>
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <thead>
                  <tr style={{ backgroundColor: "#8B7355" }}>
                    <th style={headerCellStyle}>ID Bahan</th>
                    <th style={headerCellStyle}>Nama</th>
                    <th style={headerCellStyle}>Jumlah</th>
                    <th style={headerCellStyle}>Satuan</th>
                    <th style={headerCellStyle}>Harga</th>
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

export default DetailMenuManagementPage;
