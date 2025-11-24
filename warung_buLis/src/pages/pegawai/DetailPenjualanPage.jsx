// DetailPenjualanPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Button,
  Group,
  Divider,
  Radio,
  TextInput,
  NumberInput,
  Table,
  Paper,
  LoadingOverlay,
  Modal,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../../slice + storage/cartSlice";
import axios from "axios";

const API_URL = "http://localhost:3000/api/detail_penjualan";

export const DetailPenjualanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.user);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [formData, setFormData] = useState({
    jenisPenjualan: "offline",
    keterangan: "",
    biayaTambahan: 0,
    uangMuka: 0,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    if (id) loadPenjualanData();
  }, [id]);

  // Load data penjualan
  const loadPenjualanData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${id}`, {
        headers: { "x-auth-token": userToken },
      });

      const penjualanData = data?.data;
      if (penjualanData) {
        setHeaderData(penjualanData);
        setDetailData(penjualanData.penjualans || []);
        setFormData({
          jenisPenjualan: penjualanData.header_penjualan_jenis,
          keterangan: penjualanData.header_penjualan_keterangan,
          biayaTambahan: penjualanData.header_penjualan_biaya_tambahan,
          uangMuka: penjualanData.header_penjualan_uang_muka,
        });
      }
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Gagal memuat data penjualan");
    } finally {
      setLoading(false);
    }
  }, [id, userToken]);

  // Update form field
  const updateFormField = useCallback((field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "jenisPenjualan" && value === "offline") {
        updated.uangMuka = 0;
      }
      return updated;
    });
  }, []);

  // Update cart quantity
  const modifyQuantity = useCallback(
    (menuId, newQty) => {
      newQty <= 0
        ? dispatch(removeCartItem(menuId))
        : dispatch(
            updateCartItemQuantity({
              menu_id: menuId,
              penjualan_jumlah: newQty,
            })
          );
    },
    [dispatch]
  );

  // Calculate totals
  const totals = useMemo(() => {
    const dbTotal = detailData.reduce(
      (sum, item) =>
        sum + (item.menu?.menu_harga || 0) * (item.penjualan_jumlah || 0),
      0
    );
    const cartTotal = cartItems.reduce(
      (sum, item) => sum + item.menu_harga * item.penjualan_jumlah,
      0
    );
    const subtotal = dbTotal + cartTotal;
    const biayaTambahan = formData.biayaTambahan || 0;
    const grand = subtotal + biayaTambahan;
    const uangMukaAmt =
      formData.jenisPenjualan === "online"
        ? (grand * (formData.uangMuka || 0)) / 100
        : 0;
    const sisaPembayaran = grand - uangMukaAmt;

    return {
      dbTotal,
      cartTotal,
      subtotal,
      biayaTambahan,
      grand,
      uangMukaAmt,
      sisaPembayaran,
    };
  }, [
    detailData,
    cartItems,
    formData.biayaTambahan,
    formData.uangMuka,
    formData.jenisPenjualan,
  ]);

  // Save cart items to database
  const saveCartItems = useCallback(async () => {
    if (cartItems.length === 0) {
      alert("Tidak ada item untuk disimpan!");
      return false;
    }

    setLoading(true);
    try {
      await Promise.all(
        cartItems.map((item) =>
          axios.post(
            `${API_URL}/detail`,
            {
              header_penjualan_id: parseInt(id),
              menu_id: item.menu_id,
              penjualan_jumlah: item.penjualan_jumlah,
            },
            { headers: { "x-auth-token": userToken } }
          )
        )
      );

      alert("Detail penjualan berhasil disimpan!");
      await loadPenjualanData();
      dispatch(clearCart());
      return true;
    } catch (err) {
      console.error("Error saving details:", err);
      alert(`Gagal menyimpan: ${err.response?.data?.message || err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cartItems, id, userToken, loadPenjualanData, dispatch]);

  // Update header
  const saveHeader = useCallback(async () => {
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/header/${id}`,
        {
          header_penjualan_tanggal: new Date().toISOString(),
          header_penjualan_jenis: formData.jenisPenjualan,
          header_penjualan_keterangan: formData.keterangan,
          header_penjualan_biaya_tambahan: formData.biayaTambahan || 0,
          header_penjualan_uang_muka:
            formData.jenisPenjualan === "online" ? formData.uangMuka || 0 : 0,
        },
        { headers: { "x-auth-token": userToken } }
      );

      alert("Header berhasil diupdate!");
      await loadPenjualanData();
      return true;
    } catch (err) {
      console.error("Error updating header:", err);
      alert(`Gagal update: ${err.response?.data?.message || err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, formData, userToken, loadPenjualanData]);

  // Finalize transaction
  const finalizeTransaction = useCallback(async () => {
    try {
      if (cartItems.length > 0) {
        const saved = await saveCartItems();
        if (!saved) return;
      }

      await saveHeader();
      alert("Transaksi berhasil diselesaikan!");
      dispatch(clearCart());
      navigate("/pegawai/penjualan");
    } catch (err) {
      console.error("Error finalizing:", err);
    }
  }, [cartItems, saveCartItems, saveHeader, dispatch, navigate]);

  return (
    <Box
      style={{ minHeight: "100vh", padding: "24px 0", position: "relative" }}
    >
      <LoadingOverlay visible={loading} />

      <Container size="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="xl" fw={700} c="white">
              Header Penjualan #{id}
            </Text>
            <Button
              variant="default"
              onClick={() => navigate("/pegawai/penjualan")}
            >
              Kembali
            </Button>
          </Group>

          {/* Header Info */}
          {headerData && (
            <Paper shadow="sm" p="md" radius="md">
              <Stack gap="md">
                <Text fw={600} size="lg">
                  Informasi Header
                </Text>
                <Group gap="xl" wrap="wrap">
                  <div>
                    <Text size="sm" c="gold">
                      Tanggal
                    </Text>
                    <Text fw={500}>
                      {new Date(
                        headerData.header_penjualan_tanggal
                      ).toLocaleString("id-ID")}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="gold">
                      Jenis
                    </Text>
                    <Text fw={500} tt="capitalize">
                      {headerData.header_penjualan_jenis}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="gold">
                      Status
                    </Text>
                    <Text fw={500}>
                      {detailData.length > 0
                        ? "Ada detail"
                        : "Belum ada detail"}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="gold">
                      Keterangan
                    </Text>
                    <Text fw={500}>
                      {headerData.header_penjualan_keterangan || "-"}
                    </Text>
                  </div>
                </Group>

                {/* Rincian Biaya */}
                <Divider label="Rincian Biaya" labelPosition="center" />
                <Group gap="xl" wrap="wrap">
                  <div>
                    <Text size="sm" c="gold">
                      Subtotal Menu
                    </Text>
                    <Text fw={600} size="lg">
                      Rp {totals.dbTotal.toLocaleString("id-ID")}
                    </Text>
                  </div>
                  {headerData.header_penjualan_biaya_tambahan > 0 && (
                    <div>
                      <Text size="sm" c="orange">
                        Biaya Tambahan
                      </Text>
                      <Text fw={600} size="lg" c="orange">
                        Rp{" "}
                        {(
                          headerData.header_penjualan_biaya_tambahan || 0
                        ).toLocaleString("id-ID")}
                      </Text>
                    </div>
                  )}
                  <div>
                    <Text size="sm" c="red">
                      Total Keseluruhan
                    </Text>
                    <Text fw={700} size="xl" c="red">
                      Rp{" "}
                      {(
                        totals.dbTotal +
                        (headerData.header_penjualan_biaya_tambahan || 0)
                      ).toLocaleString("id-ID")}
                    </Text>
                  </div>
                  {headerData.header_penjualan_jenis === "online" &&
                    headerData.header_penjualan_uang_muka > 0 && (
                      <>
                        <div>
                          <Text size="sm" c="blue">
                            Uang Muka
                          </Text>
                          <Text fw={600} size="lg" c="blue">
                            {headerData.header_penjualan_uang_muka}%{" (Rp "}
                            {(
                              ((totals.dbTotal +
                                (headerData.header_penjualan_biaya_tambahan ||
                                  0)) *
                                headerData.header_penjualan_uang_muka) /
                              100
                            ).toLocaleString("id-ID")}
                            {")"}
                          </Text>
                        </div>
                        <div>
                          <Text size="sm" c="grape">
                            Sisa Pembayaran
                          </Text>
                          <Text fw={600} size="lg" c="grape">
                            Rp{" "}
                            {(
                              totals.dbTotal +
                              (headerData.header_penjualan_biaya_tambahan ||
                                0) -
                              ((totals.dbTotal +
                                (headerData.header_penjualan_biaya_tambahan ||
                                  0)) *
                                headerData.header_penjualan_uang_muka) /
                                100
                            ).toLocaleString("id-ID")}
                          </Text>
                        </div>
                      </>
                    )}
                </Group>
              </Stack>
            </Paper>
          )}

          {/* Detail from DB */}
          {detailData?.length > 0 && (
            <Paper shadow="sm" p="md" radius="md">
              <Text fw={600} size="lg" mb="md">
                Detail Penjualan (Database)
              </Text>
              <Table striped highlightOnHover>
                <Table.Thead c="gold">
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Menu</Table.Th>
                    <Table.Th>Harga</Table.Th>
                    <Table.Th>Jumlah</Table.Th>
                    <Table.Th>Subtotal</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody c="black">
                  {detailData.map((item) => (
                    <Table.Tr key={item.penjualan_id}>
                      <Table.Td>{item.penjualan_id}</Table.Td>
                      <Table.Td>{item.menu?.menu_nama || "N/A"}</Table.Td>
                      <Table.Td>
                        Rp{" "}
                        {(item.menu?.menu_harga || 0).toLocaleString("id-ID")}
                      </Table.Td>
                      <Table.Td>{item.penjualan_jumlah}</Table.Td>
                      <Table.Td>
                        Rp{" "}
                        {(
                          (item.menu?.menu_harga || 0) * item.penjualan_jumlah
                        ).toLocaleString("id-ID")}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Divider my="md" />
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={500}>Subtotal Menu:</Text>
                  <Text fw={500}>
                    Rp {totals.dbTotal.toLocaleString("id-ID")}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} c="orange">
                    Biaya Tambahan:
                  </Text>
                  <Text fw={500} c="orange">
                    Rp{" "}
                    {(
                      headerData.header_penjualan_biaya_tambahan || 0
                    ).toLocaleString("id-ID")}
                  </Text>
                </Group>
                <Divider my="xs" />
                <Group justify="space-between">
                  <Text fw={700} size="lg">
                    Total Keseluruhan:
                  </Text>
                  <Text fw={700} size="lg" c="red">
                    Rp{" "}
                    {(
                      totals.dbTotal +
                      (headerData.header_penjualan_biaya_tambahan || 0)
                    ).toLocaleString("id-ID")}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500} c="blue">
                    Uang Muka ({headerData.header_penjualan_uang_muka || 0}%):
                  </Text>
                  <Text fw={500} c="blue">
                    Rp{" "}
                    {(
                      ((totals.dbTotal +
                        (headerData.header_penjualan_biaya_tambahan || 0)) *
                        (headerData.header_penjualan_uang_muka || 0)) /
                      100
                    ).toLocaleString("id-ID")}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={600} c="grape">
                    Sisa Pembayaran:
                  </Text>
                  <Text fw={600} c="grape">
                    Rp{" "}
                    {(
                      totals.dbTotal +
                      (headerData.header_penjualan_biaya_tambahan || 0) -
                      ((totals.dbTotal +
                        (headerData.header_penjualan_biaya_tambahan || 0)) *
                        (headerData.header_penjualan_uang_muka || 0)) /
                        100
                    ).toLocaleString("id-ID")}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}

          <Divider label="Form Transaksi" labelPosition="center" />

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <Paper shadow="sm" p="md" radius="md">
              <Stack gap="md">
                <Text fw={600} size="lg">
                  Item Keranjang (Belum Tersimpan)
                </Text>
                {cartItems.map((item) => (
                  <Box key={item.menu_id}>
                    <Group justify="space-between">
                      <Box flex={1}>
                        <Text fw={500}>{item.menu_nama}</Text>
                        <Text size="sm" c="gold">
                          Rp {item.menu_harga.toLocaleString("id-ID")}
                        </Text>
                      </Box>
                      <Group gap="xs">
                        <Button
                          size="xs"
                          color="red"
                          onClick={() =>
                            modifyQuantity(
                              item.menu_id,
                              item.penjualan_jumlah - 1
                            )
                          }
                        >
                          -
                        </Button>
                        <Text
                          fw={600}
                          style={{ minWidth: "30px", textAlign: "center" }}
                        >
                          {item.penjualan_jumlah}
                        </Text>
                        <Button
                          size="xs"
                          color="green"
                          onClick={() =>
                            modifyQuantity(
                              item.menu_id,
                              item.penjualan_jumlah + 1
                            )
                          }
                        >
                          +
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => dispatch(removeCartItem(item.menu_id))}
                        >
                          Hapus
                        </Button>
                      </Group>
                    </Group>
                    <Text size="sm" c="gold">
                      Subtotal: Rp{" "}
                      {(item.menu_harga * item.penjualan_jumlah).toLocaleString(
                        "id-ID"
                      )}
                    </Text>
                  </Box>
                ))}

                <Radio.Group
                  value={formData.jenisPenjualan}
                  onChange={(val) => updateFormField("jenisPenjualan", val)}
                  label="Jenis Penjualan"
                  required
                >
                  <Group mt="xs">
                    <Radio value="offline" label="Offline" />
                    <Radio value="online" label="Online" />
                  </Group>
                </Radio.Group>

                <TextInput
                  label="Keterangan"
                  value={formData.keterangan}
                  onChange={(e) =>
                    updateFormField("keterangan", e.target.value)
                  }
                />

                <NumberInput
                  label="Biaya Tambahan"
                  min={0}
                  value={formData.biayaTambahan}
                  onChange={(val) => updateFormField("biayaTambahan", val || 0)}
                />

                {formData.jenisPenjualan === "online" && (
                  <NumberInput
                    label="Uang Muka (%)"
                    min={0}
                    max={100}
                    value={formData.uangMuka}
                    onChange={(val) => updateFormField("uangMuka", val || 0)}
                  />
                )}

                <Divider />

                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text fw={500}>Subtotal Menu</Text>
                    <Text fw={500}>
                      Rp {totals.subtotal.toLocaleString("id-ID")}
                    </Text>
                  </Group>

                  {totals.biayaTambahan > 0 && (
                    <Group justify="space-between">
                      <Text fw={500} c="orange">
                        + Biaya Tambahan
                      </Text>
                      <Text fw={500} c="orange">
                        Rp {totals.biayaTambahan.toLocaleString("id-ID")}
                      </Text>
                    </Group>
                  )}

                  <Divider my="xs" />

                  <Group justify="space-between">
                    <Text fw={700} size="lg">
                      Total Keseluruhan
                    </Text>
                    <Text fw={700} size="xl" c="red">
                      Rp {totals.grand.toLocaleString("id-ID")}
                    </Text>
                  </Group>

                  {formData.jenisPenjualan === "online" &&
                    formData.uangMuka > 0 && (
                      <>
                        <Divider my="xs" />
                        <Group justify="space-between">
                          <Text fw={500} c="blue">
                            Uang Muka ({formData.uangMuka}%)
                          </Text>
                          <Text fw={600} size="lg" c="blue">
                            Rp {totals.uangMukaAmt.toLocaleString("id-ID")}
                          </Text>
                        </Group>
                        <Group justify="space-between">
                          <Text fw={600} c="grape">
                            Sisa Pembayaran
                          </Text>
                          <Text fw={600} size="lg" c="grape">
                            Rp {totals.sisaPembayaran.toLocaleString("id-ID")}
                          </Text>
                        </Group>
                      </>
                    )}
                </Stack>

                <Button
                  fullWidth
                  color="green"
                  size="lg"
                  onClick={() => setConfirmOpen(true)}
                  loading={loading}
                >
                  Selesaikan Transaksi
                </Button>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Container>

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Konfirmasi Transaksi"
        centered
        size="lg"
        styles={{
          content: {
            backgroundColor: "aqua",
          },
          header: {
            backgroundColor: "aqua",
          },
          title: {
            color: "white",
            fontWeight: 700,
            fontSize: "1.2rem",
          },
          body: {
            color: "white",
          },
        }}
      >
        <Stack gap="md">
          <Text fw={600} size="lg" c="white">
            Ringkasan Transaksi
          </Text>

          <Divider color="white" />

          <Group justify="space-between">
            <Text c="white">Subtotal Menu:</Text>
            <Text fw={600} c="white">
              Rp {totals.subtotal.toLocaleString("id-ID")}
            </Text>
          </Group>

          {totals.biayaTambahan > 0 && (
            <Group justify="space-between">
              <Text c="white">Biaya Tambahan:</Text>
              <Text fw={600} c="white">
                Rp {totals.biayaTambahan.toLocaleString("id-ID")}
              </Text>
            </Group>
          )}

          <Divider color="white" />

          <Group justify="space-between">
            <Text fw={700} size="lg" c="white">
              Total Keseluruhan:
            </Text>
            <Text fw={700} size="xl" c="yellow">
              Rp {totals.grand.toLocaleString("id-ID")}
            </Text>
          </Group>

          {formData.jenisPenjualan === "online" && formData.uangMuka > 0 && (
            <>
              <Divider color="white" />
              <Group justify="space-between">
                <Text c="white">Uang Muka ({formData.uangMuka}%):</Text>
                <Text fw={600} c="white">
                  Rp {totals.uangMukaAmt.toLocaleString("id-ID")}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text c="white">Sisa Pembayaran:</Text>
                <Text fw={600} c="white">
                  Rp {totals.sisaPembayaran.toLocaleString("id-ID")}
                </Text>
              </Group>
            </>
          )}

          <Divider color="white" />

          <Text c="white" fw={500} ta="center">
            Apakah Anda yakin ingin menyelesaikan transaksi ini?
          </Text>

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              color="gray"
              onClick={() => setConfirmOpen(false)}
              styles={{
                root: {
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                },
              }}
            >
              Tidak
            </Button>
            <Button
              color="green"
              onClick={() => {
                setConfirmOpen(false);
                finalizeTransaction();
              }}
              styles={{
                root: {
                  fontWeight: 700,
                },
              }}
            >
              Ya, Selesaikan
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default DetailPenjualanPage;
