import { FabricDrawingModule } from "./fabricDrawingModule";
import * as myDataModelStructures from "./dataModelStructures";

console.log("[DEBUG] Initialzing Fabric");
var myDrawingModule = new FabricDrawingModule('drawLibCanvas');

//Example stackframe 1
let stackFrame1 = new myDataModelStructures.StackFrame();
stackFrame1.frameId = 1;
stackFrame1.functionName = "Function1";
stackFrame1.isCollapsed = false;
//Function variables 1
let stackFrame1Var1 = new myDataModelStructures.Variable();
stackFrame1Var1.variableName = "stackFrame1Var1";
stackFrame1Var1.dataTypeString = "bool";
stackFrame1Var1.valueString = "true";
let stackFrame1Var2 = new myDataModelStructures.Variable();
stackFrame1Var2.variableName = "stackFrame1Var2";
stackFrame1Var2.dataTypeString = "int";
stackFrame1Var2.valueString = "17";
let stackFrame1Var3 = new myDataModelStructures.Variable();
stackFrame1Var3.variableName = "stackFrame1Var3";
stackFrame1Var3.dataTypeString = "float";
stackFrame1Var3.valueString = "3.28";
let stackFrame1PointerVar1 = new myDataModelStructures.Variable();          //Pointer variable
stackFrame1PointerVar1.variableName = "stackFrame1PointerVar1";
stackFrame1PointerVar1.dataTypeString = "int *";
stackFrame1PointerVar1.valueString = "stackFrame1Var2";
stackFrame1PointerVar1.isPointer = true;
let stackFrame1StructVar1 = new myDataModelStructures.Struct();             //Struct variable
stackFrame1StructVar1.variableName = "stackFrame1StructVar1";
stackFrame1StructVar1.elements = new Array<myDataModelStructures.Variable>();
stackFrame1StructVar1.dataTypeString = "struct1";
stackFrame1StructVar1.isCollapsed = true;
let stackFrame1StructMember1 = new myDataModelStructures.Variable();
stackFrame1StructMember1.variableName = "stackFrame1StructMember1";
stackFrame1StructMember1.dataTypeString = "int";
stackFrame1StructMember1.valueString = "26";
let stackFrame1StructMember2 = new myDataModelStructures.Variable();
stackFrame1StructMember2.variableName = "stackFrame1StructMember2";
stackFrame1StructMember2.dataTypeString = "bool";
stackFrame1StructMember2.valueString = "false";
let stackFrame1StructMemberStruct1 = new myDataModelStructures.Struct();    //Member struct variable
stackFrame1StructMemberStruct1.variableName = "stackFrame1StructMemberStruct1";
stackFrame1StructMemberStruct1.elements = new Array<myDataModelStructures.Variable>();
stackFrame1StructMemberStruct1.dataTypeString = "struct2";
stackFrame1StructMemberStruct1.isCollapsed = true;
let stackFrame1StructMember4 = new myDataModelStructures.Variable();
stackFrame1StructMember4.variableName = "stackFrame1StructMember4";
stackFrame1StructMember4.dataTypeString = "int";
stackFrame1StructMember4.valueString = "73";
let stackFrame1StructMember5 = new myDataModelStructures.Variable();
stackFrame1StructMember5.variableName = "stackFrame1StructMember5";
stackFrame1StructMember5.dataTypeString = "int";
stackFrame1StructMember5.valueString = "128";
let stackFrame1StructMemberStruct2 = new myDataModelStructures.Struct();    //Member struct variable
stackFrame1StructMemberStruct2.variableName = "stackFrame1StructMemberStruct2";
stackFrame1StructMemberStruct2.elements = new Array<myDataModelStructures.Variable>();
stackFrame1StructMemberStruct2.dataTypeString = "struct3";
stackFrame1StructMemberStruct2.isCollapsed = true;
let stackFrame1StructMember6 = new myDataModelStructures.Variable();
stackFrame1StructMember6.variableName = "stackFrame1StructMember6";
stackFrame1StructMember6.dataTypeString = "int";
stackFrame1StructMember6.valueString = "423";
stackFrame1StructVar1.elements.push(stackFrame1StructMember1);
stackFrame1StructVar1.elements.push(stackFrame1StructMember2);
stackFrame1StructVar1.elements.push(stackFrame1StructMemberStruct1);
stackFrame1StructVar1.elements.push(stackFrame1StructMemberStruct2);
stackFrame1StructMemberStruct1.elements.push(stackFrame1StructMember4);
stackFrame1StructMemberStruct1.elements.push(stackFrame1StructMember5);
stackFrame1StructMemberStruct2.elements.push(stackFrame1StructMember6);
stackFrame1.functionVariables[stackFrame1Var1.variableName] = stackFrame1Var1;
stackFrame1.functionVariables[stackFrame1Var2.variableName] = stackFrame1Var2;
stackFrame1.functionVariables[stackFrame1Var3.variableName] = stackFrame1Var3;
stackFrame1.functionVariables[stackFrame1StructVar1.variableName] = stackFrame1StructVar1;
stackFrame1.functionVariables[stackFrame1PointerVar1.variableName] = stackFrame1PointerVar1;
//Function parameters 1
let stackFrame1Param1 = new myDataModelStructures.Variable();
stackFrame1Param1.variableName = "stackFrame1Param1";
stackFrame1Param1.dataTypeString = "int";
stackFrame1Param1.valueString = "273";
let stackFrame1Param2 = new myDataModelStructures.Variable();
stackFrame1Param2.variableName = "stackFrame1Param2";
stackFrame1Param2.dataTypeString = "double";
stackFrame1Param2.valueString = "15.893";
stackFrame1.functionParameters[stackFrame1Param1.variableName] = stackFrame1Param1;
stackFrame1.functionParameters[stackFrame1Param2.variableName] = stackFrame1Param2;

//Example stackframe 2
let stackFrame2 = new myDataModelStructures.StackFrame();
stackFrame2.frameId = 2;
stackFrame2.functionName = "Function2";
stackFrame2.isCollapsed = false;
//Function variables 2
let stackFrame2Var1 = new myDataModelStructures.Variable();
stackFrame2Var1.variableName = "stackFrame2Var1";
stackFrame2Var1.dataTypeString = "bool";
stackFrame2Var1.valueString = "true";
let stackFrame2Var2 = new myDataModelStructures.Variable();
stackFrame2Var2.variableName = "stackFrame2Var2";
stackFrame2Var2.dataTypeString = "int";
stackFrame2Var2.valueString = "17";
let stackFrame2Var3 = new myDataModelStructures.Variable();
stackFrame2Var3.variableName = "stackFrame2Var3";
stackFrame2Var3.dataTypeString = "float";
stackFrame2Var3.valueString = "3.28";
let stackFrame2Var4 = new myDataModelStructures.Array();                    //Array variable
stackFrame2Var4.variableName = "stackFrame2Array1";
stackFrame2Var4.dataTypeString = "int";
stackFrame2Var4.isCollapsed = false;    //TODO: Revert to true
stackFrame2Var4.size = 6;
let stackFrame2Var4atIdx0 = new myDataModelStructures.Variable();           //Array element
stackFrame2Var4atIdx0.valueString = "17";
let stackFrame2Var4atIdx1 = new myDataModelStructures.Variable();           //Array element
stackFrame2Var4atIdx1.valueString = "18";
let stackFrame2Var4atIdx2 = new myDataModelStructures.Variable();           //Array element
stackFrame2Var4atIdx2.valueString = "19";
let stackFrame2Var4atIdx4 = new myDataModelStructures.Variable();           //Array element
stackFrame2Var4atIdx4.valueString = "21";
//stackFrame2Var4.elements = new Array<{index: number, element: myDataModelStructures.Variable}>();
stackFrame2Var4.elements[0] = stackFrame2Var4atIdx0;
stackFrame2Var4.elements[1] = stackFrame2Var4atIdx1;
stackFrame2Var4.elements[2] = stackFrame2Var4atIdx2;
stackFrame2Var4.elements[4] = stackFrame2Var4atIdx4;
stackFrame2.functionVariables[stackFrame2Var1.variableName] = stackFrame2Var1;
stackFrame2.functionVariables[stackFrame2Var2.variableName] = stackFrame2Var2;
stackFrame2.functionVariables[stackFrame2Var3.variableName] = stackFrame2Var3;
stackFrame2.functionVariables[stackFrame2Var4.variableName] = stackFrame2Var4;
//Function parameters 2
let stackFrame2Param1 = new myDataModelStructures.Variable();
stackFrame2Param1.variableName = "stackFrame2Param1";
stackFrame2Param1.dataTypeString = "int";
stackFrame2Param1.valueString = "273";
let stackFrame2Param2 = new myDataModelStructures.Variable();
stackFrame2Param2.variableName = "stackFrame2Param2";
stackFrame2Param2.dataTypeString = "double";
stackFrame2Param2.valueString = "15.893";
stackFrame2.functionParameters[stackFrame2Param1.variableName] = stackFrame2Param1;
stackFrame2.functionParameters[stackFrame2Param2.variableName] = stackFrame2Param2;

//Creating the program stack
let programStack = new myDataModelStructures.ProgramStack();
programStack.stackFrames = new Array<myDataModelStructures.StackFrame>();

//Adding the stackframes
programStack.stackFrames[stackFrame1.frameId] = stackFrame1;
programStack.stackFrames[stackFrame2.frameId] = stackFrame2;

//Drawing the program stack
console.log("[DEBUG] Drawing the full program stack");
myDrawingModule.drawProgramStack(programStack);                 //Unlimited in length
//myDrawingModule.drawProgramStack(programStack, 10, 10, 150);    //Limited in length


/*
//ing variables
//Example string
let String = new myDataModelStructures.Variable();
String.variableName = "StringVariable";
String.dataTypeString = "string";
String.valueString = "I am a ing string.";

console.log("[DEBUG] Drawing the ing string");
myDrawingModule.drawVariable(String);

//Example char
let Char = new myDataModelStructures.Variable();
Char.variableName = "CharVariable";
Char.dataTypeString = "char";
Char.valueString = "e";

console.log("[DEBUG] Drawing the ing char");
myDrawingModule.drawVariable(Char);

//Example number (int)
let Int = new myDataModelStructures.Variable();
Int.variableName = "IntVariable";
Int.dataTypeString = "int";
Int.valueString = "846151";

console.log("[DEBUG] Drawing the ing int");
myDrawingModule.drawVariable(Int);

//Example bool
let Bool = new myDataModelStructures.Variable();
Bool.variableName = "BoolVariable";
Bool.dataTypeString = "bool";
Bool.valueString = "1";

console.log("[DEBUG] Drawing the ing bool");
myDrawingModule.drawVariable(Bool);
*/
