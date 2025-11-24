import { AppShell } from "@mantine/core";
import { useEffect, useState } from "react";
import "./css/LoginPage.css";
import logoGambar from "../asset/logo.png";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { setLogin, setLogout } from '../slice + storage/userSlice'
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  // === FORM HANDELING ===
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(); // lek butuh resolver tambahi ndk sini ntik !!!
  
  const onSubmit = (data) => {
    console.log(data);
    // lakukan axios buat login
    doLogin(data.id,data.password);
  };

  // === use effect ===
  useEffect(() => {
    resetToken()
  },[])

  // === USE STATE ====
  const [errMsg, seterrMsg] = useState(null);

  // === FUNCTION ===
  let dispatch = useDispatch();
  let navigate = useNavigate();
  
  let userToken = useSelector((state) => state.user.userToken)

  const simpanTokenSlice = (token) => {
    dispatch(setLogin(token) );
  }

  const resetToken = () => {
    dispatch(setLogout());
    // console.log('Token Set To Null');
  }
  
  const doLogin = async (pegawai_id, password) => {
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        pegawai_id,
        password,
      });

      if (res.data.message === "Berhasil Login") {
        console.log("berhasil login");
        // simpan token
        simpanTokenSlice(res.data.token);

        // redirect halaman
        navigate('/pegawai/penjualan')
      
      } else {
        setErrMsg(res.data.message);
      }
    } catch (error) {
      // Tangani error network / 404 / 500
      if (error.response) {
        seterrMsg(error.response.data?.message || "Terjadi kesalahan di server");
      } else {
        seterrMsg("Tidak dapat terhubung ke server");
      }
    }
  };

  const showErrMsg = () => {
    if(errMsg){
      return(
        <span style={{color:'red'}}>
          {errMsg}
        </span>
      )
    }
  }

  return (
    <AppShell header={{ height: 0 }} padding="0">
      <AppShell.Header></AppShell.Header>
      <AppShell.Main>
        <div className="loginPage">
          <div className="panel1">

            {/* buat login */}
            <img src={logoGambar} alt="" className="logo" />
            <p className="judulLogin">Login Karyawan</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="sl1">
                <div className="custoIDPass">ID : </div>{" "}
                <input
                  type="text"
                  placeholder="Masukan ID Anda"
                  className="setBarInput"
                  {...register("id")}
                  required
                />{" "}
                <br />
              </div>
              <div className="sl1">
                <div className="custoIDPass">Password : </div>{" "}
                <input
                  type="password"
                  placeholder="Masukan Password Anda"
                  className="setBarInput"
                  {...register("password")}
                  required
                />{" "}
                <br />
              </div>
              <br />
              <button className="buttonLogin">Login</button>
            </form>
            {showErrMsg()}

            {/* footer */}
            <div>
              <div className="footer">
                <div className="sl2 stz">
                  Jl. Penataran No.1 Pacar Keling, Kec. Tambaksari, Surabaya,
                  Jawa Timur 60131
                </div>
              </div>
              <div className="sl3 stz">
                📨 : bulis123@gmail.com 📞 : +62 000-0000-0000
              </div>
            </div>
          </div>
          <div className="panel2">
            {/* cuma gambar */}
            <h1 className="outerline">
              Bandeng tanpa <br />
              duri spesial, harga <br />
              ramah di kantong
            </h1>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default LoginPage;