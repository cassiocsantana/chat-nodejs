const net = require("net");
const readline = require("readline");

let AddressIpServer = ""; // armazena ip
let AddressPortServer = ""; // armazena porta
let User = ""; // // armazena nome do usuário

const rl = readline.createInterface(process.stdin, process.stdout); // cria interface de leitura e escrita
rl.setPrompt(" You >"); // essa função funciona quando quer

// função organizar o codigo minizando e para receber entrada de dados

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, input => resolve(input));
  });
}

// Configurações iniciar para o cliente se conectar

async function questions() {
  AddressIpServer = await ask("INFORME O IP DO SERVIDOR: ");
  AddressPortServer = await ask("INFORME A PORTA: ");
  User = await ask("What is User? ");
}

async function load_client() {
  await questions();
  await set_config_client(AddressIpServer, AddressPortServer, User);
}

load_client();

// configurações para ser enviada ao servidor
function set_config_client(IPServer, PortServer, user) {
  const client = new net.Socket();
  console.log("------------Chat--------------"); // charme

  client.connect(PortServer, IPServer, function() {
    // conecta ao servidor
    rl.prompt();
  });

  client.on("data", function(data) {
    // recebe dados do servidor
    console.log(data.toString());
  });

  rl.on("line", function(line) {
    // envia os dados para o servidor
    client.write(user + ": " + line);
  });

  client.on("close", function() {
    // trata evendo de quando sair do servidor
    console.log("Connection closed");
    process.exit(0);
  });

  client.on("error", () => {
    // informa que o ip pode estar errado.
    console.log("Verifique o ip e porta..");
    client.close();
  });
}
