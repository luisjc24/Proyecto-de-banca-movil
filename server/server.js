const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Conectar a MongoDB y mostrar logs para depuración
mongoose.connect('mongodb://localhost/proyecto', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Conectado a MongoDB correctamente.'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Definir el esquema y modelo para el usuario (adaptado a la estructura de tu colección)
const UserSchema = new mongoose.Schema({
    user: String,       // Campo para el nombre de usuario (por ejemplo: "Luis")
    password: String,   // Contraseña (por ejemplo: "854721")
    nombres: String,
    apellidos: String,
    DNI: String,
    edad: Number,
    direccion: String,
    distrito: String,
    provincia: String,
    region: String
});
const User = mongoose.model('User', UserSchema, 'user'); // 'user' es el nombre de la colección

// Endpoint de login con logs para depuración
app.post('/api/login', async (req, res) => {
    console.log('Recibida petición POST a /api/login:', req.body);
    const { username, password } = req.body;
    
    try {
        console.log(`Buscando usuario: "${username}" en la base de datos...`);
        const userFound = await User.findOne({ user: username });
        
        if (!userFound) {
            console.log(`Usuario no encontrado: "${username}"`);
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }
        
        console.log('Usuario encontrado:', userFound);
        
        if (userFound.password === password) {
            console.log(`Login exitoso para: "${username}"`);
            return res.json({ success: true });
        } else {
            console.log(`Contraseña incorrecta para: "${username}"`);
            return res.status(401).json({ success: false, message: "Contraseña incorrecta." });
        }
    } catch (err) {
        console.error("Error en el endpoint de login:", err);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(4000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
