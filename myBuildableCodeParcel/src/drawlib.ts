import { fabric } from "fabric";
import { myFabricDrawingModule } from "./fabricDrawingModule";
import * as myDataModelStructures from "./dataModelStructures";

export class myDrawlib {

    testCanvas() {
        const dataElement = document.getElementById('dataOutput');

        //Testing the canvas
        var fabricCanvas = new fabric.Canvas('myCanvas');
        fabricCanvas.add(new fabric.Circle({ radius: 30, fill: '#33ccff', top: 100, left: 100 }));

        fabricCanvas.selectionColor = 'rgba(51, 204, 255, 0.3)';
        fabricCanvas.selectionBorderColor = 'blue';
        fabricCanvas.selectionLineWidth = 1;

        //Getting a test message from the external TypeScript
        // Handle the message inside the webview
        window.addEventListener('message', event => {
        
        const message = event.data; // The JSON data our extension sent

            if (message.command)
            {
              switch (message.command)
              {
                case 'resetText':
                    if(dataElement != null)
                    {
                        dataElement.textContent = "";
                    }
                  break;
                case 'drawCircle':
                    fabricCanvas.add(new fabric.Circle({ radius: 15, fill: '#33ccff', top: Math.random()*100, left: Math.random()*100 })); //Adding the circles randomly within the bounds of the canvas
                    break;
                default:
                  break;
              }
            }
            else
            {
                if(dataElement != null)
                {
                    dataElement.textContent = dataElement.textContent + message.messageData;
                }
            }
        });
    }
}