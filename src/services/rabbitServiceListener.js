/* import amqp from 'amqplib';
import dotenv from 'dotenv';
import transporter from '../config/emailConfig.js';

dotenv.config();

const RABBITMQ_URL = "amqps://swaoxvxj:I3ebhgz2vpi0rsUGFeKSCGu-ZUy4zsof@hawk.rmq.cloudamqp.com/swaoxvxj";

export async function userEvents() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL || "amqp://admin:admin@rabbitmq");
/*         const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBIT_HOST || 'rabbitmq',
            port: 5672,
            username: process.env.RABBITMQ_USER || 'user',
            password: process.env.RABBIT_PASS || 'password'
        });
         
        const channel = await connection.createChannel();

        const exchange = 'user_event';
        const queue = 'user_created_queue';
        const routingKey = 'user.created';

        await channel.assertExchange(exchange, 'topic', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        console.log(`Waiting for messages ${queue}`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const response = JSON.parse(msg.content.toString());
                    console.log(response);

                    const to = response.username; // El correo está en username
                    const subject = 'Bienvenido(a)';
                    const text = to.split('@')[0]; // Extrae el nombre antes del '@'

                    if (!to) {
                        console.error("Error: El destinatario (to) está vacío o no definido.");
                        channel.nack(msg, false, false);
                        return;
                    }

                    await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to,
                        subject,
                        template: 'email',
                        context: { nombre: text, mensaje: "Bienvenido a la familia" }
                    });

                    console.log(`Correo enviado con éxito a ${to}`);
                    channel.ack(msg);
                } catch (error) {
                    console.error("Error al procesar el mensaje o enviar el correo:", error);
                    channel.nack(msg, false, false);
                }
            }
        }, { noAck: false });

        connection.on('close', () => {
            console.error('Conexión cerrada, intentando reconectar en 5s...');
            setTimeout(userEvents, 5000);
        });
    } catch (error) {
        console.error('Error conectando a RabbitMQ:', error.message);
        console.log('Reintentando en 5s...');
        setTimeout(userEvents, 5000);
    }
} */

    import amqp from 'amqplib';
    import dotenv from 'dotenv';
    import transporter from '../config/emailConfig.js';
    
    dotenv.config();
    
    const RABBITMQ_URL = process.env.RABBITMQ_URL;
    const RABBIT_EXCHANGE = 'user_event';
    const QUEUE_NAME = 'user_created_queue';
    const ROUTING_KEY = 'user.created';
    
    export async function userEvents() {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
    
            await channel.assertExchange(RABBIT_EXCHANGE, 'topic', { durable: true });
            await channel.assertQueue(QUEUE_NAME, { durable: true });
            await channel.bindQueue(QUEUE_NAME, RABBIT_EXCHANGE, ROUTING_KEY);
    
            console.log(`Esperando mensajes en la cola: ${QUEUE_NAME}`);
    
            channel.consume(QUEUE_NAME, async (msg) => {
                if (msg !== null) {
                    try {
                        const response = JSON.parse(msg.content.toString());
                        console.log("Mensaje recibido:", response);
    
                        const to = response.username; // Correo del usuario
                        if (!to) {
                            console.error("Error: destinatario vacío o no definido.");
                            channel.nack(msg, false, false);
                            return;
                        }
    
                        const subject = 'Bienvenido(a)';
                        const text = to.includes('@') ? to.split('@')[0] : 'Usuario';
    
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to,
                            subject,
                            template: 'email',
                            context: { nombre: text, mensaje: "Bienvenido a la familia" }
                        });
    
                        console.log(`Correo enviado con éxito a ${to}`);
                        channel.ack(msg);
                    } catch (error) {
                        console.error("Error procesando el mensaje o enviando el correo:", error);
                        channel.nack(msg, false, false);
                    }
                }
            }, { noAck: false });
    
            connection.on('close', () => {
                console.error('Conexión cerrada, intentando reconectar en 5s...');
                setTimeout(userEvents, 5000);
            });
        } catch (error) {
            console.error('Error conectando a RabbitMQ:', error.message);
            console.log('Reintentando en 5s...');
            setTimeout(userEvents, 5000);
        }
    }    