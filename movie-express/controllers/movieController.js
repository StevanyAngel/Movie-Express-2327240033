import mongoose from "mongoose";
import movieModel from "../models/movieModel.js";

export const listMovie = async (req, res) => {
  try {
    // Hanya menampilkan movie milik user yang sedang login
    // const movie = (await movieModel.find({})).toSorted({createAt : -1});
    const movie = await MovieModel.find({
      createdBy: req.user?.user_id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Daftar semua movie",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjasi kesalahan pada server",
      error: error.message,
      data: null,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "ID Movie wajib diisi",
        data: null,
      });
    }

    // Mencari movie berdasarkan ID dan Kepemilikan user
    // const movie = await movieModel.findById(id);
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
    // const newMovie = await movieModel.create({judul, tahunRilis, sutradara});
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
      return res.status(400).json({
        message: "ID Movie wajib diisi di parameter URL",
        data: null,
      });
    }

    // Update hanya jika ID cocok dan user pembuat cocok
    //  const updateMovie = await movieModel.findByIdAndUpdate(
    //  id,
    //  {judul, tahunRilis, sutradara},
    //  { new: true },
    // );
    const updateMovie = await movieModel.findByIdAndUpdate(
      {
        _id: id,
        createBy: req.user?.user_id,
      },
      { judul, tahunRilis, sutradara },
      { new: true }
    );

    if (!updateMovie) {
      return res.status(404).json({
        message: "Data movie tidak ditemukan",
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

    if (!id || mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID Movie wajib diisi di parameter URL",
        data: null,
      });
    }

    // Hanya hapus jika ID cocok dan user pembuat cocok
    // const deleteMovie = await movieModel.findByIdAndDelete(id);
    const deleteMovie = await movieModel.findByIdAndDelete({
      _id: id,
      createdBy: req.user?.user_id,
    });

    if (!deleteMovie) {
      return res.status(404).json({
        message: "Movie tidak ditemukan",
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
