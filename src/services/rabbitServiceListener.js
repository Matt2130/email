import amqp from 'amqplib';
import dotenv from 'dotenv';
import transporter from '../config/emailConfig.js';

dotenv.config();

const RABBITMQ_URL = "amqps://swaoxvxj:I3ebhgz2vpi0rsUGFeKSCGu-ZUy4zsof@hawk.rmq.cloudamqp.com/swaoxvxj";

export async function userEvents() {
    const connection = await amqp.connect(RABBITMQ_URL);
    try {
/*         const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBIT_HOST || 'rabbitmq',
            port: 5672,
            username: process.env.RABBITMQ_USER || 'user',
            password: process.env.RABBIT_PASS || 'password'
        });
         */
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
}