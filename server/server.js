require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/usuarios', function(req, res) {
    res.json('Get Users list')
})

app.get('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json(`Get User with id: ${id}`)
})

app.post('/usuarios', function(req, res) {

    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            newUser: body
        });
    }

})

app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id;

    res.json({
        id
    })
})

app.delete('/usuarios/:id', function(req, res) {
    let id = req.params.id;

    res.json(`Delete User with id: ${id}`)
})


app.listen(process.env.PORT, () => {
    console.log(`Listening at port ${3000}`);
})