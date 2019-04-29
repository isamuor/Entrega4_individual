const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const Aspirante = require('./../models/aspirante')
const Curso = require('./../models/curso')
const Inscrito = require('./../models/inscrito')
const bcrypt = require('bcrypt');
const session = require('express-session')
const multer = require('multer')
const dirViews = path.join(__dirname, '../../template/views');
const dirPartials = path.join(__dirname, '../../template/partials');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

require('./../helpers/helpers')
require('./../config/config');

//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}))


app.set('view engine', 'hbs');

app.get('/', (req, res) => res.render('index', { nombre: req.session.nombre }));

app.get('/registro', (req, res) => res.render('registro', { nombre: req.session.nombre }));


app.post('/registrar', (req, res) => {

    let aspirante = new Aspirante({
            nombre: req.body.nombre,
            documento: req.body.id,
            email: req.body.email,
            telefono: req.body.tel
        })
        //console.log(aspirante);
    aspirante.save((err, result) => {
        if (err) {
            return res.render('registropost', {
                mensaje: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> ${err} </h4><hr></div>`,
                nombre: req.session.nombre,
            })
        }
        const msg = {
            to: req.body.email,
            from: 'isamuor90@gmail.com',
            subject: 'Bienvenido a plataforma virtual',
            text: 'Bienvenido',
            html: `<h1><strong>Bienvenido a la plataforma de cursos virtuales</strong></h1> <br><br> 
                            <h2>Ahora puede inscribirse en los cursos disponibles</h2><br><br>
                            <h3>Datos de registro</h3>
                            <ul>
                            <li type="circle">Nombre: ${req.body.nombre} </li>
                            <li type="circle">Identificación: ${ req.body.id} </li>
                            <li type="circle">Email: ${req.body.email} </li*/>
                            <li type="circle">Telefono: ${req.body.tel} </li>
                            </ul>`
        };
        sgMail.send(msg);
        res.render('registropost', {
            mensaje: `<div class = 'alert-success'\
            role = 'alert'> <h4 class="alert-heading"> <br> Registro realizado con éxito </h4><hr></div>`,
            nombre: req.session.nombre,
        });
    })

});


app.post('/formularioCrear', (req, res) => {
    Curso.find({}).exec((err, respuesta) => {
        if (err) {
            texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
        }
        res.render('formularioCrear', {
            listaCursos: respuesta,
            nombre: req.session.nombre,
        })
    })

})

/*var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads")
    },
    filename: function(req, file, cb) {
        cb(null, req.body.nombre + '_' + req.body.id + '_' + path.extname(file.originalname))
            //cb(null, file.originalname)
    }
})*/

//var upload = multer({ storage: storage })

var upload = multer({
    // Validación del archivo del lado del cliente
    limits: {
        filesize: 1000000 // 1MB
    },

    fileFilter(req, file, cb) {
        // Validación del formato de archivo del lado del servidor
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('No es un archivo válido'))
        }
        // To accept the file pass `true`, like so:
        cb(null, true)
    }

})

app.post('/crear', upload.single('archivo'), (req, res) => {
    //console.log(req.file);

    let curso = new Curso({
        nombre: req.body.nombre,
        id: req.body.id,
        valor: req.body.valor,
        descripcion: req.body.descripcion,
        modalidad: req.body.modalidad,
        intensidad: req.body.intensidad,
        programa: req.file.buffer
    })

    curso.save((err, result) => {
        if (err) {
            texto = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> ${err} </h4><hr></div>`
            return Curso.find({}).exec((err, respuesta) => {
                if (err) {
                    texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
                }
                res.render('crear', {
                    texto,
                    listaCursos: respuesta,
                    nombre: req.session.nombre,
                })
            })
        }
        texto = `<div class = 'alert-success'\
        role = 'alert'> <h4 class="alert-heading"> <br> El curso fue creado con éxito </h4><hr></div>`
        Curso.find({}).exec((err, respuesta) => {
            if (err) {
                texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
            }
            res.render('crear', {
                texto,
                listaCursos: respuesta,
                nombre: req.session.nombre,

            })
        })

    })

});

app.post('/ver', (req, res) => {
    Curso.find({}).exec((err, respuesta) => {
        if (err) {
            texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
        }
        res.render('ver', {
            listaCursos: respuesta,
            nombre: req.session.nombre,

        })
    })
});

app.post('/inscribir', (req, res) => {
    Curso.find({ estado: 'disponible' }).exec((err, respuesta) => {
        if (err) {
            texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
        }
        res.render('inscribir', {
            listaCursos: respuesta,
            nombre: req.session.nombre,
        })
    })
});

app.post('/inscritos', (req, res) => {

    Aspirante.findOne({ documento: req.session.usuario }, (err, usuario) => {

        if (err) {
            return console.log(err)
        }
        Inscrito.find({ documento: usuario.documento, nombreCurso: req.body.nombreCurso }, (err, resultados) => {

            if (resultados.length == 0) {
                inscrito = new Inscrito({
                    nombre: usuario.nombre,
                    documento: usuario.documento,
                    email: usuario.email,
                    telefono: usuario.telefono,
                    nombreCurso: req.body.nombreCurso,
                });
                inscrito.save((err, result) => {
                    if (err) {
                        return console.log(err);
                    }

                    Curso.findOne({ nombre: req.body.nombreCurso }, (err, cursito) => {
                        const msg = {
                            to: usuario.email,
                            from: 'isamuor90@gmail.com',
                            subject: `Bienvenido al curso: ${cursito.nombre}`,
                            text: 'Bienvenido',
                            html: `<h1><strong>Usted se ha inscrito de manera exitosa al curso  ${req.body.nombreCurso} </strong></h1> <br><br> 
                                        
                                        <h3>Información del Curso</h3>
                                        <ul>
                                        <li type="circle">Nombre:${cursito.nombre} </li>
                                        <li type="circle">Valor: ${cursito.valor} </li>
                                        <li type="circle">Descripción: ${cursito.descripcion} </li*/>
                                        </ul>`,
                            attachments: [{
                                content: cursito.programa.toString('base64'),
                                filename: 'programa.pdf',
                                //type: 'plain/text',
                                disposition: 'attachment',
                                //content_id: 'mytext'
                            }, ],

                        };
                        sgMail.send(msg);
                    })

                    res.render('inscritos', {
                        bandera: true,
                        texto: `<div class = 'alert-success px-4'
                        role = 'alert'> <h4 class="alert-heading"> <br> Inscripción Exitosa </h4><hr></div>`,
                        est: {
                            documento: usuario.documento,
                            nombre: usuario.nombre,
                            nombreCurso: req.body.nombreCurso
                        },
                        nombre: req.session.nombre,
                    });
                })
            } else {
                texto = `<div class = 'alert alert-danger px-4'
        role = 'alert'><h4 class="alert-heading"> <br> Ya se encuentra inscrito al curso </h4><hr></div>`

                res.render('inscritos', {
                    bandera: false,
                    texto,
                    nombre: req.session.nombre,
                });
            }
        })
    });
});

app.post('/verInscritos', (req, res) => {

    cambia = req.body.gridRadios;

    if (!cambia) {
        Curso.find({}).exec((err, respuesta) => {
            if (err) {
                texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
            }
            Inscrito.find({}).exec((err, respuesta2) => {
                if (err) {
                    texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
                }
                res.render('verInscritos', {
                    listaCursos: respuesta,
                    listaInscritos: respuesta2,
                    nombre: req.session.nombre,
                })

            })
        })

    } else {
        Curso.findOneAndUpdate({ nombre: cambia }, { estado: 'cerrado' }, { new: true, runValidators: true, context: 'query' }, (err, resultados) => {
            if (err) {
                texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No se encontró el curso </h4><hr></div>`
            }
            Curso.find({}).exec((err, respuesta) => {
                if (err) {
                    texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
                }
                Inscrito.find({}).exec((err, respuesta2) => {
                    if (err) {
                        texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
                    }
                    res.render('verInscritos', {
                        listaCursos: respuesta,
                        listaInscritos: respuesta2,
                        nombre: req.session.nombre,
                    })

                })
            })

        })


    }
});


app.post('/eliminarInscritos', (req, res) => {
    Curso.find({ estado: 'disponible' }).exec((err, respuesta) => {
        if (err) {
            texto: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos creados </h4><hr></div>`
        }
        res.render('eliminarInscritos', {
            listaCursos: respuesta,
            nombre: req.session.nombre,
        })
    })

});

app.post('/eliminado', (req, res) => {
    idElimina = req.body.id;
    cursoElimina = req.body.nombreCurso;
    Inscrito.findOneAndDelete({ nombreCurso: cursoElimina, documento: idElimina }, (err, resultados) => {

        if (err) {
            return console.log(err)
        }
        if (!resultados) {
            return res.render('eliminado', {
                bandera: false,
                mensaje: `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> Usuario no econtrado </h4><hr></div>`,
                nombre: req.session.nombre,
            })
        }
        Inscrito.find({ nombreCurso: cursoElimina }).exec((err, respuesta) => {

            if (err) {
                return console.log(err)
            }
            if (respuesta.length == 0) {
                res.render('eliminado', {
                    bandera: false,
                    mensaje: texto = `<div class = 'alert alert-success' role = 'alert'><h4 class="alert-heading"> <br> No quedan usuarios inscritos </h4><hr></div>`,
                    nombre: req.session.nombre,
                })
            } else {
                res.render('eliminado', {
                    bandera: true,
                    mensaje: texto = `<div class = 'alert alert-success' role = 'alert'><h4 class="alert-heading"> <br> El usuario fue eliminado con éxito </h4><hr></div>`,
                    InscritosCursoInteres: respuesta,
                    nombre: req.session.nombre,
                })
            }
        })
    })

});

app.post('/ingresar', (req, res) => {
    Aspirante.findOne({ documento: req.body.documento }, (err, resultados) => {
        if (err) {
            return console.log(err)
        }
        if (!resultados) {
            return res.render('ingresar', {
                mensaje: "Usuario no encontrado"
            })
        }

        //Para crear las variables de sesión
        req.session.usuario = resultados.documento
        req.session.nombre = resultados.nombre
        req.session.rol = resultados.rol

        if (req.session.rol === 'admin') {
            return res.render('ingresar', {
                mensaje: "Bienvenido " + resultados.nombre,
                nombre: req.session.nombre,
                id: req.session.usuario,
                sesion: true

            })
        } else if (req.session.rol === 'aspirante') {
            return res.render('ingresar', {
                mensaje: "Bienvenido " + resultados.nombre,
                nombre: req.session.nombre,
                id: req.session.usuario,
                sesion2: true

            })
        };
    })
})

app.get('/salir', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err)
    })
    res.redirect('/')
})

module.exports = app