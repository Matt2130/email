/*import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/*
const handlebearOptions = {
    viewEngine: {
        extName: "hbs",
        partialsDir: resolve('./src/views/'),
        defaultLayout: false,
    },
    viewPath: resolve('/src/views/'),
    extName: "hbs",
};

transporter.use('compile', hbs(handlebearOptions));


export default transporter;*/

import { resolve } from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Configurar Handlebars correctamente
const handlebarsOptions = {
    viewEngine: {
        extName: ".hbs",
        partialsDir: resolve('./src/views/'),
        defaultLayout: false
    },
    viewPath: resolve('./src/views/'),
    extName: ".hbs"
};

// Aplicar middleware de Handlebars en Nodemailer
transporter.use('compile', hbs(handlebarsOptions));

export default transporter;