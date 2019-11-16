const net = require("net");
const readline = require("readline");

const client = new net.Socket();

let user = "";
let Ip = "192.168.10.118";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  // prompt: "You > "
});

//rl.prompt();

if (user === "" || user == null) {
  client.connect(4000, Ip, async () => {
    await console.log("------------Chat--------------");
    await rl.question("Infrome seu nome Usuário:", requestion => {
      user = requestion;
      //client.write("User " + user + " Conectado com Sucesso...");
      //rl.close(); //
    });

    await rl.addListener("line", line => {
      client.write(user + ": " + line);
    });
  });
}

client.on("end", () => {
  console.log("Servidor Desconectou");
  client.close();
});

client.on("error", function(e) {
  if (e.code == "EADDRINUSE") {
    console.log("Tentando conectar, carregando...");
    setTimeout(function() {
      client.connect(4000, Ip);
      //client.close();
    });
  }
});
