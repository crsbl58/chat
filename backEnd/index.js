const httpServer = require("http").createServer();

let messages = [
  {
    colorCode: "aqua",
    name: "cristobal",
    message: "hola",
  },
];

/* let countUser =0; */

let server = httpServer.listen(process.env.PORT || 3001, () => {
  console.log("...");
});
let io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", function (socket) {
  console.log("usuario conectado", socket.id);
/*   countUser= countUser+1;
  console.log(countUser);
  socket.emit("countUser", countUser); */

  socket.emit("messagesUsers", messages);

  socket.on("sendMessages", (text) => {
    messages.push({
      name: text.name,
      message: text.message,
      colorCode: text.colorCode,
    });
    console.log(text);
    io.emit("messagesUsers", messages);

    if (messages.length > 200) {
      messages = [
        {
          colorCode: 0,
          name: "Admin",
          message: "chat reset",
        },
      ];
    }

    /*   let busqueda = users.filter((list) => list.id == text.id);
    if (busqueda == false) {
      users.push({ id: text?.id });
      console.log(users);
      io.emit("listUsers", users);
    } */
  });

  socket.on("disconnect", (text) => {
    console.log("usuario desconectado");
/*     countUser= countUser-1;
    socket.emit("countUser", countUser); */
  });
});
