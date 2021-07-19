const {
  tambahBuku, lihatBuku, lihatSpesifik, editBuku, hapusBuku,
} = require('./handler');

const routes = [{
  method: 'POST',
  path: '/books',
  handler: tambahBuku,
},
{
  method: 'GET',
  path: '/books',
  handler: lihatBuku,
},
{
  method: 'GET',
  path: '/books/{bookId}',
  handler: lihatSpesifik,
},
{
  method: 'PUT',
  path: '/books/{bookId}',
  handler: editBuku,
},
{
  method: 'DELETE',
  path: '/books/{bookId}',
  handler: hapusBuku,
}];

module.exports = routes;
