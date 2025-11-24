// MainPenjualanPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  TextInput,
  Button,
  Group,
  Text,
  Card,
  Image,
  Grid,
  NumberInput,
  Alert,
  Modal,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCartItems } from "../../slice + storage/cartSlice";
import Joi from "joi";
import axios from "axios";

const MENU_API = "http://localhost:3000/api/menu_management/getall";
const HEADER_API = "http://localhost:3000/api/main_penjualan/header";

// Validation Schema
const headerPenjualanSchema = Joi.object({
  header_penjualan_tanggal: Joi.date().required(),
  header_penjualan_jenis: Joi.string().valid("offline", "online").required(),
  header_penjualan_keterangan: Joi.string().required(),
  header_penjualan_biaya_tambahan: Joi.number().integer().min(0).default(0),
  header_penjualan_uang_muka: Joi.number().integer().min(0).max(100).default(0),
});

const cartItemSchema = Joi.object({
  menu_id: Joi.number().integer().required(),
  menu_nama: Joi.string().required(),
  menu_harga: Joi.number().min(0).required(),
  menu_gambar: Joi.string().allow("", null).optional(),
  penjualan_jumlah: Joi.number().integer().min(1).required(),
});

export const MainPenjualanPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.user);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!userToken) {
      navigate("/pegawai");
    } else {
      loadMenuData();
    }
  }, [userToken, navigate]);

  // Load menu data
  const loadMenuData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(MENU_API, {
        headers: { "x-auth-token": userToken },
      });
      setMenuItems(data);
    } catch (err) {
      console.error("Error loading menu:", err);
      setError("Gagal memuat menu. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Filter active menu items
  const activeMenuItems = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          item.menu_status_aktif === 1 &&
          item.menu_nama.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [menuItems, searchQuery]
  );

  // Validate cart item before adding
  const validateCartItem = (item) => {
    const { error } = cartItemSchema.validate(item, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      setValidationErrors(errors);
      setShowErrorModal(true);
      return false;
    }
    return true;
  };

  // Add item to cart
  const addToCart = useCallback(
    (item) => {
      const qty = quantities[item.menu_id] || 1;

      // Validate quantity
      if (qty < 1) {
        setValidationErrors(["Jumlah minimal adalah 1"]);
        setShowErrorModal(true);
        return;
      }

      if (!Number.isInteger(qty)) {
        setValidationErrors(["Jumlah harus berupa bilangan bulat"]);
        setShowErrorModal(true);
        return;
      }

      const cartItem = {
        menu_id: item.menu_id,
        menu_nama: item.menu_nama,
        menu_harga: item.menu_harga,
        menu_gambar: item.menu_gambar,
        penjualan_jumlah: qty,
      };

      // Validate cart item
      if (!validateCartItem(cartItem)) {
        return;
      }

      dispatch(setCartItems(cartItem));
      setQuantities((prev) => ({ ...prev, [item.menu_id]: 1 }));
      setError(null);
    },
    [quantities, dispatch]
  );

  // Calculate cart total
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.menu_harga * item.penjualan_jumlah,
        0
      ),
    [cartItems]
  );

  // Validate header before creating
  const validateHeader = (headerData) => {
    const { error } = headerPenjualanSchema.validate(headerData, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      setValidationErrors(errors);
      setShowErrorModal(true);
      return false;
    }
    return true;
  };

  // Navigate to detail page with new header
  const proceedToDetail = useCallback(async () => {
    // Validate cart is not empty
    if (cartItems.length === 0) {
      setValidationErrors([
        "Keranjang kosong! Tambahkan menu terlebih dahulu.",
      ]);
      setShowErrorModal(true);
      return;
    }

    // Validate all cart items
    const invalidItems = cartItems.filter((item) => {
      const { error } = cartItemSchema.validate(item);
      return error;
    });

    if (invalidItems.length > 0) {
      setValidationErrors([
        "Beberapa item di keranjang tidak valid. Silakan periksa kembali.",
      ]);
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        header_penjualan_tanggal: new Date(),
        header_penjualan_jenis: "offline",
        header_penjualan_keterangan: "Penjualan menu offline",
        header_penjualan_biaya_tambahan: 0,
        header_penjualan_uang_muka: 0,
      };

      // Validate header payload
      if (!validateHeader(payload)) {
        return;
      }

      const { data } = await axios.post(HEADER_API, payload, {
        headers: { "x-auth-token": userToken },
      });

      const headerId = data.data.header_penjualan_id;
      navigate(`/pegawai/penjualan/detail/${headerId}`);
    } catch (err) {
      console.error("Error creating header:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Terjadi kesalahan";
      setError(`Gagal membuat transaksi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [cartItems, userToken, navigate]);

  // Handle quantity change with validation
  const handleQuantityChange = useCallback((menuId, value) => {
    if (value === null || value === undefined || value === "") {
      setQuantities((prev) => ({ ...prev, [menuId]: 1 }));
      return;
    }

    const numValue = Number(value);

    if (!Number.isInteger(numValue) || numValue < 1) {
      setValidationErrors([
        "Jumlah harus berupa bilangan bulat positif minimal 1",
      ]);
      setShowErrorModal(true);
      return;
    }

    if (numValue > 1000) {
      setValidationErrors(["Jumlah maksimal adalah 1000"]);
      setShowErrorModal(true);
      return;
    }

    setQuantities((prev) => ({ ...prev, [menuId]: numValue }));
  }, []);

  return (
    <Box style={{ minHeight: "100vh", padding: "24px 0" }}>
      <Container size="xl">
        {/* Error Alert */}
        {error && (
          <Alert
            title="Error"
            color="red"
            withCloseButton
            onClose={() => setError(null)}
            mb="md"
          >
            {error}
          </Alert>
        )}

        {/* Validation Error Modal */}
        <Modal
          opened={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Validation Error"
          centered
        >
          <Box>
            {validationErrors.map((err, index) => (
              <Alert key={index} color="red" mb="xs">
                {err}
              </Alert>
            ))}
            <Button
              fullWidth
              mt="md"
              onClick={() => setShowErrorModal(false)}
              color="red"
            >
              OK
            </Button>
          </Box>
        </Modal>

        {/* Header Section */}
        <Box
          style={{
            backgroundColor: "rgba(140, 98, 52, 0.8)",
            borderRadius: "50px",
            padding: "20px 40px",
            marginBottom: "30px",
          }}
        >
          <Group justify="space-between" align="center">
            <Button
              size="lg"
              color="red"
              radius="xl"
              onClick={proceedToDetail}
              loading={loading}
              disabled={loading || cartItems.length === 0}
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                padding: "0 40px",
              }}
            >
              Cart ({cartItems.length})
            </Button>

            <Group gap="xl">
              <Group gap="md">
                <Text size="lg" fw={500} c="white">
                  Total:
                </Text>
                <Text size="xl" fw={700} c="white">
                  Rp {cartTotal.toLocaleString("id-ID")}
                </Text>
              </Group>

              <TextInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu..."
                styles={{
                  input: {
                    backgroundColor: "white",
                    borderRadius: "20px",
                    width: "200px",
                  },
                }}
              />
            </Group>
          </Group>
        </Box>

        {/* Loading State */}
        {loading && menuItems.length === 0 && (
          <Box style={{ textAlign: "center", padding: "40px" }}>
            <Text size="lg" c="dimmed">
              Memuat menu...
            </Text>
          </Box>
        )}

        {/* Empty State */}
        {!loading && activeMenuItems.length === 0 && (
          <Box style={{ textAlign: "center", padding: "40px" }}>
            <Text size="lg" c="dimmed">
              {searchQuery
                ? "Tidak ada menu yang ditemukan"
                : "Tidak ada menu tersedia"}
            </Text>
          </Box>
        )}

        {/* Menu Grid */}
        <Grid gutter="lg">
          {activeMenuItems.map((item) => (
            <Grid.Col key={item.menu_id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card
                shadow="md"
                padding="lg"
                radius="md"
                style={{
                  backgroundColor: "rgba(140, 98, 52, 0.6)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Card.Section>
                  <Image
                    src={item.menu_gambar}
                    height={180}
                    alt={item.menu_nama}
                    fit="cover"
                  />
                </Card.Section>

                <Box mt="md" mb="xs">
                  <Text fw={700} size="xl" c="white">
                    Rp {item.menu_harga.toLocaleString("id-ID")}
                  </Text>
                  <Text size="md" c="white">
                    {item.menu_nama}
                  </Text>
                </Box>

                <NumberInput
                  mt="sm"
                  placeholder="Jumlah"
                  min={1}
                  max={1000}
                  value={quantities[item.menu_id] || 1}
                  onChange={(val) => handleQuantityChange(item.menu_id, val)}
                  styles={{
                    input: {
                      backgroundColor: "white",
                      borderRadius: "10px",
                      color: "black",
                    },
                  }}
                  clampBehavior="strict"
                  allowDecimal={false}
                  allowNegative={false}
                />

                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  color="red"
                  size="md"
                  onClick={() => addToCart(item)}
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Tambah ke Keranjang
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainPenjualanPage;
