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

function createDataModelVariable(messageVariable: any) : DataModelStructures.Variable | {heapVar: DataModelStructures.HeapVariable, stackVar: DataModelStructures.Variable} | undefined {
  console.log("[DEBUG] Processing variable named: \"" + messageVariable.name + "\"");

  let tempVar;
  const pointerFormatRegex = /^\*[^\d]+[\w\d]*$/;   //"*" symbol, 1 character and then any number of characters or numbers
  const pointerValueRegex = /(0x[0-9a-fA-F]+)\s?/i; //"0x" prefix, and then sequence of (at least one) hexadecimal characters / numbers ended with a space
  const arrayFormatRegex = /^\[?(?:[1-9]\d*|0)]$/;  //"[" symbol, numbers starting 0 (but not in format like "01") and then "]" symbol
  const arrayEndRegex = /\s\[?(?:[1-9]\d*|0)]$/;    //"[" symbol, numbers starting 0 (but not in format like "01") and then "]" symbol

  //If it's an expandable variable (array / struct / pointer) with children
  if(messageVariable.variablesReference != 0 && messageVariable.children != undefined)
  {
    let pointerRegexMatchCount = 0;
    let arrayRegexMatchCount = 0;
    //Checking the child values with regexes
    for(let i = 0; i < messageVariable.children.length; i++)
    {
      if(pointerFormatRegex.test(messageVariable.children[i].name))       //If the child's name format matches that of a pointer
      {
        console.log("[DEBUG] Pointer member found: " + messageVariable.children[i].name);
        pointerRegexMatchCount++;
      }
      else if (arrayFormatRegex.test(messageVariable.children[i].name))   //If the child's name format matches that of an array (static)
      {
        console.log("[DEBUG] Array (static) member found: " + messageVariable.children[i].name);
        arrayRegexMatchCount++;
      }
      else                                                          //If the child's name format matches that of a struct (static)
      {
        console.log("[DEBUG] Struct (static) member found: " + messageVariable.children[i].name);
      }
    }
    //Checking if the variable consists only of values of one type
    if(pointerRegexMatchCount == messageVariable.children.length)       //If the parent variable is of pointer type
    {
      console.log("[DEBUG] Variable " + messageVariable.name + " is of pointer type");
      let addressPointedTo = messageVariable.value.match(pointerValueRegex)[0];
      //Creating the variables DataModel representation
      let stackVariable = new DataModelStructures.Variable();
      stackVariable.isPointer = true;

      stackVariable.variableName = messageVariable.name;
      //tempVar.dataTypeEnum = ;  //Not used
      stackVariable.dataTypeString = messageVariable.type;
      //tempVar.value = ;         //Not used
      stackVariable.valueString = addressPointedTo;
      //tempVar.valueChanged = ;  //TODO: Find a way to find that information out

      //Creating the heap variable
      let tempHeapVariable = new DataModelStructures.Variable();
      tempHeapVariable.variableName = addressPointedTo;
      tempHeapVariable.dataTypeString = messageVariable.type;
      tempHeapVariable.valueString = messageVariable.value; 
      let tempHeapVar = new DataModelStructures.HeapVariable();
      tempHeapVar.variable = tempHeapVariable;

      return {heapVar: tempHeapVar, stackVar: stackVariable};
    }
    else if(arrayRegexMatchCount == messageVariable.children.length)    //If the parent variable is of array (static) type
    {
      console.log("[DEBUG] Variable " + messageVariable.name + " is of array (static) type");
      //Creating the variables DataModel representation
      tempVar = new DataModelStructures.Array();
      tempVar.size = messageVariable.children.length;
      //Adding the children to the elements (to the dictionary)
      for(let j = 0; j < messageVariable.children.length; j++)
      {
        let currentArrayChild = createDataModelVariable(messageVariable.children[j]);

        if(currentArrayChild != undefined)
          tempVar.elements[j] = currentArrayChild;
      }

      tempVar.isCollapsed = true;   //Setting the "isCollapsed" to "true" by default

      tempVar.variableName = messageVariable.name;
      //tempVar.dataTypeEnum = ;  //Not used
      tempVar.dataTypeString = messageVariable.type.replace(arrayEndRegex, "");  //Removing the size suffix (that will be added by the drawing library)
      //tempVar.value = ;         //Not used
      tempVar.valueString = messageVariable.value;  //Not neccessary
      //tempVar.valueChanged = ;  //TODO: Find a way to find that information out
      //TODO: Continue
    }
    else if(pointerRegexMatchCount == 0 && arrayRegexMatchCount == 0)   //If the parent variable is of struct (static) type
    {
      console.log("[DEBUG] Variable " + messageVariable.name + " is of struct (static) type");
      //Creating the variables DataModel representation
      tempVar = new DataModelStructures.Struct();
      tempVar.elements = new Array<DataModelStructures.Variable>();
      //Adding the children to the elements (to the dictionary)
      for(let j = 0; j < messageVariable.children.length; j++)
      {
        let currentArrayChild = createDataModelVariable(messageVariable.children[j]);

        if(currentArrayChild != undefined)
          tempVar.elements.push(currentArrayChild);
      }

      tempVar.isCollapsed = true;   //Setting the "isCollapsed" to "true" by default

      tempVar.variableName = messageVariable.name;
      //tempVar.dataTypeEnum = ;  //Not used
      tempVar.dataTypeString = messageVariable.type;
      //tempVar.value = ;         //Not used
      tempVar.valueString = messageVariable.value;  //TODO: Check how the struct value if formatted (and adjust accordingly - for it to be correctly picked up by the FabricDrawingModule)
      //tempVar.valueChanged = ;  //TODO: Find a way to find that information out
      //TODO: Continue
    }
    else
    {
      console.log("[DEBUG] Error - cannot decide ExpandableVariable type - inconsistent child variables");
      tempVar = undefined;
    }
  }
  else if(messageVariable.variablesReference != 0)  //If it's an expandable value without children
  {
    if(pointerFormatRegex.test(messageVariable.name))         //If the variable is of pointer type
    {
      console.log("[DEBUG] Variable " + messageVariable.name + " is of pointer type (without children)");
      let addressPointedTo = messageVariable.value.match(pointerValueRegex)[0];
      //Creating the variables DataModel representation
      let stackVariable = new DataModelStructures.Variable();
      stackVariable.isPointer = true;

      stackVariable.variableName = messageVariable.name;
      //tempVar.dataTypeEnum = ;  //Not used
      stackVariable.dataTypeString = messageVariable.type;
      //tempVar.value = ;         //Not used
      stackVariable.valueString = addressPointedTo;
      //tempVar.valueChanged = ;  //TODO: Find a way to find that information out

      //Creating the heap variable
      let tempHeapVariable = new DataModelStructures.Variable();
      tempHeapVariable.variableName = addressPointedTo;
      tempHeapVariable.dataTypeString = messageVariable.type;
      tempHeapVariable.valueString = messageVariable.value; 
      let tempHeapVar = new DataModelStructures.HeapVariable();
      tempHeapVar.variable = tempHeapVariable;

      return {heapVar: tempHeapVar, stackVar: stackVariable};
    }
    else if(arrayFormatRegex.test(messageVariable.name))      //If the variable is of array (static) type
    {
      console.log("[DEBUG] Variable " + messageVariable.name + " is of array (static) type (without children)");
      //Creating the variables DataModel representation
      tempVar = new DataModelStructures.Array();
      tempVar.size = 0; //Variable has no children - setting size to 0

      tempVar.isCollapsed = true;   //Setting the "isCollapsed" to "true" by default

      tempVar.variableName = messageVariable.name;
      //tempVar.dataTypeEnum = ;  //Not used
      tempVar.dataTypeString = messageVariable.type.replace(arrayEndRegex, "");  //Removing the size suffix (that will be added by the drawing library)
      //tempVar.value = ;         //Not used
      tempVar.valueString = messageVariable.value;  //Not neccessary
      //tempVar.valueChanged = ;  //TODO: Find a way to find that information out
      //TODO: Continue
    }
    else                                              //If the variable is of struct (static) type
    {
      console.log("[DEBUG] Variable " + messageVariable.name + " is of struct (static) type (without children)");
      //Creating the variables DataModel representation
      tempVar = new DataModelStructures.Struct();
      tempVar.elements = new Array<DataModelStructures.Variable>();

      tempVar.isCollapsed = true;   //Setting the "isCollapsed" to "true" by default

      tempVar.variableName = messageVariable.name;
      //tempVar.dataTypeEnum = ;  //Not used
      tempVar.dataTypeString = messageVariable.type;
      //tempVar.value = ;         //Not used
      tempVar.valueString = messageVariable.value;  //TODO: Check how the struct value if formatted (and adjust accordingly - for it to be correctly picked up by the FabricDrawingModule)
      //tempVar.valueChanged = ;  //TODO: Find a way to find that information out
      //TODO: Continue
    }
  }
  else  //If it's not an expandable variable
  {
    console.log("[DEBUG] Regular variable (atomic) found: " + messageVariable.name);

    tempVar = new DataModelStructures.Variable();

    //Checking if the variable is not an array member
    if(!arrayFormatRegex.test(messageVariable.name))   //If the variable's name format doesn't match that of an array member (static)
    {
      tempVar.variableName = messageVariable.name;
      //tempVar.dataTypeEnum = ;  //Not used
      tempVar.dataTypeString = messageVariable.type;
      //tempVar.value = ;         //Not used
    }
    
    tempVar.valueString = messageVariable.value;
  }

  return tempVar;
}

function variableInParameters(variableToCheck: DataModelStructures.Variable, parameters: Array<{type: string, name: string}>) : boolean {
  //Going through all the parameters
  console.log({message: "[TESTING]", params: parameters, var: variableToCheck});
  for(let i = 0; i < parameters.length; i++)
  {
    //Checking for a match
    if(parameters[i].type == variableToCheck.dataTypeString && parameters[i].name == variableToCheck.variableName)
    {
      console.log("[DEBUG] Variable \"" + variableToCheck.variableName + "\" is a parameter");
      return true;
    }
  }
  return false;
}

function drawVariablesJSON(message: any){
  message.variables.forEach(messageVariable => {
    let dataModelVariable = createDataModelVariable(messageVariable); //Getting the variable's datamodel representation

    //Adding the variable to the correct stackframe (if it was in a valid format)
    if(dataModelVariable != undefined)
    {
      if(dataModelVariable instanceof DataModelStructures.Variable)
      {
        if(variableInParameters(dataModelVariable, message.parameters))
          currentProgramStack.stackFrames[message.id].functionParameters[dataModelVariable.variableName] = dataModelVariable;  //Adding the variable to the stack (as a function parameter)
        else
          currentProgramStack.stackFrames[message.id].functionVariables[dataModelVariable.variableName] = dataModelVariable;  //Adding the variable to the stack (as a function variable)
      }
      else  //If it's instanceof DataModelStructures.HeapVariable and it's stack counterpart (both included in a map)
      {
        if(variableInParameters(dataModelVariable.stackVar, message.parameters))
          currentProgramStack.stackFrames[message.id].functionParameters[dataModelVariable.stackVar.variableName] = dataModelVariable.stackVar; //Adding the variable to the stack (as a function parameter)
        else
          currentProgramStack.stackFrames[message.id].functionVariables[dataModelVariable.stackVar.variableName] = dataModelVariable.stackVar;  //Adding the variable to the stack (as a function variable)

        currentProgramStack.heap.heapVariables[dataModelVariable.heapVar.variable.variableName] = dataModelVariable.heapVar;                    //Adding the variable to the heap
      }
    }
  });

  //Redrawing the canvas
  redrawCanvas();
}

function drawProgramStackJSON(messageBody: any){
  //TODO: Remove - debug
  console.log({message: "[DEBUG] Drawing program stack from message:", body: messageBody});

  //Adding an empty heap (for now)
  currentProgramStack.heap = new DataModelStructures.Heap();
  //Processing all the stackframes
  for(let i = 0; i < messageBody.stackFrames.length; i++)
  {
    let currentStackFrame = messageBody.stackFrames[i];

    console.log("[DEBUG] Processing stackframe from a function named: \"" + currentStackFrame.name + "\" (id: " + currentStackFrame.id + ")");

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
    drawVariablesJSON({id: tempStackFrameVar.frameId, variables: currentStackFrame.variables, parameters: currentStackFrame.parameters});
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
