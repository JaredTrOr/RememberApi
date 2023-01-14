const express = require('express');
const app = express();
const port = process.env.port || 3000;
const routes = require('./routes/routes');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5501'
})); //Permite que se utilize la API   
app.use('/static',express.static(path.join(__dirname ,'/static')));
app.use('/web',express.static(path.join(__dirname ,'/web'))); //RUTA ESTÁTICA IMAGEN
app.use('/',routes);
app.set('view engine','ejs');
require('./conexion'); //Requerimos de conexión con el proyecto

app.listen(port, () =>{
    console.log('El servidor esta corriendo en el puerto 3000');
});



