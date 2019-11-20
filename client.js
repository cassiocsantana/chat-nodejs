const net = require("net");
const readline = require("readline");

let AdressIPServer = "";
let AdressPORTServer = "";
let User = "";
let Flag = true;

const rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt(" You >");

// Set Quetions

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, input => resolve(input));
  });
}

// Questions

async function questions() {
  AdressIPServer = await ask("INFORME O IP DO SERVIDOR: ");
  AdressPORTServer = await ask("INFORME A PORTA: ");
  User = await ask("What is User? ");
}

async function load_client() {
  await questions();
  await set_config_client(AdressIPServer, AdressPORTServer, User);
}

load_client();

function set_config_client(IPServer, PortServer, user) {
  const client = new net.Socket();
  console.log("------------Chat--------------");

  client.connect(PortServer, IPServer, function() {
    rl.prompt();
  });

  client.on("data", function(data) {
    console.log(data.toString());
  });

  rl.on("line", function(line) {
    client.write(user + ": " + line);
  });

  client.on("close", function() {
    console.log("Connection closed");
    process.exit(0);
  });

  client.on("error", () => {
    console.log("Verifique o ip e porta..");
  });
}
