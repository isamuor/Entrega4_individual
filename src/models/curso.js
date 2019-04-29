const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const cursoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true, //Evitar errores con espacios agreagados sin querer

    },
    id: {
        type: Number,
        required: true,
        unique: true,
        trim: true, //Evitar errores con espacios agreagados sin querer

    },
    valor: {
        type: String,
        required: true,
        trim: true, //Evitar errores con espacios agreagados sin querer

    },
    descripcion: {
        type: String,
        required: true,
        trim: true, //Evitar errores con espacios agreagados sin querer

    },
    modalidad: {
        type: String,
        trim: true, //Evitar errores con espacios agreagados sin querer

    },
    intensidad: {
        type: Number,
        trim: true, //Evitar errores con espacios agreagados sin querer

    },
    estado: {
        type: String,
        trim: true, //Evitar errores con espacios agreagados sin querer
        default: 'disponible'

    },
    programa: {
        type: Buffer,
    }




});

cursoSchema.plugin(uniqueValidator, { message: 'El id del curso ya existe' });

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso