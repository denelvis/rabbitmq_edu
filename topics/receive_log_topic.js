const amqplib = require("amqplib");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: receive_log_topic.js <facility>.<severity>");
  process.exit(1);
}
const exchangeName = "topic_logs";

const receiveTopic = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "topic", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);
  args.forEach((key) => channel.bindQueue(q.queue, exchangeName, key));
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content)
        console.log(
          `Routing key: ${
            msg.fields.routingKey
          }. The message: ${msg.content.toString()}`
        );
    },
    { noAck: true }
  );
};

receiveTopic();
