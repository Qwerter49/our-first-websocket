const express = require("express");
const WebSocketServer = require("websocket").server;

const app = express();
const port = process.env.PORT || 9000;
const httpServer = app.listen(port, () => console.log(`Listening on port ${port}`));
const websocket = new WebSocketServer({ httpServer });

app.use(express.static(__dirname + '/frontend'));

app.get("/", (request, response) => {
    response.render('index.html');
})

websocket.on("request", handleRequest);

const connections = [];
function handleRequest(request) {
    const connection = request.accept(null, request.origin);
    connections.push(connection);

    connection.on("open", () => console.log("We OPEN!!!"));
    connection.on("close", () => console.log("We SHUT IT DOWWNNNNN!!!"));

    connection.on("message", (message) => handleMessage(message, connections));
  
    pokeEvery15Seconds(connection);
}

function handleMessage(message, connections) {
    connections.forEach(connection => connection.send(message.utf8Data));
}

function pokeEvery15Seconds(connection) {
    connection.send(`You owe me ${ Math.random() }`);

    setTimeout(() => pokeEvery15Seconds(connection), 15000);
}