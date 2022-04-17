const amqplib = require("amqplib");

const queueName = "hello";
const msg = "hello world!";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
};

sendMsg();
