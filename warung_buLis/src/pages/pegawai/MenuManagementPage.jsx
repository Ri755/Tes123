import React, { useEffect, useState } from "react";
import "../css/pegawai/MenuManagementPageCss.css";
import { NumberInput, TextInput, Table, Button } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export const MenuManagementPage = () => {
  // === React Hook Form ===
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      nama: "",
      harga: 0,
      img: "",
    },
  });

  const navigate = useNavigate();
  const userToken = useSelector((state) => state.user.userToken);
  const [menu, setMenu] = useState([]);

  // === Lifecycle ===
  useEffect(() => {
    cekSudahLogin();
  }, []);

  // === Cek login dan ambil data menu ===
  const cekSudahLogin = () => {
    if (!userToken) {
      navigate("/pegawai");
    } else {
      getMenu();
    }
  };

  // === GET Menu ===
  const getMenu = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/menu_management/getall", {
        headers: { "x-auth-token": userToken },
      });
      setMenu(res.data);
      //console.log("Data menu:", res.data);
    } catch (err) {
      console.error("Gagal get menu:", err.response?.data || err.message);
    }
  };

  // === ADD Menu ===
  const addMenu = async (nama, harga, img) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/menu_management",
        {
          menu_nama: nama,
          menu_harga: harga,
          menu_gambar: img,
        },
        {
          headers: { "x-auth-token": userToken },
        }
      );
      console.log("Berhasil Add Menu:", res.data);
      getMenu();
    } catch (err) {
      console.error("Gagal Add Menu:", err.response?.data || err.message);
    }
  };

  // === Change Status Menu ===
  const changeStatus = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/menu_management/status/${id}`,
        {},
        {
          headers: { "x-auth-token": userToken },
        }
      );
      console.log("Berhasil Ubah status menu dengan ID:", id);
      getMenu();
    } catch (err) {
      console.error("Gagal ubah status:", err.response?.data || err.message);
    }
  };

  // === Handle form submit ===
  const onSubmit = (data) => {
    addMenu(data.nama, data.harga, data.img);
    reset();
  };

  // === RENDER ===
  return (
    <div className="utamaMMP">
      {/* === FORM INPUT === */}
      <div className="inputField">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "40px", fontWeight: "bold" }}>Add New Menu</h3>
            <br />
          </div>

          {/* === Nama === */}
          <div className="inputField">
            <div style={{ minWidth: "50px", textAlign: "right", marginRight: "10px" }}>
              Name:
            </div>
            <Controller
              name="nama"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Masukan Nama"
                  style={{ width: "250px" }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          {/* === Harga === */}
          <div className="inputField">
            <div style={{ minWidth: "50px", textAlign: "right", marginRight: "10px" }}>
              Harga:
            </div>
            <Controller
              name="harga"
              control={control}
              render={({ field }) => (
                <NumberInput
                  min={0}
                  placeholder="Masukan Harga"
                  style={{ width: "250px" }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          {/* === Img === */}
          <div className="inputField">
            <div style={{ minWidth: "50px", textAlign: "right", marginRight: "10px" }}>
              Img:
            </div>
            <Controller
              name="img"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Masukan URL Gambar"
                  style={{ width: "250px" }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <button type="submit" className="btnSubmitMMP">
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* === TABEL MENU === */}
      <div className="utamaTabelMMP">
        <div className="tabelMMP">
          <div
            style={{
              textAlign: "center",
              borderBottom: "3px solid white",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <h2>Menu</h2>
          </div>
          <Table>
            <thead>
              <tr className="tableSet">
                <th className="tableSet">ID</th>
                <th className="tableSet">Nama</th>
                <th className="tableSet">Harga</th>
                <th className="tableSet">Gambar</th>
                <th className="tableSet">Detail</th>
                <th className="tableSet">Status</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((d) => (
                <tr key={d.menu_id} className="tableSet">
                  <td className="tableSet">{d.menu_id}</td>
                  <td className="tableSet">{d.menu_nama}</td>
                  <td className="tableSet">{d.menu_harga}</td>
                  <td className="tableSet">
                    <img src={d.menu_gambar} alt="Tidak Tersedia" width="80" />
                  </td>
                  <td className="tableSet">
                    <Button
                      color="blue"
                      onClick={() => navigate(`/pegawai/menu/detail/${d.menu_id}`)}
                    >
                      DETAIL MENU
                    </Button>
                  </td>

                  {d.menu_status_aktif !== 1 ? (
                    <td
                      className="tableSet iR isHV"
                      onClick={() => changeStatus(d.menu_id)}
                    >
                      DEACTIVE
                    </td>
                  ) : (
                    <td
                      className="tableSet iG isHV"
                      onClick={() => changeStatus(d.menu_id)}
                    >
                      ACTIVE
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
