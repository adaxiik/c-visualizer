import { fabric } from "fabric";
import { myFabricDrawingModule } from "./fabricDrawingModule";
import * as myDataModelStructures from "./dataModelStructures";

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

function drawStackframesJSON(messageBody: any){
  messageBody.forEach(messageStackframe => {
    console.log("Processing stackframe from a function named: \"" + messageStackframe.name + "\"");

    var tempVar = new myDataModelStructures.myStackFrame();
    tempVar.functionName = messageStackframe.name;
    vscode.postMessage({
      command: "requestStackFrame",
      name: messageStackframe.name
    }); //Posting a message back to the extension

    //tempVar.functionVariables = ;//: myVariable[];      //TODO: Find out how to find that information out (from the JSON)
    //tempVar.functionParameters = ;//: myVariable[];     //TODO: Find out how to find that information out (from the JSON)

    myDrawingModule.drawStackFrame(tempVar);
  });
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
      case 'drawVariables':
        drawVariablesJSON(message.body); //Drawing the full JSON message
        break;
      case 'drawStackFrames':
        drawStackframesJSON(message.body); //Drawing the full JSON message
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
