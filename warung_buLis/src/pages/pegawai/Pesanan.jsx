import '../css/pegawai/Pesanan.css'

import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";

const Pesanan = () => {
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.user.userToken);

  // === form handling ===
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    setShowPassPanel(false);
    reset();
    const result = {
      password: data.password,
      token: userToken,
    };
    cekPass(result);
  };

  const cekPass = async (result) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/pesanan_detail/detail/passcek`, result);
      if (res.data.status) {
        nowChangePesananStatus();
      } else {
        window.alert('Password Anda Salah !!!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // state utama
  const [allDetailMenu, setAllDetailMenu] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showPassPanel, setShowPassPanel] = useState(false);
  const [idRubah, setIdRubah] = useState(null);

  // === Use Effect ===
  useEffect(() => {
    cekSudahLogin();
  }, []);

  // === Fungsi untuk cek login ===
  const cekSudahLogin = () => {
    if (!userToken) {
      navigate("/pegawai");
    } else {
      getDataDetailPesanan();
    }
  };

  // === Ubah filter ===
  const changeFilter = (sort) => {
    setFilter(sort);
  };

  // === Ambil data dari backend ===
  const getDataDetailPesanan = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pesanan_detail/detail/showspesifik");
      // sort biar 'terkirim' paling bawah
      const sorted = res.data.sort((a, b) => {
        if (a.pesanan_status === "terkirim" && b.pesanan_status !== "terkirim") return 1;
        if (a.pesanan_status !== "terkirim" && b.pesanan_status === "terkirim") return -1;
        return 0;
      });
      setAllDetailMenu(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  // === Set warna tombol status ===
  const setColor = (status) => {
    if (status === 'pending') return { backgroundColor: 'red' };
    if (status === 'diproses') return { backgroundColor: 'orange' };
    if (status === 'terkirim') return { backgroundColor: 'green' };
    return { backgroundColor: 'gray' };
  };

  const cancelChangeStatus = () => {
    reset();
    setShowPassPanel(false);
  };

  const PasswordPanel = () => {
    if (!showPassPanel) return null;
    return (
      <div className='passPanel'>
        <div className='passPanelForm'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 style={{ color: 'black' }}>Masukan Password</h3>
            <input
              type="password"
              className='inputBarPASS'
              {...register('password')}
              required
            />
            <button type="button" className='buttonStyling cm' onClick={cancelChangeStatus}>Cancel</button>
            <button type='submit' className='buttonStyling cm'>Send</button>
          </form>
        </div>
      </div>
    );
  };

  const nowChangePesananStatus = async () => {
    try {
      await axios.post(`http://localhost:3000/api/pesanan_detail/detail/update/${idRubah}`);
      getDataDetailPesanan();
      setIdRubah(null);
    } catch (error) {
      console.error(error);
    }
  };

  // === Update status pesanan ===
  const updateStatusPesanan = (id,status) => {
    if(status == 'terkirim'){
      window.alert('Pesanan Telah Terkirim');
    }
    else{
      setShowPassPanel(true);
      setIdRubah(id);
    }
  };

  // === Filter data sebelum tampil ===
  const filteredData =
    filter === 'all'
      ? allDetailMenu
      : allDetailMenu.filter((d) => d.pesanan_status === filter);

  // === lihat pesanan ====
  const lihatDetailPesanan = (id) => {
    navigate(`/pegawai/pesanan/${id}`);
  }

  return (
    <div>
      {PasswordPanel()}
      <div className='barTitle'>
        <h2>Dalam Proses</h2>
        <select onChange={(e) => changeFilter(e.target.value)} className='barOption'>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="diproses">Diproses</option>
          <option value="terkirim">Terkirim</option>
        </select>
      </div>

      <Table>
        <thead>
          <tr className="tableSet1">
            <th>ID_Pesanan</th>
            <th>Atas_Nama</th>
            <th>Status</th>
            <th>Detail_Pesanan</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((d, i) => (
            <tr key={i} className='tableSet1'>
              <td>{d.pesanan_id}</td>
              <td>{d.pesanan_nama}</td>
              <td>
                <button
                  className='buttonStyling'
                  style={setColor(d.pesanan_status)}
                  onClick={() => updateStatusPesanan(d.pesanan_id,d.pesanan_status)}
                >
                  {d.pesanan_status}
                </button>
              </td>
              <td>
                <button className='buttonStyling sky' onClick={() => lihatDetailPesanan(d.pesanan_id)}>
                  Lihat Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Pesanan;
