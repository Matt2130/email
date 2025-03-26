import transporter from "../config/emailConfig.js";
import dotenv from 'dotenv';

dotenv.config();
export const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            //text,
            template: 'email', //Nombre del archivo en "views/email.hbs"
            context: { nombre: 'Manuel', messagge: 'Bienvenido a nuestra plataforma'}
        });
        return res.json({ message: 'Correo enviado con éxito '});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};