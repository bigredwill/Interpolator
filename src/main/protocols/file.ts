const { app, protocol, net } = require("electron");
const path = require("node:path");
const url = require("node:url");

app.whenReady().then(() => {
  protocol.handle("atom", (request) => {
    const filePath = request.url.slice("atom://".length);
    return net.fetch(
      url.pathToFileURL(filePath).toString()
    );
  });
});
