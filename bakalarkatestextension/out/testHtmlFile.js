"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlIndex = `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Test</title>
  </head>
  <body>
	  <img src="https://i.kym-cdn.com/photos/images/original/002/418/805/8e5.gif" width="500" />

    <h1 id="dataOutput">test</h1>

    <script>
        const dataElement = document.getElementById('dataOutput');

        // Handle the message inside the webview
        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent

            dataElement.textContent = message.messageData;
        });
    </script>
  </body>
  </html>`;
exports.default = htmlIndex;
//# sourceMappingURL=testHtmlFile.js.map