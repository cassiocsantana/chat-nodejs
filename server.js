const net = require("net");
const readLine = require("readline");

//Define Var
let Clients = [];
let AdressIPServer = "";
let AdressPORTServer = "";
let sender = Clients;
// Create interface of read

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

// set param socket

const handleConnetion = async socket => {
  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  // Add client of the list
  Clients.push(socket);

  console.log("Nova conexão de:", socket);
  socket.setEncoding("utf8");

  // Handle incoming messages from clients.
  socket.on("data", function(data) {
    broadcast("\n" + data.toString(), socket);
  });

  // Remove the client from the list when it leaves
  socket.on("end", function() {
    Clients.splice(Clients.indexOf(socket), 1);
    broadcast(socket.name + " Deixou a conversa.\n");
  });

  function broadcast(message, sender) {
    Clients.forEach(function(client) {
      // Tratamento para nao enviar a mesma mensagem a quem originou
      if (client === sender) return;
      client.write(message);
    });
    // Envia a mensagem na console
    process.stdout.write(message);
  }

  broadcast(socket.name + " conectado ao servidor\n", socket);
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

// socket.on("data", data => console.log(data.toString()));

// socket.on("myEvent", function(message) {
//   socket.write(message);
// });
