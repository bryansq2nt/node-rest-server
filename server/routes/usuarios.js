const express = require('express')
const bcrypt = require('bcryptjs')
const _ = require('underscore');

const Usuario = require('../models/usuario')
const { verificaToken, verificaAdminRole } = require('../middlewares/auth')

const app = express()


app.get('/usuarios', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email img estado role google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }



            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                })
            });


        })
})

app.get('/usuarios/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Usuario.findById(id, (err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: UsuarioDB
        })
    })

})

app.post('/usuarios', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;
    let salt = bcrypt.genSaltSync(10);

    if (!body.password) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La contrasena es necesaria'
            }
        })
    }

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

})

app.put('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.delete('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

})

module.exports = app;