import { WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 3000 });

ws.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (dataJSON) => {
    const data = JSON.parse(dataJSON);
    if (data.type === "reg") {
      const dataInfo = JSON.stringify({
        name: JSON.parse(data.data).name,
        index: 1,
        error: false,
        errorText: "",
      });

      ws.send(JSON.stringify({ data: dataInfo, type: "reg" }));
    }
  });
});
console.log(`Start WebSocket server on the ${3000} port!`);
