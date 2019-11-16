const net = require("net");

let IP = "192.168.10.118",
  PORT = 4000;

const handleConnetion = async socket => {
  let remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
  console.log("Nova conexão de:", remoteAddress);
  socket.setEncoding("utf8");

  socket.on("data", data => {
    console.log(data.toString());
  });

  socket.on("end", () => {
    console.log(remoteAddress, "desconectou-se");
  });
};
const server = net.createServer(handleConnetion);
server.on("error", err => {
  console.log("Erro ao iniciar servidor!");
});
server.listen(PORT, IP);

server.on("error", function(e) {
  if (e.code == "EADDRINUSE") {
    console.log("Endereço sendo usado, carregando...");
    setTimeout(function() {
      server.close();
      server.listen(PORT, IP);
    }, PORT);
  }
});
