import { fabric } from "fabric";
import { FabricDrawingModule } from "./fabricDrawingModule";
import * as DataModelStructures from "./dataModelStructures";

function clearCanvas() {
  //Clearing the canvas
  myDrawingModule.canvas.clearCanvas();
  //Reset the current program stack
  currentProgramStack = new DataModelStructures.ProgramStack();
}

function redrawCanvas() {
  myDrawingModule.canvas.clearCanvas();
  //Drawing the program full stack
  myDrawingModule.drawProgramStack(currentProgramStack);
}

function drawVariablesJSON(message: any){
  message.variables.forEach(messageVariable => {
    console.log("Processing variable named: \"" + messageVariable.name + "\"");

    var tempVar = new DataModelStructures.Variable();
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
  //TODO: Remove - debug
  console.log(messageBody);
  //Adding an empty heap (for now)
  currentProgramStack.heap = new DataModelStructures.Heap();
  //Processing all the stackframes
  for(let i = 0; i < messageBody.stackFrames.length; i++)
  {
    let currentStackFrame = messageBody.stackFrames[i];

    console.log("Processing stackframe from a function named: \"" + currentStackFrame.name + "\" (id: " + currentStackFrame.id + ")");

    var tempStackFrameVar = new DataModelStructures.StackFrame();
    tempStackFrameVar.frameId = currentStackFrame.id;
    tempStackFrameVar.functionName = currentStackFrame.name;
    //TODO: Remove - probably not needed anymore
    /*
    vscode.postMessage({
      command: "requestStackFrame",
      id: currentStackFrame.id
    }); //Posting a message back to the extension
    */
  
    //Adding the stackframe to the program stack
    currentProgramStack.stackFrames[tempStackFrameVar.frameId] = tempStackFrameVar;
      
    //Adding its variables
    drawVariablesJSON({id: tempStackFrameVar.frameId, variables: currentStackFrame.variables});
  }

  //Drawing the full program stack
  myDrawingModule.drawProgramStack(currentProgramStack);
}


var myDrawingModule = new FabricDrawingModule('drawLibCanvas');
const vscode = acquireVsCodeApi();  //Getting the VS Code Api (to communicate with the extension)

var currentProgramStack = new DataModelStructures.ProgramStack();
//currentProgramStack.stackFrames = new Array<DataModelStructures.StackFrame>();
var currentProgramStackMessage = {};

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
      	currentProgramStackMessage = message.body;	//Saving the last recieved program state
        drawProgramStackJSON(message.body); 		//Drawing the full JSON message
        break;
        //TODO: Remove afterwards (if it really wont be used)
        /*
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
        */
      default:
        break;
    }
  }
});
