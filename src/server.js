const hapi = require('@hapi/hapi');
const routes = require('./routes');

const server = hapi.server({
  host: 'localhost',
  port: 5000,
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});
server.route(routes);
server.start();
