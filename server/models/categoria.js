const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: [true, 'Ya existe una categoria con este nombre'],
        required: [true, 'El nombre es necesario'],
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es necesaria'],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es necesario']
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);