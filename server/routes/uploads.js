const express = require('express');
const fileUpload = require('express-fileupload')
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');


app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', function(req, res) {


    let tipo = req.params.tipo;
    let id = req.params.id;



    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionando ningun archivo'
            }
        });
    }


    let tiposValidos = ['productos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo de carga no permitida'
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.')[0];
    let extensionArchivo = archivo.name.split('.')[1];
    let extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo de archivo no permitido'
            }
        });
    }

    let newNombre = `${id}-${ new Date().getMilliseconds() }.${extensionArchivo}`
    archivo.mv(`uploads/${tipo}/${newNombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, newNombre);

        } else if (tipo === 'productos') {
            imagenProducto(id, res, newNombre);

        }

    });



});


function imagenUsuario(id, res, nombreArchivo) {


    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }



        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                Usuario: usuarioGuardado,
            })
        });

    });


}



function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }



        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                Producto: productoGuardado,
            })
        });

    });

}

function borrarArchivo(nombreImagen, tipo) {
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }

}

module.exports = app;