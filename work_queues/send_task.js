const amqp = require("amqplib");

const queueName = "task";
const msg = process.argv.slice(2).join(" ") || "Hello world";

const sendTask = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
  console.log("Sent: ", msg);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendTask();
