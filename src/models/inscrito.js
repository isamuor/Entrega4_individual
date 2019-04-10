const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const inscritoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true, //Evitar errores con espacios agreagados sin querer
        //enum: { values: ['maria', 'jesus', 'teresa', 'pedro', 'david'] }
    },
    documento: {
        type: Number,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    telefono: {
        type: Number,
        required: true,
        trim: true,
    },
    nombreCurso: {
        type: String,
        required: true,
        trim: true,
    }


});

inscritoSchema.plugin(uniqueValidator);

const Inscrito = mongoose.model('Inscrito', inscritoSchema);

module.exports = Inscrito