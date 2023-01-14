const router = require('express').Router();
const {Usuario,Nota,Op}  = require('../../conexion');

//REGISTRAR USUARIO
router.post('/registro', async (req,res) => {
    let usuario = await Usuario.findOne({where: {usuario: req.body.usuario}});
    let email = await Usuario.findOne({where: {email: req.body.email}});

    //VALIDACIÓN DE REGISTRO
    if(!usuario){
        if(!email){
            //CARACTERÍSTICAS POR DEFECTO
            req.body.rol = 2;
            req.body.estado = 1;
            req.body.foto = 'usuario-icono.png';

            await Usuario.create(req.body);
            let usuarioRegistrado = await Usuario.findOne({where: {usuario: req.body.usuario}})
            res.cookie('usuario', usuarioRegistrado, {sameSite: "lax", secure: false});
            res.json('Usuario registrado'); 
            //res.redirect('/usuario/notas');
        }
        else{
            res.json('Email ya registrado');
            //res.render('registro',{mensaje: 'Email ya registrado'});
        }   
    } else{
        res.json('Usuario ya registrado');
        //res.render('registro',{mensaje: 'Usuario ya registrado',});
    }
});

//INICIAR USUARIO
router.post('/inicio', async (req,res) => {
    let usuario = await Usuario.findOne({
        where: {
            usuario: req.body.usuario,
            password:req.body.password
        }
    });

    //LOGIN
    if(usuario){
        if(usuario.estado != 0){
            if(usuario.rol == 1){
                res.cookie('administrador', usuario, {sameSite: "none", secure: true});   
                res.json('Administrador iniciado');
            } 
            else{
                res.cookie('usuario', usuario, {sameSite: "none", secure: true});
                res.json('Usuario iniciado');         
            }
        }
        else{
            res.json('Usuario dado de baja');  
        }
    } 
    else{
        res.json('Usuario y contraseña inexistentes');
    } 
});

//OBTENER INFORMACIÓN DEL USUARIO
router.get('/usuario', async (req, res) => {
    let usuario = req.cookies['usuario'];
    res.json(usuario);
});

//OBTENER TABLAS ADMINISTRADOR
router.get('/administrador', async (req,res) => {
    let administrador = req.cookies['administrador'];

    let tablaUsuarios= await Usuario.findAll({
        where: {
            rol: 2,
            estado:1
        }
    });
    
    let tablaAdmin = await Usuario.findAll({
        where: {
            id: {
                [Op.not]: administrador.id //Mostrar todos los administradores diferentes del administrador ingresado
            },
            rol:1,
            estado:1
        }}
    );

    let tablaBajas = await Usuario.findAll({
        where: {
            estado:0
        }
    });

    res.json({administrador, tablaUsuarios, tablaAdmin, tablaBajas});
});

//OPERACIONES ADMINISTRADOR-------------------------------------------------
router.post('/insertar-usuario-administrador',async (req,res) => {
    let usuario = await Usuario.findOne({where: {usuario: req.body.usuario}});
    let email = await Usuario.findOne({where: {email: req.body.email}});    
    //VALIDACIÓN DE REGISTRO
    if(!usuario){
        if(!email){
            req.body.foto = 'usuario-icono.png';
            req.body.estado = 1;
            await Usuario.create(req.body);
            res.json('Usuario insertado');
        }
        else{
            res.json('Email ya registrado');
        }   
    } else{
        res.json('Usuario ya registrado');
    }
});

router.get('/info-editar-usuario/:id', async (req,res) => {
    let usuario = await Usuario.findOne({where: {id: req.params.id}});
    res.json(usuario)
});

router.get('/borrar-usuario-administrador', async (req,res) => {
    await Usuario.destroy({where: {id: req.query.id}});         
    await Nota.destroy({where: {id_usuario: req.query.id}});

    res.json('Usuario borrado');
});

router.get('/baja-usuario-administrador', async (req,res) => {
    await Usuario.update({ estado: 0 }, { where: {id: req.query.id} });
    res.json('Usuario dado de baja');
});

router.get('/restaurar-usuario-administrador', async (req,res) => {
    await Usuario.update({ estado: 1 }, { where: {id: req.query.id} });
    res.json('Usuario restaurado');
});

router.post('/editar-usuario-administrador', (req,res) => {
    Usuario.update(req.body, {where: {id: req.body.id}});
    res.json('Usuario editado');
});

router.post('/editar-perfil-administrador', async (req,res) => {
    await Usuario.update(req.body, {where: {id: req.body.id}});

    //Actualizar la cookie del administrador
    let adminModificado = await Usuario.findOne({where: {id: req.body.id}});
    res.cookie('administrador', adminModificado, {sameSite: "none", secure: true}); 
    res.json(adminModificado);
});

module.exports = router;

/*
¿Qué puede ser?
-La cookie no es detectada por el ajax
-La cookie no es detectada por el javascript
-No hay permisos para ver lo que hay en la cookie
-WTF
*/