const net = require("net");
const readLine = require("readline");

//Define as Variaveis
let Clients = []; // Array de clientes que irão se conectar
let AddressIpServer = ""; // Armazena o Ip
let AddressPortServer = ""; // Armazena a Porta

// Criação da interface de entrada e saida de dados no terminal

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configurações do servidor e ações quando receber um novo usuário

const handleConnetion = async socket => {
  socket.name = socket.remoteAddress + ":" + socket.remotePort; // armazena os dados em socket para identificar o cliente
  Clients.push(socket); // adiciona o cliente no array
  broadcast(socket.name + " Conectou no Chat"); // da um broadcast para informar que um cliente novo esta conectado
  socket.setEncoding("utf8"); //padroniza a entrada do teclado

  // recebe os dados dos clientes
  socket.on("data", function(data) {
    broadcast(data.toString(), socket);
  });

  // captura as conecções e as mantém - para questões de eventuais erros no socket
  server.getConnections(function(err, count) {
    console.log(socket.name + count);
  });

  // remove o cliente do array quando sai da conversa e da um broadcast informando aos demais
  socket.on("end", function() {
    Clients.splice(Clients.indexOf(socket), 1); // remove do array
    broadcast(socket.name + " > Deixou a conversa.\n", socket);
  });

  // percorre o array de clientes e recebe os parametros que são as mensagens e o cliente. E somente envia a mensagem para o cliente que não é seu rementente
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

// passa a as convigurações para o servidor e o cria
const server = net.createServer(handleConnetion);

// Inicio Da leitura
function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, input => resolve(input));
  });
}

// cria um assincronismo da para a leitura na ordem apresentada dos dados
async function questions() {
  AddressIpServer = await ask("INFORME O IP DE SUA MAQUINA: ");
  AddressPortServer = await ask("INFORME A PORTA: ");
}

// segunda parte das configurações do servidor para que possa receber as mensagens, passando endereço de porta e ip
function set_server(IPServer, PortServer) {
  if (IPServer && PortServer) {
    server.listen(PortServer, IPServer);
    // caso a porta esteja em uso
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

// função assincrona para rodas as funções na ordem desejada.
async function load_server() {
  await questions();
  await set_server(AddressIpServer, AddressPortServer);
}

load_server();
