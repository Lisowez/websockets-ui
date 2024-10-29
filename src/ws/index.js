import { WebSocketServer } from "ws";
import { winners, players, rooms } from "./database/database.js";

let room = 0;
let game = 0;

const ws = new WebSocketServer({ port: 3000 });

ws.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (dataJSON) => {
    console.log(dataJSON.toString());
    const data = JSON.parse(dataJSON);
    if (data.type === "reg") {
      const dataInfo = JSON.stringify({
        name: JSON.parse(data.data).name,
        index: 1,
        error: false,
        errorText: "",
      });

      ws.send(JSON.stringify({ data: dataInfo, type: "reg" }));

      if (
        winners.some((item) => item.name !== JSON.parse(data.data).name) ||
        winners.length === 0
      ) {
        winners.push({
          name: JSON.parse(data.data).name,
          wins: 0,
        });
        ws.send(
          JSON.stringify({
            data: JSON.stringify(winners),
            type: "update_winners",
            id: 0,
          })
        );
      }
      ws.send(
        JSON.stringify({
          data: JSON.stringify(rooms),
          type: "update_room",
          id: 0,
        })
      );
    }
    if (data.type === "create_room") {
      rooms.push({ indexRoom: (room += 1), roomUsers: [] });
      ws.send(
        JSON.stringify({
          data: JSON.stringify(rooms),
          type: "update_room",
          id: 0,
        })
      );
    }
    if (data.type === "add_user_to_room") {
      ws.send(
        JSON.stringify({
          type: "create_game",
          id: 0,
          data: JSON.stringify({
            idGame: (game += 1),
            idPlayer: "wlad",
          }),
        })
      );
      ws.send(
        JSON.stringify({
          data: JSON.stringify(rooms),
          type: "update_room",
          id: 0,
        })
      );
    }
  });
});
ws.on("close", () => {
  console.log("Client disconnected");
});
ws.on("error", () => {
  console.log("Client error");
});
