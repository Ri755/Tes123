import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppShell,
  Box,
  Container,
  Stack,
  Title,
  TextInput,
  Button,
  Paper,
  Group,
  Text,
  Divider,
  Image,
} from "@mantine/core";
import logo from "../../asset/logo.png";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuTerpilih = useSelector((state) => state.menu.menuTerpilih);

  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const items = menuTerpilih || [];
    return items.map((item, index) => ({
      ...item,
      tempId: `${item.menu_id}-${index}-${Date.now()}`,
    }));
  });

  const [form, setForm] = useState({
    pesanan_nama: "",
    pesanan_email: "",
    pesanan_lokasi: "",
    pesanan_tanggal_pengiriman: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate pesanan_nama
    if (!form.pesanan_nama.trim()) {
      newErrors.pesanan_nama = "Nama penerima wajib diisi";
    } else if (form.pesanan_nama.trim().length < 3) {
      newErrors.pesanan_nama = "Nama minimal 3 karakter";
    }

    // Validate pesanan_email
    if (!form.pesanan_email.trim()) {
      newErrors.pesanan_email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.pesanan_email)) {
      newErrors.pesanan_email = "Email harus valid";
    }

    // Validate pesanan_lokasi
    if (!form.pesanan_lokasi.trim()) {
      newErrors.pesanan_lokasi = "Lokasi pengiriman wajib diisi";
    } else if (form.pesanan_lokasi.trim().length < 5) {
      newErrors.pesanan_lokasi = "Lokasi minimal 5 karakter";
    }

    // Validate pesanan_tanggal_pengiriman
    if (!form.pesanan_tanggal_pengiriman) {
      newErrors.pesanan_tanggal_pengiriman = "Tanggal pengiriman wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuantityChange = (tempId, delta) => {
    setCartItems((items) => {
      const updatedItems = items
        .map((item) => {
          if (item.tempId === tempId) {
            const newQuantity = Math.max(0, item.pesanan_detail_jumlah + delta);
            return {
              ...item,
              pesanan_detail_jumlah: newQuantity,
            };
          }
          return item;
        })
        .filter((item) => item.pesanan_detail_jumlah > 0);

      return updatedItems;
    });
  };

  const handleFormChange = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
    // Clear error untuk field yang sedang diubah
    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };

  const handleCheckOut = async () => {
    try {
      // Validasi form
      if (!validateForm()) {
        return;
      }

      // Validasi cart tidak kosong
      if (cartItems.length === 0) {
        alert("Keranjang tidak boleh kosong");
        return;
      }

      setLoading(true);

      // Create Pesanan Header
      const pesananResponse = await axios.post(
        "http://localhost:3000/api/pesanan_detail/detail/header",
        {
          pesanan_nama: form.pesanan_nama.trim(),
          pesanan_email: form.pesanan_email.trim().toLowerCase(),
          pesanan_lokasi: form.pesanan_lokasi.trim(),
          pesanan_tanggal: new Date().toISOString().split("T")[0],
          pesanan_tanggal_pengiriman: form.pesanan_tanggal_pengiriman,
        }
      );

      const pesanan_id =
        pesananResponse.data.data?.pesanan_id || pesananResponse.data.data?.id;

      if (!pesanan_id) {
        throw new Error("Gagal mendapatkan ID pesanan dari server");
      }

      console.log("Pesanan created with ID:", pesanan_id);

      // Create Pesanan Details
      const detailPromises = cartItems.map((item) =>
        axios.post("http://localhost:3000/api/pesanan_detail/detail/detail", {
          menu_id: item.menu_id,
          pesanan_detail_jumlah: item.pesanan_detail_jumlah,
          pesanan_id: pesanan_id,
        })
      );

      const detailResponses = await Promise.all(detailPromises);
      console.log("All pesanan details created:", detailResponses);

      alert("Pesanan berhasil dibuat! Status: Pending");

      // Reset form dan cart
      setCartItems([]);
      setForm({
        pesanan_nama: "",
        pesanan_email: "",
        pesanan_lokasi: "",
        pesanan_tanggal_pengiriman: "",
      });
      setErrors({});

      // Optional: Navigate ke halaman success atau order tracking
      // navigate(`/order/${pesanan_id}`);
    } catch (error) {
      console.error("Error during checkout:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat membuat pesanan";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const totalHarga = cartItems.reduce(
    (sum, item) => sum + item.price * item.pesanan_detail_jumlah,
    0
  );

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
            Keranjang
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
        <Box style={{ minHeight: "100vh", paddingTop: 24, paddingBottom: 24 }}>
          <Container size="sm">
            <Stack gap="lg">
              <Paper shadow="sm" p="md" radius="md">
                <Stack gap="md">
                  <div>
                    <TextInput
                      label={
                        <Text fw={700} size="md">
                          Nama Penerima
                        </Text>
                      }
                      placeholder="Masukkan nama penerima"
                      value={form.pesanan_nama}
                      onChange={(e) =>
                        handleFormChange("pesanan_nama", e.target.value)
                      }
                      error={errors.pesanan_nama ? true : false}
                      required
                      styles={{
                        input: {
                          "&::placeholder": {
                            color: "white",
                            fontWeight: "700",
                            opacity: "1",
                          },
                        },
                      }}
                    />
                    {errors.pesanan_nama && (
                      <Text size="sm" c="red" fw={700} mt={4}>
                        {errors.pesanan_nama}
                      </Text>
                    )}
                  </div>

                  <div>
                    <TextInput
                      label={
                        <Text fw={700} size="md">
                          Email
                        </Text>
                      }
                      placeholder="Masukkan email Anda"
                      type="email"
                      value={form.pesanan_email}
                      onChange={(e) =>
                        handleFormChange("pesanan_email", e.target.value)
                      }
                      error={errors.pesanan_email ? true : false}
                      required
                      styles={{
                        input: {
                          "&::placeholder": {
                            color: "white",
                            fontWeight: "700",
                            opacity: "1",
                          },
                        },
                      }}
                    />
                    {errors.pesanan_email && (
                      <Text size="sm" c="red" fw={700} mt={4}>
                        {errors.pesanan_email}
                      </Text>
                    )}
                  </div>

                  <div>
                    <TextInput
                      label={
                        <Text fw={700} size="md">
                          Lokasi Pengiriman
                        </Text>
                      }
                      placeholder="Masukkan lokasi pengiriman lengkap"
                      value={form.pesanan_lokasi}
                      onChange={(e) =>
                        handleFormChange("pesanan_lokasi", e.target.value)
                      }
                      error={errors.pesanan_lokasi ? true : false}
                      required
                      styles={{
                        input: {
                          "&::placeholder": {
                            color: "white",
                            fontWeight: "700",
                            opacity: "1",
                          },
                        },
                      }}
                    />
                    {errors.pesanan_lokasi && (
                      <Text size="sm" c="red" fw={700} mt={4}>
                        {errors.pesanan_lokasi}
                      </Text>
                    )}
                  </div>

                  <div>
                    <TextInput
                      label={
                        <Text fw={700} size="md">
                          Tanggal Pengiriman
                        </Text>
                      }
                      placeholder="YYYY-MM-DD"
                      type="date"
                      value={form.pesanan_tanggal_pengiriman}
                      onChange={(e) =>
                        handleFormChange(
                          "pesanan_tanggal_pengiriman",
                          e.target.value
                        )
                      }
                      error={errors.pesanan_tanggal_pengiriman ? true : false}
                      required
                      styles={{
                        input: {
                          "&::placeholder": {
                            color: "white",
                            fontWeight: "700",
                            opacity: "1",
                          },
                        },
                      }}
                    />
                    {errors.pesanan_tanggal_pengiriman && (
                      <Text size="sm" c="red" fw={700} mt={4}>
                        {errors.pesanan_tanggal_pengiriman}
                      </Text>
                    )}
                  </div>
                </Stack>
              </Paper>

              <Paper shadow="sm" p="md" radius="md">
                <Stack gap="md">
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems.map((item) => (
                        <Box key={item.tempId}>
                          <Group
                            justify="space-between"
                            align="flex-start"
                            pb="md">
                            <Box style={{ flex: 1 }}>
                              <Text fw={500}>{item.name}</Text>
                              <Text size="sm">
                                Rp {item.price.toLocaleString("id-ID")}
                              </Text>
                              <Text size="xs" c="white" mt={4}>
                                Subtotal: Rp{" "}
                                {(
                                  item.price * item.pesanan_detail_jumlah
                                ).toLocaleString("id-ID")}
                              </Text>
                            </Box>

                            <Box style={{ width: 120, flexShrink: 0 }}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                radius="md"
                                height={80}
                                fit="cover"
                              />
                              <Group
                                justify="center"
                                mt={6}
                                gap={2}
                                wrap="nowrap">
                                <Button
                                  size="xs"
                                  color="red"
                                  onClick={() =>
                                    handleQuantityChange(item.tempId, -1)
                                  }
                                  style={{ flex: 1 }}>
                                  -
                                </Button>
                                <Text
                                  size="sm"
                                  ta="center"
                                  fw={600}
                                  style={{
                                    flex: 1,
                                    minWidth: 24,
                                  }}>
                                  {item.pesanan_detail_jumlah}
                                </Text>
                                <Button
                                  size="xs"
                                  color="green"
                                  onClick={() =>
                                    handleQuantityChange(item.tempId, 1)
                                  }
                                  style={{ flex: 1 }}>
                                  +
                                </Button>
                              </Group>
                            </Box>
                          </Group>
                          <Divider />
                        </Box>
                      ))}

                      <Group justify="space-between" pt="md">
                        <Text fw={600} size="lg">
                          Total
                        </Text>
                        <Text fw={600} size="lg" c="red">
                          Rp {totalHarga.toLocaleString("id-ID")}
                        </Text>
                      </Group>

                      <Button
                        fullWidth
                        color="red"
                        size="md"
                        onClick={handleCheckOut}
                        loading={loading}
                        disabled={loading || cartItems.length === 0}>
                        {loading ? "Processing..." : "Check Out"}
                      </Button>
                    </>
                  ) : (
                    <Text ta="center" py="xl" c="dimmed">
                      Keranjang Anda kosong
                    </Text>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default CartPage;
