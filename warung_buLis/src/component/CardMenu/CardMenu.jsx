import { useState } from "react";
import "./CardMenu.css";
import { pushMenu, popMenu } from "../../slice + storage/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

// tambahan dari jumlah !!!
const CardMenu = ({ img, harga, nama, id, jumlah }) => {
  // === VARIABEL ====
  let dispatch = useDispatch();
  let navigate = useNavigate();

  // === USE STATE ===
  const [isChosen, setisChosen] = useState(false);

  // === FUNCTION ===
  const menuTerpilih = () => {
    // ubah state terpilih
    setisChosen(!isChosen);

    // simpan atau pop menu di slice
    if (!isChosen) {
      // kalau belum maka push
      // siapin dulu data sesuai format wa
      let data = {
        menu_id: id,
        name: nama,
        price: harga,

        pesanan_detail_jumlah: 1,
        pesanan_id: 1,

        image: img,
      };
      dispatch(pushMenu(data));
    } else {
      // kalau udah terpilih maka pop
      dispatch(popMenu({ menu_id: id }));
    }
  };

  const goToBahan = (id) => {
    // direct ke halaman detail bahan
    navigate(`/pegawai/menu/detail/${id}`)
  }

  return (
    <div className={`cardMenu ${isChosen ? "iYel" : "iWhi"}`}>
      <img src={img} alt="Gambar Tidak Valid" className="imgMenu" />
      <div className="infoMenu">
        <span className="infoHargaMenu">Rp {harga}</span> <br/>
        {jumlah ? (<div className="infoHargaMenu2">Jumlah : <span className="editInerJumlah">{jumlah}</span> <br/> </div>) : ('')}
        <br />
        <span className="infoNamaMenu">{nama}</span> <br />

        {/* Tombol Akhir Untuk To Cart */}
        
        {jumlah ? ( 
          <div
            style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
            <button className="addToCartMenu" onClick={() => goToBahan(id)}>
              Lihat Resep
            </button>
          </div>
        ):(
          <div
            style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
            <button className="addToCartMenu" onClick={() => menuTerpilih()}>
              {isChosen ? "Remove From Cart" : "Add To Cart"}
            </button>
          </div>
        )}

        {/* Tombol Nav Ke Bahan Menu */}

      </div>
    </div>
  );
};

export default CardMenu;
