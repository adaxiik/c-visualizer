const dataElement = document.getElementById('dataOutput');
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
        var canvas = new fabric.Canvas('myCanvas');
        canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));

        canvas.selectionColor = 'rgba(0,255,0,0.3)';
        canvas.selectionBorderColor = 'red';
        canvas.selectionLineWidth = 5;