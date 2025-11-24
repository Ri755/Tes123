/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 10.4.32-MariaDB : Database - warungbulis
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`warungbulis` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `warungbulis`;

/*Table structure for table `bahan_baku` */

DROP TABLE IF EXISTS `bahan_baku`;

CREATE TABLE `bahan_baku` (
  `bahan_baku_id` INT(11) NOT NULL AUTO_INCREMENT,
  `bahan_baku_nama` VARCHAR(100) NOT NULL,
  `bahan_baku_jumlah` FLOAT NOT NULL,
  `bahan_baku_harga` INT(11) NOT NULL,
  `bahan_baku_satuan` VARCHAR(100) NOT NULL,
  `bahan_baku_harga_satuan` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`bahan_baku_id`)
) ENGINE=INNODB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `bahan_baku` */

INSERT  INTO `bahan_baku`(`bahan_baku_id`,`bahan_baku_nama`,`bahan_baku_jumlah`,`bahan_baku_harga`,`bahan_baku_satuan`,`bahan_baku_harga_satuan`,`createdAt`,`updatedAt`,`deletedAt`) VALUES 
(1,'Ayam',20,400000,'ekor',20000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(2,'Telur',40,240000,'butir',6000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(3,'Ikan',20,300000,'ekor',15000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(4,'Bawang Merah',10,50000,'kg',5000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(5,'Bawang Putih',10,60000,'kg',6000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(6,'Cabai',5,75000,'kg',15000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(7,'Minyak Goreng',10,140000,'liter',14000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(8,'Garam',5,10000,'kg',2000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(9,'Gula Pasir',10,130000,'kg',13000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(10,'Daging Sapi',10,180000,'kg',18000,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL);

/*Table structure for table `detail_menu` */

DROP TABLE IF EXISTS `detail_menu`;

CREATE TABLE `detail_menu` (
  `detail_menu_id` INT(11) NOT NULL AUTO_INCREMENT,
  `detail_menu_nama_bahan` VARCHAR(255) NOT NULL,
  `detail_menu_jumlah` FLOAT NOT NULL,
  `detail_menu_satuan` VARCHAR(255) NOT NULL,
  `detail_menu_harga` INT(11) NOT NULL,
  `menu_id` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`detail_menu_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `detail_menu_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`)
) ENGINE=INNODB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `detail_menu` */

INSERT INTO `detail_menu` (`detail_menu_id`,`detail_menu_nama_bahan`,`detail_menu_jumlah`,`detail_menu_satuan`,`detail_menu_harga`,`menu_id`,`createdAt`,`updatedAt`,`deletedAt`) VALUES
(1,'Ayam',1,'ekor',20000,1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(2,'Telur',2,'butir',12000,2,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(3,'Ikan',1,'ekor',15000,3,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(4,'Nasi',1,'porsi',5000,4,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(5,'Mie',1,'porsi',4000,5,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(6,'Ayam',0.5,'ekor',10000,6,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(7,'Ayam',0.5,'ekor',10000,7,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(8,'Lele',1,'ekor',12000,8,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(9,'Daging sapi',0.2,'kg',15000,9,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(10,'Daging sapi',0.3,'kg',18000,10,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL);

/*Table structure for table `header_penjualan` */

DROP TABLE IF EXISTS `header_penjualan`;

CREATE TABLE `header_penjualan` (
  `header_penjualan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `header_penjualan_tanggal` DATETIME NOT NULL,
  `header_penjualan_jenis` ENUM('offline','online') NOT NULL,
  `header_penjualan_keterangan` VARCHAR(255) NOT NULL,
  `header_penjualan_biaya_tambahan` INT(11) NOT NULL,
  `header_penjualan_uang_muka` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`header_penjualan_id`)
) ENGINE=INNODB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `header_penjualan` */

INSERT  INTO `header_penjualan`(`header_penjualan_id`,`header_penjualan_tanggal`,`header_penjualan_jenis`,`header_penjualan_keterangan`,`header_penjualan_biaya_tambahan`,`header_penjualan_uang_muka`,`createdAt`,`updatedAt`,`deletedAt`) VALUES 
(1,'2025-10-01 10:00:00','offline','Penjualan menu offline',5000,0,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(2,'2025-10-01 12:00:00','online','Penjualan menu online',10000,50,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(3,'2025-10-02 09:30:00','offline','Penjualan menu offline',3000,0,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(4,'2025-10-02 14:00:00','online','Penjualan menu online',7000,20,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(5,'2025-10-03 08:00:00','offline','Penjualan menu offline',4000,0,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(6,'2025-10-03 13:00:00','online','Penjualan menu online',6000,10,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(7,'2025-10-04 11:00:00','offline','Penjualan menu offline',4000,0,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(8,'2025-10-04 15:00:00','online','Penjualan menu online',5000,15,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(9,'2025-10-05 10:30:00','offline','Penjualan menu offline',6000,0,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(10,'2025-10-05 16:00:00','online','Penjualan menu online',7000,25,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL);

/*Table structure for table `menu` */

DROP TABLE IF EXISTS `menu`;

CREATE TABLE `menu` (
  `menu_id` INT(11) NOT NULL AUTO_INCREMENT,
  `menu_nama` VARCHAR(255) NOT NULL,
  `menu_harga` INT(11) NOT NULL,
  `menu_gambar` TEXT NOT NULL,
  `menu_status_aktif` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=INNODB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `menu` */

INSERT INTO `menu` (`menu_id`,`menu_nama`,`menu_harga`,`menu_gambar`,`menu_status_aktif`,`createdAt`,`updatedAt`,`deletedAt`) VALUES
(1,'Ayam Goreng',25000,'https://delishglobe.com/wp-content/uploads/2025/07/Ayam-Goreng-Fried-Chicken.png',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(2,'Telur Balado',20000,'https://cnc-magazine.oramiland.com/parenting/original_images/Resep_Telur_Balado_Pedas_Manis.jpg',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(3,'Ikan Bakar',30000,'https://awsimages.detik.net.id/community/media/visual/2022/04/20/resep-gurame-bakar-bumbu-kecap-cabe_43.jpeg?w=650',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(4,'Nasi Goreng',22000,'https://sanex.co.id/wp-content/uploads/2025/03/2734-1.webp',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(5,'Mie Goreng',21000,'https://allofresh.id/blog/wp-content/uploads/2023/09/cara-membuat-mie-goreng-4-1-scaled.jpg',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(6,'Sate Ayam',27000,'https://www.dapurkobe.co.id/wp-content/uploads/sate-ayam.jpg',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(7,'Soto Ayam',23000,'https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2023/08/03063114/Ini-Resep-Bumbu-Soto-Ayam-Tanpa-Santan-yang-Gurih-dan-Lezat-.jpg',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(8,'Pecel Lele',24000,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbpIoXzpb43E0WJOwOfvtJPtyMgJaX3ai5QA&s',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(9,'Bakso',20000,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSikceAHEyId9rMz8X8CI1Md2U1gsdxKZBm_Q&s',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(10,'Rawon',28000,'https://awsimages.detik.net.id/community/media/visual/2023/03/14/resep-rawon-daging-surabaya_169.jpeg?w=600&q=90',1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL);

/*Table structure for table `pegawai` */

DROP TABLE IF EXISTS `pegawai`;

CREATE TABLE `pegawai` (
  `pegawai_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pegawai_nama` VARCHAR(100) NOT NULL,
  `pegawai_email` VARCHAR(100) NOT NULL,
  `pegawai_password` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pegawai_id`)
) ENGINE=INNODB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pegawai` */

INSERT  INTO `pegawai`(`pegawai_id`,`pegawai_nama`,`pegawai_email`,`pegawai_password`,`createdAt`,`updatedAt`,`deletedAt`) VALUES 
(1,'Budi','b@b.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(2,'Siti','siti@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(3,'Andi','andi@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(4,'Rina','rina@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(5,'Dewi','dewi@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(6,'Agus','agus@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(7,'Tina','tina@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(8,'Eko','eko@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(9,'Lina','lina@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL),
(10,'Rudi','rudi@warungbulis.com','$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS','2025-10-19 15:43:05','2025-10-19 17:15:54',NULL);

/*Table structure for table `pembelian` */

DROP TABLE IF EXISTS `pembelian`;

-- Tabel pembelian
CREATE TABLE `pembelian` (
  `pembelian_id` INT(11) NOT NULL AUTO_INCREMENT,
  `bahan_baku_id` INT(11) NOT NULL,
  `pembelian_jumlah` FLOAT NOT NULL,
  `pembelian_satuan` VARCHAR(255) NOT NULL,
  `pembelian_harga_satuan` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pembelian_id`),
  KEY `bahan_baku_id` (`bahan_baku_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* Data for the table `pembelian` */

-- Data dummy untuk tabel pembelian
INSERT INTO `pembelian` (`bahan_baku_id`, `pembelian_jumlah`, `pembelian_satuan`, `pembelian_harga_satuan`) VALUES
(1, 10, 'ekor', 20000),
(2, 20, 'butir', 6000),
(3, 10, 'ekor', 15000),
(4, 5, 'kg', 5000),
(5, 5, 'kg', 6000),
(6, 2, 'kg', 15000),
(7, 5, 'liter', 14000),
(8, 2, 'kg', 2000),
(9, 5, 'kg', 13000),
(10, 2, 'botol', 10000);

/*Table structure for table `penjualan` */

DROP TABLE IF EXISTS `penjualan`;

CREATE TABLE `penjualan` (
  `penjualan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `header_penjualan_id` INT(11) NOT NULL,
  `menu_id` INT(11) NOT NULL,
  `penjualan_jumlah` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`penjualan_id`),
  KEY `menu_id` (`menu_id`),
  KEY `header_penjualan_id` (`header_penjualan_id`),
  CONSTRAINT `penjualan_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`),
  CONSTRAINT `penjualan_ibfk_2` FOREIGN KEY (`header_penjualan_id`) REFERENCES `header_penjualan` (`header_penjualan_id`)
) ENGINE=INNODB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `penjualan` */

INSERT  INTO `penjualan`(`penjualan_id`,`header_penjualan_id`,`menu_id`,`penjualan_jumlah`,`createdAt`,`updatedAt`,`deletedAt`) VALUES 
(1,1,1,2,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(2,1,2,3,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(3,2,3,1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(4,2,4,2,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(5,3,5,1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(6,4,6,2,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(7,5,7,1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(8,6,8,2,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(9,7,9,3,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(10,8,10,1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL);

/*Table structure for table `pesanan` */

DROP TABLE IF EXISTS `pesanan`;

CREATE TABLE `pesanan` (
  `pesanan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pesanan_nama` VARCHAR(255) NOT NULL,
  `pesanan_lokasi` VARCHAR(255) NOT NULL,
  `pesanan_email` VARCHAR(255) NOT NULL,
  `pesanan_status` ENUM('pending','diproses','terkirim') NOT NULL DEFAULT 'pending',
  `pesanan_tanggal` DATETIME DEFAULT NULL,
  `pesanan_tanggal_pengiriman` DATETIME DEFAULT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pesanan_id`),
  KEY `idx_email` (`pesanan_email`),
  KEY `idx_status` (`pesanan_status`)
) ENGINE=INNODB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pesanan` */

INSERT INTO `pesanan`(`pesanan_id`,`pesanan_nama`,`pesanan_lokasi`,`pesanan_email`,`pesanan_status`,`pesanan_tanggal`,`pesanan_tanggal_pengiriman`,`createdAt`,`updatedAt`,`deletedAt`) VALUES 
(1,'Ali','Jln. Mawar No. 12, Surabaya','ali@email.com','pending','2025-10-01 09:00:00','2025-10-01 12:00:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(2,'Dina','Jln. Melati No. 5, Gresik','dina@email.com','diproses','2025-10-01 10:00:00','2025-10-01 13:00:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(3,'Rama','Jln. Kenanga No. 8, Sidoarjo','rama@email.com','terkirim','2025-10-02 11:00:00','2025-10-02 14:00:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(4,'Tari','Jln. Dahlia No. 3, Malang','tari@email.com','terkirim','2025-10-02 12:00:00','2025-10-02 15:00:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(5,'Bayu','Jln. Anggrek No. 9, Lamongan','bayu@email.com','pending','2025-10-03 08:00:00','2025-10-03 11:00:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(6,'Nina','Jln. Teratai No. 7, Kediri','nina@email.com','diproses','2025-10-03 09:00:00','2025-10-03 12:00:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(7,'Fajar','Jln. Flamboyan No. 4, Blitar','fajar@email.com','terkirim','2025-10-04 10:00:00','2025-10-04 13:00:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(8,'Lia','Jln. Cempaka No. 6, Tulungagung','lia@email.com','terkirim','2025-10-04 11:00:00','2025-10-04 14:00:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(9,'Riski','Jln. Bougenville No. 10, Madiun','riski@email.com','pending','2025-10-05 09:30:00','2025-10-05 12:30:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(10,'Salsa','Jln. Kamboja No. 2, Jombang','salsa@email.com','diproses','2025-10-05 10:30:00','2025-10-05 13:30:00','2025-10-19 15:43:05','2025-10-19 15:43:05',NULL);

/*Table structure for table `pesanan_detail` */

DROP TABLE IF EXISTS `pesanan_detail`;

CREATE TABLE `pesanan_detail` (
  `pesanan_detail_id` INT(11) NOT NULL AUTO_INCREMENT,
  `menu_id` INT(11) DEFAULT NULL,
  `pesanan_detail_jumlah` INT(11) NOT NULL,
  `pesanan_id` INT(11) DEFAULT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pesanan_detail_id`),
  KEY `menu_id` (`menu_id`),
  KEY `pesanan_id` (`pesanan_id`),
  CONSTRAINT `pesanan_detail_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`),
  CONSTRAINT `pesanan_detail_ibfk_2` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`pesanan_id`)
) ENGINE=INNODB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pesanan_detail` */

INSERT  INTO `pesanan_detail`(`pesanan_detail_id`,`menu_id`,`pesanan_detail_jumlah`,`pesanan_id`,`createdAt`,`updatedAt`,`deletedAt`) VALUES 
(1,1,2,1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(2,2,1,1,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(3,3,1,2,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(4,4,2,2,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(5,5,1,3,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(6,6,2,3,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(7,7,1,4,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(8,8,2,4,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(9,9,3,5,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(10,10,1,5,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(11,1,1,6,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(12,3,1,6,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(13,2,2,7,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(14,4,1,7,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(15,5,2,8,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(16,6,1,8,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(17,7,2,9,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(18,9,1,9,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(19,10,2,10,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL),
(20,8,1,10,'2025-10-19 15:43:05','2025-10-19 15:43:05',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
