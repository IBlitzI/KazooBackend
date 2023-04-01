const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const rabbitmqQueueName = 'emailQueue';
const rabbitmqConn = {
        username : "guest",
        password : "guest"
    }

async function sendEmailViaRabbitMQ(emailMessage) {
  try {
    const connection = await amqp.connect(rabbitmqConn);
    const channel = await connection.createChannel();
    await channel.assertQueue(rabbitmqQueueName, { durable: true });
    await channel.sendToQueue(rabbitmqQueueName, Buffer.from(JSON.stringify(emailMessage)), { persistent: true });
    console.log(`E-posta kuyruğa eklendi: ${JSON.stringify(emailMessage)}`);
  } catch (err) {
    console.error(`E-posta gönderimi sırasında bir hata oluştu: ${err}`);
  }
}



async function consumeEmailQueue() {
  try {
    console.log('process.env.GMAIL_USERNAME', process.env.GMAIL_USERNAME)
    const connection = await amqp.connect(rabbitmqConn);
    const channel = await connection.createChannel();
    await channel.assertQueue(rabbitmqQueueName, { durable: true });
    channel.consume(rabbitmqQueueName, (msg) => {
      const emailMessage = JSON.parse(msg.content.toString());
      console.log(`E-posta alındı: ${JSON.stringify(emailMessage)}`);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
            user: '', // generated ethereal user
            pass: ''   // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: emailMessage.from,
        to: emailMessage.to,
        subject: emailMessage.subject,
        text: emailMessage.text,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(`E-posta gönderimi sırasında bir hata oluştu: ${err}`);
        } else {
          console.log(`E-posta gönderildi: ${info.response}`);
        }
      });
    });
  } catch (err) {
    console.error(`E-posta kuyruğundan mesaj alırken bir hata oluştu: ${err}`);
  }
}

consumeEmailQueue();
sendEmailViaRabbitMQ({
  from:'',
  to: 'mustafasswork@gmail.com',
  subject: 'Test E-postası',
  text: 'Bu bir test e-postasıdır.',
});