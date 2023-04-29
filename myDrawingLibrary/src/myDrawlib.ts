import { fabric } from "fabric";
import { myFabricDrawingModule } from "./fabricDrawingModule";
import * as myDataModelStructures from "./dataModelStructures";

function clearCanvas() {
  //Clearing the canvas
  myDrawingModule.clearCanvas();
  //Reset the current program stack
  currentProgramStack = new myDataModelStructures.myProgramStack();
}

function redrawCanvas() {
  myDrawingModule.clearCanvas();
  //Drawing the program full stack
  myDrawingModule.drawProgramStack(currentProgramStack);
}

function drawVariablesJSON(message: any){
  message.body.variables.forEach(messageVariable => {
    console.log("Processing variable named: \"" + messageVariable.name + "\"");

    var tempVar = new myDataModelStructures.myVariable();
    tempVar.variableName = messageVariable.name;
    //tempVar.dataTypeEnum = ;  //Not used
    tempVar.dataTypeString = messageVariable.type;
    //tempVar.value = ;         //Not used
    tempVar.valueString = messageVariable.value;

    //Adding the variable to the correct stackframe
    currentProgramStack.stackFrames[message.id].functionVariables[tempVar.variableName] = tempVar;
  });

  //Redrawing the canvas
  redrawCanvas();
}

function drawProgramStackJSON(messageBody: any){
  //Processing all the stackframes
  messageBody.forEach(messageStackframe => {
    console.log("Processing stackframe from a function named: \"" + messageStackframe.name + "\" (id: " + messageStackframe.id + ")");

    var tempStackFrameVar = new myDataModelStructures.myStackFrame();
    tempStackFrameVar.frameId = messageStackframe.id;
    tempStackFrameVar.functionName = messageStackframe.name;
    vscode.postMessage({
      command: "requestStackFrame",
      id: messageStackframe.id
    }); //Posting a message back to the extension

    //Adding the stackframe to the program stack
    currentProgramStack.stackFrames[tempStackFrameVar.frameId] = tempStackFrameVar;
  });

  //Drawing the full program stack
  myDrawingModule.drawProgramStack(currentProgramStack);
}


var myDrawingModule = new myFabricDrawingModule('myCanvas');
const vscode = acquireVsCodeApi();  //Getting the VS Code Api (to communicate with the extension)

var currentProgramStack = new myDataModelStructures.myProgramStack();
currentProgramStack.stackFrames = new Array<myDataModelStructures.myStackFrame>();

//Getting a test message from the external TypeScript
// Handle the message inside the webview
window.addEventListener('message', event => {
        
const message = event.data; // The JSON data our extension sent

  if (message.command)
  {
    switch (message.command)
    {
      case 'clearCanvas':
        clearCanvas();
        break;
      case 'drawProgramStack':
        drawProgramStackJSON(message.body); //Drawing the full JSON message
        break;
      case 'responseVariables':
        console.log("Variable message recieved in WebView")
        //Checking for registers
        let drawVariable = true;
        for (let i = 0; i < message.body.variables.length; i++)
        {
          if(message.body.variables[i].name == "Other Registers") //If register values are present
          {
            console.log("Registers frame detected. Deleting (id: " + message.id + ")");
            //Find the frame in the programStack and delete it
            delete currentProgramStack.stackFrames[message.id];
            drawVariable = false;
            redrawCanvas();
          }
        }
        //If it's not a registers stackframe
        if (drawVariable)
        {
          console.log(message);  //The requested variables
          drawVariablesJSON(message); //Drawing the full JSON message
        }
        break;
      default:
        break;
    }
  }
});
