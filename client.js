const net = require("net");
const readline = require("readline");

let AdressIPServer = "";
let AdressPORTServer = "";
let User = "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  // prompt: "You > "
});

// Set Quetions

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, input => resolve(input));
  });
}

// Questions

async function questions() {
  AdressIPServer = await ask("INFORME O IP DE SUA MAQUINA: ");
  AdressPORTServer = await ask("INFORME A PORTA: ");
  User = await ask("What is User? ");
}

async function load_client() {
  await questions();
  await set_config_client(AdressIPServer, AdressPORTServer, User);
}

load_client();

function set_config_client(IPServer, PortServer, user) {
  console.log("------------Chat--------------");
  const client = new net.Socket();
  client.connect(PortServer, IPServer, () => {
    rl.addListener("line", line => {
      client.write(user + ": " + line);
    });
  });

  client.on("end", () => {
    console.log("Servidor Desconectou");
    client.close();
  });

  client.on("error", function(e) {
    if (e.code == "EADDRINUSE") {
      console.log("Tentando conectar, carregando...");
      setTimeout(function() {
        client.close();
        client.connect(PortServer, IPServer);
      });
    }
  });
}
