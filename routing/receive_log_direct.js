const amqplib = require("amqplib");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: receive_log_direct.js [info] [warning] [error]");
  process.exit(1);
}

const exchangeName = "direct_logs";

const receiveDirect = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "direct", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);
  args.forEach((bindKey) => {
    channel.bindQueue(q.queue, exchangeName, bindKey);
  });
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content)
        console.log(
          `The routing key: ${
            msg.fields.routingKey
          }. The message is: ${msg.content.toString()}`
        );
    },
    { noAck: true }
  );
};

receiveDirect();
