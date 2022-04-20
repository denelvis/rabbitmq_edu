const amqplib = require("amqplib");

const exchangeName = "headers_logs";

const receiveHeader = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "headers", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);
  channel.bindQueue(
    q.queue,
    exchangeName,
    "",
    '{"account": "new", "method": "facebook", "x-match": "any"}'
  );
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content)
        console.log(
          `Routing key: ${JSON.stringify(
            msg.properties.headers
          )}. Message: ${msg.content.toString()}`
        );
    },
    { noAck: true }
  );
};

receiveHeader();
