const router = require('express').Router();
const {Nota} = require('../../conexion')

router.put('/operacion-notas', async (req,res) => {
    let nota = req.query;
    console.log('conectando con ajax: '+JSON.stringify(nota));
    res.sendStatus(200); 

    if(await Nota.findOne({where: {id_nota: nota.id_nota}})){
        if(nota.id_usuario == '0'){
            await Nota.destroy({where: {id_nota: nota.id_nota}});
            console.log('Nota destruida');
        }else{
            await Nota.update(nota, {where: {id_nota: nota.id_nota}});
            console.log('Nota actualizada')
        }
    }
    else{
        console.log('Nota creada');
        await Nota.create(nota);
    }
});

module.exports = router;