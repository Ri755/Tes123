import '../css/pegawai/DetailPenjualan.css' // salah nama ati ati !!!
import CardMenu from '../../component/CardMenu/CardMenu'
import { useEffect, useState } from 'react'

import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const DetailPesanan = () => {

  const navigate = useNavigate();
  const userToken = useSelector((state) => state.user.userToken);
  let { id }= useParams();

  const [allMenu, setallMenu] = useState([]);

  // === Lifecycle ===
  useEffect(() => {
    cekSudahLogin();
  }, []);
  // === Cek login dan ambil data menu ===
  const cekSudahLogin = () => {
    if (!userToken) {
      navigate("/pegawai");
    } else {
      getAllDetailMenu(id)
    }
  };

  const getAllDetailMenu = async(id) => {
    await axios.get(`http://localhost:3000/api/pesanan_detail/detail/showdetail/${id}`).then((res) => {
      setallMenu(res.data);
    });
  }

  return (
    <div className='detailMenuByIDPesanan'>
      {allMenu.map((d,i) => {
        return(
          <CardMenu
            key={d.menu.menu_id}
            img={d.menu.menu_gambar}
            harga={d.menu.menu_harga}
            nama={d.menu.menu_nama}
            id={d.menu.menu_id}
            jumlah={d.pesanan_detail_jumlah} // ganti ini ntik
          />
        )
      })}
    </div>
  )
}

export default DetailPesanan