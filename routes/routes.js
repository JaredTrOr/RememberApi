const routes = require("express").Router();
const usuarioRouterVista = require('./vista/vista');
const usuarioRouterApi = require('./api/usuarios'); 
const notasRouterApi = require('./api/notas'); 
const usuarioApi = require('./api/usuariosAPI');

routes.use('/', usuarioRouterVista);
routes.use('/usuario',usuarioRouterApi);
routes.use('/notas',notasRouterApi);
routes.use('/usuarioAPI',usuarioApi);

module.exports = routes;