import mongoose from "mongoose";
import movieModel from "../models/movieModel.js";

export const listMovie = async (req, res) => {
  try {
    // Hanya menampilkan movie milik user yang sedang login
    const movie = await movieModel
      .find({
        createdBy: req.user?.user_id,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Daftar semua movie",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
      data: null,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      // Tambahan validasi ID Mongoose
      return res.status(400).json({
        message: "ID Movie wajib diisi dan harus valid",
        data: null,
      });
    }

    // Mencari movie berdasarkan ID dan Kepemilikan user
    const movie = await movieModel.findOne({
      _id: id,
      createdBy: req.user?.user_id,
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie tidak ditemukan",
        data: null,
      });
    }
    res.status(200).json({
      message: "Berhasil mendapatkan data Movie",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
      data: null,
    });
  }
};

export const addListMovie = async (req, res) => {
  try {
    const { judul, tahunRilis, sutradara } = req.body;

    if (!judul || !tahunRilis || !sutradara) {
      return res.status(400).json({
        message: "Semua field (judul, tahunRilis, sutradara) wajib diisi",
        data: null,
      });
    }

    // Menyimpan user_id pembuat ke database
    const newMovie = await movieModel.create({ judul, tahunRilis, sutradara, createdBy: req.user?.user_id });

    res.status(201).json({
      message: "Movie berhasil ditambahkan",
      data: newMovie,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
    });
  }
};

export const updateDataMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, tahunRilis, sutradara } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      // FIX: Validasi ID
      return res.status(400).json({
        message: "ID Movie wajib diisi di parameter URL dan harus valid",
        data: null,
      });
    }

    // FIX: Menggunakan findOneAndUpdate
    const updateMovie = await movieModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user?.user_id, // FIX: Perbaiki typo createBy menjadi createdBy
      },
      { judul, tahunRilis, sutradara },
      { new: true }
    );

    if (!updateMovie) {
      return res.status(404).json({
        message: "Data movie tidak ditemukan atau Anda tidak memiliki izin untuk mengupdate",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Data movie berhasil diupdate",
      data: updateMovie,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      // FIX: Validasi ID
      return res.status(400).json({
        message: "ID Movie wajib diisi di parameter URL dan harus valid",
        data: null,
      });
    }

    // FIX: Menggunakan findOneAndDelete
    const deleteMovie = await movieModel.findOneAndDelete({
      _id: id,
      createdBy: req.user?.user_id,
    });

    if (!deleteMovie) {
      return res.status(404).json({
        message: "Movie tidak ditemukan atau Anda tidak memiliki izin untuk menghapus",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Movie berhasil dihapus",
      data: deleteMovie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
      data: null,
    });
  }
};
