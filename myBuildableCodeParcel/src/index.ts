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
testVar1.dataTypeString = "bool";
testVar1.valueString = "true";
let testVar2 = new myDataModelStructures.myVariable();
testVar2.variableName = "testVar2";
testVar2.dataTypeString = "int";
testVar2.valueString = "17";
let testVar3 = new myDataModelStructures.myVariable();
testVar3.variableName = "testVar3";
testVar3.dataTypeString = "float";
testVar3.valueString = "3.28";
testStackFrame.functionVariables = new Array<myDataModelStructures.myVariable>();
testStackFrame.functionVariables.push(testVar1);
testStackFrame.functionVariables.push(testVar2);
testStackFrame.functionVariables.push(testVar3);
//Function parameters
let testParam1 = new myDataModelStructures.myVariable();
testParam1.variableName = "testParam1";
testParam1.dataTypeString = "int";
testParam1.valueString = "273";
let testParam2 = new myDataModelStructures.myVariable();
testParam2.variableName = "testParam2";
testParam2.dataTypeString = "double";
testParam2.valueString = "15.893";
testStackFrame.functionParameters = new Array<myDataModelStructures.myVariable>();
testStackFrame.functionParameters.push(testParam1);
testStackFrame.functionParameters.push(testParam2);

console.log("[DEBUG] Drawing the testing stackframe");
myDrawingModule.drawStackFrame(testStackFrame);

console.log("[DEBUG] Sample code change to test Docker");