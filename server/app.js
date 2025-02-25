require('dotenv').config();
const express = require('express');
const twilioClient = require('./twilioConfig');

const app = express();
app.use(express.json());
app.use(express.static('public'));

let otpStorage = {}; // Almacenar OTPs por número de teléfono
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutos

// ✅ Ruta corregida
app.post('/enviar-otp', (req, res) => {
    console.log("Solicitud recibida en /enviar-otp:", req.body); // 👀 Verifica qué llega desde el frontend
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string') {
        return res.status(400).json({ message: 'Número de teléfono inválido' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStorage[phone] = { otp, timestamp: Date.now() };
    console.log(`OTP generado para ${phone}: ${otp}`); // 👀 Ver el OTP generado
    twilioClient.messages.create({
        body: `Luis, tú código OTP es: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    })
        .then(() => res.json({ message: 'OTP enviado' }))
        .catch((error) => res.status(500).json({ message: 'Error enviando OTP', error }));
});

// ✅ Ruta corregida
app.post('/validar-otp', (req, res) => {
    const { phone, otp } = req.body;
    console.log(`📩 Solicitud a /validar-otp -> phone: ${phone}, otp: ${otp}`);
    console.log("🔎 Estado actual de otpStorage:", otpStorage);

    if (!phone || !otp) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    const storedOtp = otpStorage[phone];

    if (!storedOtp) {
        console.log(`❌ No se encontró OTP para ${phone}`);
        return res.status(400).json({ message: 'Código OTP no encontrado' });
    }

    const isExpired = Date.now() - storedOtp.timestamp > OTP_EXPIRATION_TIME;
    if (isExpired) {
        delete otpStorage[phone];
        console.log(`⌛ Código OTP expirado para ${phone}`);
        return res.status(400).json({ message: 'Código OTP expirado' });
    }

    if (otp === storedOtp.otp) {
        delete otpStorage[phone]; // OTP válido, lo eliminamos
        console.log(`✅ Código OTP correcto para ${phone}`);
        return res.json({ success: true, message: 'Código OTP válido' });
    } else {
        console.log(`❌ Código OTP incorrecto para ${phone}`);
        return res.status(400).json({ message: 'Código OTP inválido' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
