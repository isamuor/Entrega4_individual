// Requires
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//### Para usar las variables de sesión
const session = require('express-session')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}))

//Paths
const dirPublic = path.join(__dirname, '../public');
const dirNode_modules = path.join(__dirname, '../node_modules');
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));

//Static
app.use(express.static(dirPublic));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use((req, res, next) => {

    if (req.session.rol === 'admin') {
        res.locals.sesion = true;
        res.locals.usuario = req.session.usuario
    } else if (req.session.rol === 'aspirante') {
        res.locals.sesion2 = true;
        res.locals.usuario = req.session.usuario
    }
    next()
})

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }))

//Routes
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, result) => {
    if (err) {
        return console.log(err);
    }
    console.log("Conectado");
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto' + process.env.PORT);
})