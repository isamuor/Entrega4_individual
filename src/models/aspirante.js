const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const aspiranteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true, //Evitar errores con espacios agreagados sin querer
        //enum: { values: ['maria', 'jesus', 'teresa', 'pedro', 'david'] }
    },
    documento: {
        type: Number,
        required: true,
        unique: true,
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
    rol: {
        type: String,
        required: false,
        trim: true,
        default: 'aspirante',
    }


});

aspiranteSchema.plugin(uniqueValidator, { message: 'El usuario ya existe' });

const Aspirante = mongoose.model('Aspirante', aspiranteSchema);

module.exports = Aspirante