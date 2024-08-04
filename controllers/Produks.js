const { v4: uuidv4 } = require("uuid");
const Produk = require("../models/ProdukModel.js");
const Kategori = require("../models/KategoriModel.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/produks/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Base URL untuk akses file
const baseURL = "/uploads/produks/";

// Membuat produk baru
exports.createProduk = [
  upload.single("gambar"),
  async (req, res) => {
    const {
      nama,
      warna,
      bahan,
      dimensi,
      deskripsiProduk,
      finishing,
      kategoriId,
      linkShopee,
      linkWhatsApp,
      linkTokopedia,
    } = req.body;
    const gambar = req.file ? req.file.filename : null;

    try {
      const kategori = await Kategori.findByPk(kategoriId);
      if (!kategori)
        return res.status(404).json({ message: "Kategori tidak ditemukan" });

      const newProduk = await Produk.create({
        id: uuidv4(),
        nama,
        warna,
        bahan,
        dimensi,
        deskripsiProduk,
        finishing,
        gambar,
        linkShopee,
        linkWhatsApp,
        linkTokopedia,
        kategoriId,
      });

      const response = {
        ...newProduk.toJSON(),
        gambar: newProduk.gambar ? baseURL + newProduk.gambar : null,
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// Mendapatkan semua produk
exports.getAllProduk = async (req, res) => {
  try {
    const produks = await Produk.findAll({ include: Kategori });

    const response = produks.map((produk) => ({
      ...produk.toJSON(),
      gambar: produk.gambar ? baseURL + produk.gambar : null,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan produk berdasarkan ID
exports.getProdukById = async (req, res) => {
  const { id } = req.params;

  try {
    const produk = await Produk.findByPk(id, { include: Kategori });
    if (!produk)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    const response = {
      ...produk.toJSON(),
      gambar: produk.gambar ? baseURL + produk.gambar : null,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update produk berdasarkan ID
exports.updateProduk = [
  upload.single("gambar"),
  async (req, res) => {
    const { id } = req.params;
    const {
      nama,
      warna,
      bahan,
      dimensi,
      deskripsiProduk,
      finishing,
      kategoriId,
      linkShopee,
      linkWhatsApp,
      linkTokopedia,
    } = req.body;
    const gambar = req.file ? req.file.filename : null;

    try {
      const produk = await Produk.findByPk(id);
      if (!produk)
        return res.status(404).json({ message: "Produk tidak ditemukan" });

      const kategori = await Kategori.findByPk(kategoriId);
      if (!kategori)
        return res.status(404).json({ message: "Kategori tidak ditemukan" });

      if (req.file && produk.gambar) {
        fs.unlinkSync(path.join("uploads/produks/", produk.gambar));
      }

      const updatedData = {
        nama,
        warna,
        bahan,
        dimensi,
        deskripsiProduk,
        finishing,
        gambar: gambar || produk.gambar,
        linkShopee,
        linkWhatsApp,
        linkTokopedia,
        kategoriId,
      };

      await produk.update(updatedData);

      const response = {
        ...produk.toJSON(),
        gambar: produk.gambar ? baseURL + produk.gambar : null,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// Menghapus produk berdasarkan ID
exports.deleteProduk = async (req, res) => {
  const { id } = req.params;

  try {
    const produk = await Produk.findByPk(id);
    if (!produk)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    if (produk.gambar) {
      fs.unlinkSync(path.join("uploads/produks/", produk.gambar));
    }

    await produk.destroy();
    res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
