const net = require("net");
const readLine = require("readline");

//Define Var
let Clients = [];
let AdressIPServer = "";
let AdressPORTServer = "";

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
  broadcast(socket.name + " Conectou no Chat");
  socket.setEncoding("utf8");

  // Handle incoming messages from clients.
  socket.on("data", function(data) {
    broadcast(data.toString(), socket);
  });
  server.getConnections(function(err, count) {
    console.log(socket.name + count);
  });

  // Remove the client from the list when it leaves
  socket.on("end", function() {
    Clients.splice(Clients.indexOf(socket), 1);
    broadcast(socket.name + " > Deixou a conversa.\n", socket);
  });

  function broadcast(message, sender) {
    Clients.forEach(function(client) {
      // Tratamento para nao enviar a mesma mensagem a quem originou
      if (client === sender) return;
      client.write(message);
    });
    // Envia a mensagem na console
    process.stdout.write(message + "\n");
  }
};

const server = net.createServer(handleConnetion);

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

async function load_server() {
  await questions();
  await set_server(AdressIPServer, AdressPORTServer);
}

load_server();
