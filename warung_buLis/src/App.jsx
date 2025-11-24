import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import MenuPage from "./pages/customer/MenuPage";
import CartPage from "./pages/customer/CartPage";
import PageLayoutPegawai from "./pages/PageLayoutPegawai";
import LoginPage from "./pages/LoginPage";
import { MainPenjualanPage } from "./pages/pegawai/MainPenjualanPage";
import { DetailPenjualanPage } from "./pages/pegawai/DetailPenjualanPage";
import { DetailMenuManagementPage } from "./pages/pegawai/DetailMenuManagementPage";
import { MenuManagementPage } from "./pages/pegawai/MenuManagementPage";
import { StokManagementPage } from "./pages/pegawai/StokManagementPage";
import { LaporanKeuanganPage } from "./pages/pegawai/LaporanKeuanganPage";
import ErrorPage from "./pages/ErrorPage";
import brownTheme from "./theme/theme";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import HistoryPage from "./pages/customer/HistoryPage";
import Pesanan from "./pages/pegawai/Pesanan";
import DetailPesanan from "./pages/pegawai/DetailPesanan";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route index element={<MenuPage />} />
      <Route path="customer" element={<MenuPage />} />
      <Route path="customer/cart" element={<CartPage />} />
      <Route path="customer/history" element={<HistoryPage />} />
      <Route path="pegawai" element={<LoginPage />} />
      <Route element={<PageLayoutPegawai />}>
        <Route path="pegawai/penjualan">
          <Route
            index
            element={<MainPenjualanPage />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="detail/:id"
            element={<DetailPenjualanPage />}
            errorElement={<ErrorPage />}
          />
        </Route>
        <Route path="pegawai/menu">
          <Route
            index
            element={<MenuManagementPage />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="detail/:id"
            element={<DetailMenuManagementPage />}
            errorElement={<ErrorPage />}
          />
        </Route>
        <Route
          path="pegawai/stok"
          element={<StokManagementPage />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="pegawai/pesanan"
          element={<Pesanan />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="pegawai/laporan"
          element={<LaporanKeuanganPage />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="pegawai/pesanan/:id"
          element={<DetailPesanan />}
          errorElement={<ErrorPage />}
        />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <MantineProvider theme={brownTheme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
