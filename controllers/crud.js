const conexion = require('../database/db');

exports.save = (req, res) => {
    const { pregunta, clave, respuesta, tipo } = req.body;

    const query = 'INSERT INTO consultas SET ?';
    const values = { pregunta, clave, respuesta, tipo };

    conexion.query(query, values, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/');
        }
    });
};

exports.update = (req, res) => {
    const { id, pregunta, clave, respuesta, tipo } = req.body;

    const query = 'UPDATE consultas SET ? WHERE id = ?';
    const values = [{ pregunta, clave, respuesta, tipo }, id];

    conexion.query(query, values, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/');
        }
    });
};
