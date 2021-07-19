const { nanoid } = require('nanoid');
const storage = require('./storage');

function tambahBuku(request, h) {
  const id = nanoid(16);
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
    return response;
  }
  const storeBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  storage.push(storeBooks);

  const statusInput = storage.filter((input) => input.id === id).length > 0;
  if (statusInput) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
  return response;
}

function lihatBuku(request, h) {
  const {
    name, reading, finished,
  } = request.query;

  let book = storage;
  if (name !== undefined) {
    book = book.filter((s) => s.name.toLowerCase().includes(name.toLowerCase()));
  } else if (reading !== undefined) {
    book = book.filter((s) => s.reading === !!Number(reading));
  } else if (finished !== undefined) {
    book = book.filter((s) => s.finished === !!Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: book.map((s) => ({
        id: s.id,
        name: s.name,
        publisher: s.publisher,
      })),
    },
  }).code(200);
  return response;
}

function lihatSpesifik(request, h) {
  const { bookId } = request.params;

  const book = storage.filter((s) => s.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
  return response;
}

function editBuku(request, h) {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const bukuRevisi = storage.findIndex((s) => s.id === bookId);

  if (bukuRevisi !== undefined) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      }).code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
      return response;
    }
  }
  if (bukuRevisi !== -1) {
    storage[bukuRevisi] = {
      ...storage[bukuRevisi],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
  return response;
}

function hapusBuku(request, h) {
  const { bookId } = request.params;
  const cariBuku = storage.findIndex((s) => s.id === bookId);

  if (cariBuku !== -1) {
    storage.splice(cariBuku, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
  return response;
}

module.exports = {
  tambahBuku, lihatBuku, lihatSpesifik, editBuku, hapusBuku,
};
