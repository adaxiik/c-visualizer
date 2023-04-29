import { fabric } from "fabric";
import { myFabricDrawingModule } from "./fabricDrawingModule";
import * as myDataModelStructures from "./dataModelStructures";

function redrawCanvas() {
  //Clearing the canvas
  myDrawingModule.clearCanvas();
  //Drawing the new state of the program
  //... (save the state and draw it again)
}

function drawVariablesJSON(messageBody: any){
  messageBody.forEach(messageVariable => {
    console.log("Processing variable named: \"" + messageVariable.name + "\"");

    var tempVar = new myDataModelStructures.myVariable();
    tempVar.variableName = messageVariable.name;
    //tempVar.dataTypeEnum = ;  //TODO: Delete?
    tempVar.dataTypeString = messageVariable.type;
    //tempVar.value = ; //TODO: Delete?
    tempVar.valueString = messageVariable.value;

    myDrawingModule.drawVariable(tempVar);
  });
}

function drawProgramStackJSON(messageBody: any){
  //Initializing the used program stack variable
  var tempProgramStackVar = new myDataModelStructures.myProgramStack();
  tempProgramStackVar.stackFrames = new Array<myDataModelStructures.myStackFrame>();

  //Processing all the stackframes
  messageBody.forEach(messageStackframe => {
    console.log("Processing stackframe from a function named: \"" + messageStackframe.name + "\"");

    var tempStackFrameVar = new myDataModelStructures.myStackFrame();
    tempStackFrameVar.functionName = messageStackframe.name;
    vscode.postMessage({
      command: "requestStackFrame",
      name: messageStackframe.name
    }); //Posting a message back to the extension

    //tempStackFrameVar.functionVariables = ;//: myVariable[];      //TODO: Find out how to find that information out (from the JSON)
    //tempStackFrameVar.functionParameters = ;//: myVariable[];     //TODO: Find out how to find that information out (from the JSON)

    tempProgramStackVar.stackFrames.push(tempStackFrameVar);
  });

  //Drawing the program full stack
  myDrawingModule.drawProgramStack(tempProgramStackVar);
}


var myDrawingModule = new myFabricDrawingModule('myCanvas');
const vscode = acquireVsCodeApi();  //Getting the VS Code Api (to communicate with the extension)

//Getting a test message from the external TypeScript
// Handle the message inside the webview
window.addEventListener('message', event => {
        
const message = event.data; // The JSON data our extension sent

  if (message.command)
  {
    switch (message.command)
    {
      case 'redrawCanvas':
        
        break;
      case 'drawVariables':
        drawVariablesJSON(message.body); //Drawing the full JSON message
        break;
      case 'drawProgramStack':
        drawProgramStackJSON(message.body); //Drawing the full JSON message
        break;
      case 'responseVariables':
        console.log("Variable message recieved in WebView")
        console.log(message.body);  //The requested variables
        break;
      default:
        break;
    }
  }
});
