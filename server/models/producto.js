const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: {
        type: String,
        unique: [true, 'Ya existe un producto con ese nombre'],
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});


module.exports = mongoose.model('Producto', productoSchema);