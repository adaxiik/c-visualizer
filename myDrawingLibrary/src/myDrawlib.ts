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
    //tempVar.dataTypeEnum = ;  //TODO: Delete?
    tempVar.dataTypeString = messageVariable.type;
    //tempVar.value = ; //TODO: Delete?
    tempVar.valueString = messageVariable.value;

    //TODO: Decide correctly to which stackframe to add the variable (then convert stackFrames in programStack to a dictionary as well)
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

    //tempStackFrameVar.functionVariables = new Array<myDataModelStructures.myVariable>();//: myVariable[];      //TODO: Find out how to find that information out (from the JSON)
    //tempStackFrameVar.functionParameters = new Array<myDataModelStructures.myVariable>();//: myVariable[];     //TODO: Find out how to find that information out (from the JSON)

    currentProgramStack.stackFrames[tempStackFrameVar.frameId] = tempStackFrameVar;
  });

  //Drawing the program full stack
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
      case 'drawVariables':
        // TODO: Maybe will be deprecated by the "responseVariables" - consider
        //drawVariablesJSON(message.body); //Drawing the full JSON message
        break;
      case 'drawProgramStack':
        drawProgramStackJSON(message.body); //Drawing the full JSON message
        break;
      case 'responseVariables':
        console.log("Variable message recieved in WebView")
        console.log(message);  //The requested variables
        drawVariablesJSON(message); //Drawing the full JSON message
        break;
      default:
        break;
    }
  }
});
