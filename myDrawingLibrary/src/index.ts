/*
import { myDrawlib } from "./myDrawlib";
export { myDrawlib };
*/
import { myFabricDrawingModule } from "./fabricDrawingModule";
import * as myDataModelStructures from "./dataModelStructures";

console.log("[DEBUG] Initialzing Fabric");
var myDrawingModule = new myFabricDrawingModule('myCanvas');

//Example stackframe 1
let testStackFrame1 = new myDataModelStructures.myStackFrame();
//Function name 1
testStackFrame1.functionName = "TestFunction1";
//Function variables 1
let stackFrame1TestVar1 = new myDataModelStructures.myVariable();
stackFrame1TestVar1.variableName = "stackFrame1TestVar1";
stackFrame1TestVar1.dataTypeString = "bool";
stackFrame1TestVar1.valueString = "true";
let stackFrame1TestVar2 = new myDataModelStructures.myVariable();
stackFrame1TestVar2.variableName = "stackFrame1TestVar2";
stackFrame1TestVar2.dataTypeString = "int";
stackFrame1TestVar2.valueString = "17";
let stackFrame1TestVar3 = new myDataModelStructures.myVariable();
stackFrame1TestVar3.variableName = "stackFrame1TestVar3";
stackFrame1TestVar3.dataTypeString = "float";
stackFrame1TestVar3.valueString = "3.28";
testStackFrame1.functionVariables = new Array<myDataModelStructures.myVariable>();
testStackFrame1.functionVariables.push(stackFrame1TestVar1);
testStackFrame1.functionVariables.push(stackFrame1TestVar2);
testStackFrame1.functionVariables.push(stackFrame1TestVar3);
//Function parameters 1
let stackFrame1TestParam1 = new myDataModelStructures.myVariable();
stackFrame1TestParam1.variableName = "stackFrame1TestParam1";
stackFrame1TestParam1.dataTypeString = "int";
stackFrame1TestParam1.valueString = "273";
let stackFrame1TestParam2 = new myDataModelStructures.myVariable();
stackFrame1TestParam2.variableName = "stackFrame1TestParam2";
stackFrame1TestParam2.dataTypeString = "double";
stackFrame1TestParam2.valueString = "15.893";
testStackFrame1.functionParameters = new Array<myDataModelStructures.myVariable>();
testStackFrame1.functionParameters.push(stackFrame1TestParam1);
testStackFrame1.functionParameters.push(stackFrame1TestParam2);

//Example stackframe 2
let testStackFrame2 = new myDataModelStructures.myStackFrame();
//Function name 2
testStackFrame2.functionName = "TestFunction2";
//Function variables 2
let stackFrame2TestVar1 = new myDataModelStructures.myVariable();
stackFrame2TestVar1.variableName = "stackFrame2TestVar1";
stackFrame2TestVar1.dataTypeString = "bool";
stackFrame2TestVar1.valueString = "true";
let stackFrame2TestVar2 = new myDataModelStructures.myVariable();
stackFrame2TestVar2.variableName = "stackFrame2TestVar2";
stackFrame2TestVar2.dataTypeString = "int";
stackFrame2TestVar2.valueString = "17";
let stackFrame2TestVar3 = new myDataModelStructures.myVariable();
stackFrame2TestVar3.variableName = "stackFrame2TestVar3";
stackFrame2TestVar3.dataTypeString = "float";
stackFrame2TestVar3.valueString = "3.28";
testStackFrame2.functionVariables = new Array<myDataModelStructures.myVariable>();
testStackFrame2.functionVariables.push(stackFrame2TestVar1);
testStackFrame2.functionVariables.push(stackFrame2TestVar2);
testStackFrame2.functionVariables.push(stackFrame2TestVar3);
//Function parameters 2
let stackFrame2TestParam1 = new myDataModelStructures.myVariable();
stackFrame2TestParam1.variableName = "stackFrame2TestParam1";
stackFrame2TestParam1.dataTypeString = "int";
stackFrame2TestParam1.valueString = "273";
let stackFrame2TestParam2 = new myDataModelStructures.myVariable();
stackFrame2TestParam2.variableName = "stackFrame2TestParam2";
stackFrame2TestParam2.dataTypeString = "double";
stackFrame2TestParam2.valueString = "15.893";
testStackFrame2.functionParameters = new Array<myDataModelStructures.myVariable>();
testStackFrame2.functionParameters.push(stackFrame2TestParam1);
testStackFrame2.functionParameters.push(stackFrame2TestParam2);

//Creating the program stack
let testProgramStack = new myDataModelStructures.myProgramStack();
testProgramStack.stackFrames = new Array<myDataModelStructures.myStackFrame>();
testProgramStack.stackFrames.push(testStackFrame1);
testProgramStack.stackFrames.push(testStackFrame2);

console.log("[DEBUG] Drawing the full program stack");
myDrawingModule.drawProgramStack(testProgramStack);

/*
//Testing variables
//Example string
let testString = new myDataModelStructures.myVariable();
testString.variableName = "testStringVariable";
testString.dataTypeString = "string";
testString.valueString = "I am a testing string.";

console.log("[DEBUG] Drawing the testing string");
myDrawingModule.drawVariable(testString);

//Example char
let testChar = new myDataModelStructures.myVariable();
testChar.variableName = "testCharVariable";
testChar.dataTypeString = "char";
testChar.valueString = "e";

console.log("[DEBUG] Drawing the testing char");
myDrawingModule.drawVariable(testChar);

//Example number (int)
let testInt = new myDataModelStructures.myVariable();
testInt.variableName = "testIntVariable";
testInt.dataTypeString = "int";
testInt.valueString = "846151";

console.log("[DEBUG] Drawing the testing int");
myDrawingModule.drawVariable(testInt);

//Example bool
let testBool = new myDataModelStructures.myVariable();
testBool.variableName = "testBoolVariable";
testBool.dataTypeString = "bool";
testBool.valueString = "1";

console.log("[DEBUG] Drawing the testing bool");
myDrawingModule.drawVariable(testBool);
*/
