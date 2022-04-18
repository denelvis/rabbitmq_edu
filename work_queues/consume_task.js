const amqp = require("amqplib");

const queueName = "task";

const consumeTask = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  console.log(`Waiting a tasks in queue: ${queueName}`);
  await channel.consume(
    queueName,
    (msg) => {
      const secs = msg.content.toString().split(".").length;
      console.log("[x] Received: ", msg.content.toString());
      setTimeout(() => {
        console.log("Done resizing image");
        channel.ack(msg);
      }, secs * 1000);
    },
    { noAck: false }
  );
};

consumeTask();
