const { app, protocol, net } = require("electron");
const path = require("node:path");
const url = require("node:url");

protocol.registerSchemesAsPrivileged([
  {
    scheme: "atom",
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      stream: true
    }
  }
]);

app.whenReady().then(() => {
  /**
   * Passthrough to filesystem for using files in electron.
   * Specifically used for images and videos.
   * See README for background.
   */
  protocol.handle("atom", (request) => {
    const filePath = request.url.slice("atom://".length);
    console.log('atom', url.pathToFileURL(filePath).toString());
    return net.fetch(
      url.pathToFileURL(filePath).toString()
    );
  });
});
