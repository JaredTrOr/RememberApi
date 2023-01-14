const router = require('express').Router();
const {Usuario,Nota,Op} = require('../../conexion');
const subirImagen = require('../../middlewares/subir-img');
require('multer');

//MÉTODOS GET------------------------------------------------------------
router.get('/notas', async (req,res) => {
    let admin = req.query.admin; //Información enviada desde la página de admin

    //Recibir data del usuario
    let usuario = admin =='true' ? req.cookies['administrador'] : req.cookies['usuario'];
    let notas = await Nota.findAll({ where: {id_usuario: usuario.id}});
    console.log('Usuario: '+JSON.stringify(usuario));
    res.render('notas',{usuario,notas,admin});
});

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
    res.render('administrador',{administrador, tablaUsuarios,tablaAdmin,tablaBajas});
});

router.get('/borrar-usuario/:id', async (req,res) => {
    await Usuario.destroy({where: {id: req.params.id}});         //Se borra el usuario en la tabla de usuarios
    await Nota.destroy({where: {id_usuario: req.params.id}});   //Se borra las notas del usuario
    res.redirect('../../iniciar-sesion');
});

router.get('/baja-usuario/:id', async (req,res) => {
    await Usuario.update({estado:0}, {where: {id: req.params.id}});
    res.redirect('../../iniciar-sesion');
});

//MÉTODOS POST----------------------------------------------------------
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
            res.cookie('usuario', usuarioRegistrado); 
            res.redirect('/usuario/notas');
        }
        else{
            res.render('registro',{mensaje: 'Email ya registrado'});
        }   
    } else{
        res.render('registro',{mensaje: 'Usuario ya registrado',});
    }
});

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
                res.cookie('administrador', usuario);   
                res.redirect('/usuario/administrador');
            } 
            else{
                res.cookie('usuario', usuario);         
                res.redirect('/usuario/notas');
            }
        }
        else{
            res.render('iniciar-sesion',{mensaje: 'Usuario dado de baja'});  
        }
    } 
    else{
        res.render('iniciar-sesion',{mensaje: 'Usuario y contraseña inexistentes'});  
    } 
});

router.post('/modificar-usuario', async (req,res) => {
    await Usuario.update(req.body, {where: {id: req.body.id}});
    //Actualizar la cookie
    let usuarioModificado = await Usuario.findAll({where: {id: req.body.id}});
    res.cookie('usuario', usuarioModificado[0]); 
    res.redirect('notas');
    
});

router.post('/modificar-administrador', async (req,res) => {
    await Usuario.update(req.body, {where: {id: req.body.id}});
    //Actualizar la cookie del administrador
    let adminModificado = await Usuario.findAll({where: {id: req.body.id}});
    res.cookie('administrador', adminModificado[0]); 
    res.redirect('administrador');
});

//VISTAS ADMINISTRADOR-------------------------------------------------
router.get('/insertar-usuario', (req,res) => {
    res.render('insertar-usuario',{mensaje:null});
});

router.get('/editar-usuario/:id', async (req,res) => {
    let administrador = await Usuario.findAll({where: {id: req.params.id}});
    res.render('editar-usuario',{administrador});
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
            res.redirect('/usuario/administrador');
        }
        else{
            res.render('insertar-usuario',{mensaje: 'Email ya registrado'});
        }   
    } else{
        res.render('insertar-usuario',{mensaje: 'Usuario ya registrado',});
    }
});

router.get('/restaurar-usuario-administrador', async (req,res) => {
    await Usuario.update({ estado: 1 }, { where: {id: req.query.id} });
    res.redirect('/usuario/administrador');
});

//Borrar y dar de baja
router.get('/borrar-usuario-administrador', async (req,res) => {
    baja = req.query.baja;
    if(baja === '1'){
        await Usuario.update({ estado: 0 }, { where: {id: req.query.id} });
    }else{
        await Usuario.destroy({where: {id: req.query.id}});         
        await Nota.destroy({where: {id_usuario: req.query.id}});
    }
       
    res.redirect('/usuario/administrador');
});

router.post('/editar-usuario-administrador', (req,res) => {
    
    Usuario.update(req.body, {where: {id: req.body.id}})
    .then(() => {
        res.redirect('/usuario/administrador');
    })
    .catch((err) => {
        console.log('Error: '+err);
    });
    ;
});


module.exports = router;