const dataElement = document.getElementById('dataOutput');
        const canvasElement = document.getElementById('myCanvas');

        //Getting a test message from the external TypeScript
        // Handle the message inside the webview
        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent
            
            if (message.command)
            {
              switch (message.command)
              {
                case 'resetText':
                  dataElement.textContent = "";
                  break;
                default:
                  break;
              }
            }
            else
            {
              dataElement.textContent = dataElement.textContent + message.messageData;
            }
        });

        //Testing the canvas