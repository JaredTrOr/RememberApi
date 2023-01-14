const router = require('express').Router();
const objetos = require('../objetos/objetos');

router.get('/', (req,res) => {
    res.render('index', objetos.index);
});

router.get('/acerca-de', (req,res) => {
    res.render('acerca-de', objetos.acercaDe);
});

router.get('/iniciar-sesion', (req,res) => {
    res.render('iniciar-sesion', {mensaje:null});
});

router.get('/registro', (req,res) => {
    res.render('registro', {mensaje: null});
});


module.exports = router;