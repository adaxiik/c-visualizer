import { myFabricDrawingModule } from "./fabricDrawingModule";
import * as myDataModelStructures from "./dataModelStructures";

console.log("[DEBUG] Initialzing Fabric");
var myDrawingModule = new myFabricDrawingModule('myCanvas');

//Example stackframe
let testStackFrame = new myDataModelStructures.myStackFrame();
//Function name
testStackFrame.functionName = "TestFunction";
//Function variables
let testVar1 = new myDataModelStructures.myVariable();
testVar1.variableName = "testVar1";
let testVar2 = new myDataModelStructures.myVariable();
testVar2.variableName = "testVar2";
let testVar3 = new myDataModelStructures.myVariable();
testVar3.variableName = "testVar3";
testStackFrame.functionVariables = new Array<myDataModelStructures.myVariable>();
testStackFrame.functionVariables.push(testVar1);
testStackFrame.functionVariables.push(testVar2);
testStackFrame.functionVariables.push(testVar3);
//Function return address
testStackFrame.returnAddress = "testReturnAddress";
//Function parameters
let testParam1 = new myDataModelStructures.myVariable();
testParam1.variableName = "testParam1";
let testParam2 = new myDataModelStructures.myVariable();
testParam2.variableName = "testParam2";
testStackFrame.functionParameters = new Array<myDataModelStructures.myVariable>();
testStackFrame.functionParameters.push(testParam1);
testStackFrame.functionParameters.push(testParam2);

myDrawingModule.drawStackFrame(testStackFrame);