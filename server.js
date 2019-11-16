const net = require("net");
const readLine = require("readline");

//Definição das variaveis

let AdressIPServer = "";
let AdressPORTServer = "";

//Criação da Interface de leitura

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

// set param socket

const handleConnetion = async socket => {
  let remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
  console.log("Nova conexão de:", remoteAddress);
  socket.setEncoding("utf8");
  socket.on("data", data => console.log(data.toString()));
  socket.on("end", () => console.log(remoteAddress, "desconectou-se"));
};

const server = net.createServer(handleConnetion);
server.on("error", err => console.log("Erro ao iniciar servidor!"));

// Inicio Da leitura

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, input => resolve(input));
  });
}

async function questions() {
  AdressIPServer = await ask("INFORME O IP DE SUA MAQUINA: ");
  AdressPORTServer = await ask("INFORME A PORTA: ");
}

async function load_server() {
  await questions();
  await set_server(AdressIPServer, AdressPORTServer);
}

function set_server(IPServer, PortServer) {
  if (IPServer && PortServer) {
    server.listen(PortServer, IPServer);
    server.on("error", function(e) {
      if (e.code == "EADDRINUSE") {
        console.log("Endereço sendo usado, carregando...");
        setTimeout(function() {
          server.close();
          server.listen(PortServer, IPServer);
        }, PortServer);
      }
    });
  }
}

load_server();
