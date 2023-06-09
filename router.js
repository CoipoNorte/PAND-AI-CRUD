const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const conexion = require('./database/db');
const conn = require('./database/db');

router.get('/', (req, res) => {
    if (req.session.loggedin) {
        conexion.query('SELECT * FROM consultas', (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('index.ejs', { results: results, name: req.session.name, login: true });
            }
        });
    } else {
        res.redirect('/login'); // Redirecciona a la página de inicio de sesión si no hay una sesión válida
    }
});


router.get('/create', (req, res) => {
    res.render('create');
});

router.get('/edit/:id', (req, res) => {    
    const id = req.params.id;
    conexion.query('SELECT * FROM consultas WHERE id=?',[id] , (error, results) => {
        if (error) {
            throw error;
        }else{            
            res.render('edit.ejs', { consulta: results[0] });            
        }        
    });
});

router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    conexion.query('DELETE FROM consultas WHERE id = ?',[id], (error, results) => {
        if (error) {
            console.log(error);
        } else {           
            res.redirect('/');         
        }
    })
});

// USUARIOS
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { user, pass } = req.body;
    const passwordHash = await bcrypt.hash(pass, 8);
  
    try {
        await conn.query('INSERT INTO usuarios SET ?', {
            user,
            pass: passwordHash
        });
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
  
    if (user && pass) {
        conn.query('SELECT * FROM usuarios WHERE user = ?', [user], async (error, results, fields) => {
            if (results.length == 0 || !(await bcrypt.compare(pass, results[0].pass))) {
                req.session.error = 'Credenciales inválidas';
                res.redirect('/login');
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].name;
                req.session.save(() => {
                    res.redirect('/');
                });
            }
        });
    } else {
        req.session.error = 'Por favor, ingrese su USUARIO y CONTRASEÑA!';
        res.redirect('/login');
    }
});

// Función para limpiar la caché luego del logout
router.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
router.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/login') // siempre se ejecutará después de que se destruya la sesión
	})
});

const crud = require('./controllers/crud');

router.post('/save', crud.save);
router.post('/update', crud.update);

module.exports = router;