export default function broadcast(wss, clients, message) {
  clients.forEach((client) => {
    if (client.readyState === wss.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
