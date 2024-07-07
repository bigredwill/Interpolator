const { app, protocol, net } = require("electron");
const path = require("node:path");
const url = require("node:url");

app.whenReady().then(() => {
  protocol.handle("atom", (request) => {
    const filePath = request.url.slice("atom://".length);
    console.log(url.pathToFileURL(path.join(__dirname, filePath)).toString());
    return net.fetch(
      url.pathToFileURL(path.join(__dirname, filePath)).toString()
    );
  });
});
