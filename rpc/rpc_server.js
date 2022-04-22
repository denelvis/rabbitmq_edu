const amqplib = require("amqplib");

const queueName = "rpc_queue";

const seq = {};
function fibonacci(num) {
  if (num === 0 || num === 1) return num;
  if (num in seq) return seq[num];
  return (seq[num] = fibonacci(num - 1) + fibonacci(num - 2));
}

const sendFib = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  channel.prefetch(1);
  console.log("[x] Awaiting RPC requests");

  channel.consume(
    queueName,
    (msg) => {
      const n = parseInt(msg.content.toString());
      console.log("[.] fib(%d)", n);

      const fibNum = fibonacci(n);
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(fibNum.toString()),
        { correlationId: msg.properties.correlationId }
      );
      channel.ack(msg);
    },
    { noAck: false }
  );
};

sendFib();
