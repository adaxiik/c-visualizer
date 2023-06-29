import { FabricDrawingModule } from "./fabricDrawingModule";
import * as DataModelStructures from "./dataModelStructures";

console.log("[DEBUG] Initialzing Fabric");
var myDrawingModule = new FabricDrawingModule('drawLibCanvas');

//Example stackframe 1
let stackFrame1 = new DataModelStructures.StackFrame();
stackFrame1.frameId = 1;
stackFrame1.functionName = "Function1";
stackFrame1.isCollapsed = false;
//Function variables 1
let stackFrame1Var1 = new DataModelStructures.Variable();
stackFrame1Var1.variableName = "stackFrame1Var1";
stackFrame1Var1.dataTypeString = "bool";
stackFrame1Var1.valueString = "true";
let stackFrame1Var2 = new DataModelStructures.Variable();
stackFrame1Var2.variableName = "stackFrame1Var2";
stackFrame1Var2.dataTypeString = "int";
stackFrame1Var2.valueString = "17";
stackFrame1Var2.valueChanged = true;
let stackFrame1Var3 = new DataModelStructures.Variable();
stackFrame1Var3.variableName = "stackFrame1Var3";
stackFrame1Var3.dataTypeString = "float";
stackFrame1Var3.valueString = "3.28";

let stackFrame1PointerVar1 = new DataModelStructures.Variable();          //Pointer variable
stackFrame1PointerVar1.variableName = "stackFrame1PointerVar1";
stackFrame1PointerVar1.dataTypeString = "int *";
stackFrame1PointerVar1.valueString = "stackFrame1Var2";
stackFrame1PointerVar1.isPointer = true;

let stackFrame1StructVar1 = new DataModelStructures.Struct();             //Struct variable
stackFrame1StructVar1.variableName = "stackFrame1StructVar1";
stackFrame1StructVar1.elements = new Array<DataModelStructures.Variable>();
stackFrame1StructVar1.dataTypeString = "struct1";
stackFrame1StructVar1.isCollapsed = true;
let stackFrame1StructMember1 = new DataModelStructures.Variable();
stackFrame1StructMember1.variableName = "stackFrame1StructMember1";
stackFrame1StructMember1.dataTypeString = "int";
stackFrame1StructMember1.valueString = "26";
let stackFrame1StructMember2 = new DataModelStructures.Variable();
stackFrame1StructMember2.variableName = "stackFrame1StructMember2";
stackFrame1StructMember2.dataTypeString = "bool";
stackFrame1StructMember2.valueString = "false";
let stackFrame1StructMemberStruct1 = new DataModelStructures.Struct();    //Member struct variable
stackFrame1StructMemberStruct1.variableName = "stackFrame1StructMemberStruct1";
stackFrame1StructMemberStruct1.elements = new Array<DataModelStructures.Variable>();
stackFrame1StructMemberStruct1.dataTypeString = "struct2";
stackFrame1StructMemberStruct1.isCollapsed = true;
let stackFrame1StructMember4 = new DataModelStructures.Variable();
stackFrame1StructMember4.variableName = "stackFrame1StructMember4";
stackFrame1StructMember4.dataTypeString = "int";
stackFrame1StructMember4.valueString = "73";
let stackFrame1StructMember5 = new DataModelStructures.Variable();
stackFrame1StructMember5.variableName = "stackFrame1StructMember5";
stackFrame1StructMember5.dataTypeString = "int";
stackFrame1StructMember5.valueString = "128";
let stackFrame1StructMemberStruct2 = new DataModelStructures.Struct();    //Member struct variable
stackFrame1StructMemberStruct2.variableName = "stackFrame1StructMemberStruct2";
stackFrame1StructMemberStruct2.elements = new Array<DataModelStructures.Variable>();
stackFrame1StructMemberStruct2.dataTypeString = "struct3";
stackFrame1StructMemberStruct2.isCollapsed = true;

let stackFrame1StructMemberArrayAtomic = new DataModelStructures.Array(); //Member array variable (atomic)
stackFrame1StructMemberArrayAtomic.variableName = "stackFrame1StructMemberArrayAtomic";
stackFrame1StructMemberArrayAtomic.dataTypeString = "int";
stackFrame1StructMemberArrayAtomic.isCollapsed = true;
stackFrame1StructMemberArrayAtomic.size = 4;
let stackFrame1StructMemberArrayVarAtIdx0 = new DataModelStructures.Variable();   //Array element
stackFrame1StructMemberArrayVarAtIdx0.valueString = "23";
let stackFrame1StructMemberArrayVarAtIdx1 = new DataModelStructures.Variable();   //Array element
stackFrame1StructMemberArrayVarAtIdx1.valueString = "942";
let stackFrame1StructMemberArrayVarAtIdx2 = new DataModelStructures.Variable();   //Array element
stackFrame1StructMemberArrayVarAtIdx2.valueString = "3";
let stackFrame1StructMemberArrayVarAtIdx3 = new DataModelStructures.Variable();   //Array element
stackFrame1StructMemberArrayVarAtIdx3.valueString = "11";
stackFrame1StructMemberArrayAtomic.elements[0] = stackFrame1StructMemberArrayVarAtIdx0;
stackFrame1StructMemberArrayAtomic.elements[1] = stackFrame1StructMemberArrayVarAtIdx1;
stackFrame1StructMemberArrayAtomic.elements[2] = stackFrame1StructMemberArrayVarAtIdx2;
stackFrame1StructMemberArrayAtomic.elements[3] = stackFrame1StructMemberArrayVarAtIdx3;

let stackFrame1StructMemberArrayExpandable = new DataModelStructures.Array(); //Member array variable (expandable)
stackFrame1StructMemberArrayExpandable.variableName = "stackFrame1StructMemberArrayExpandable";
stackFrame1StructMemberArrayExpandable.dataTypeString = "struct1";
stackFrame1StructMemberArrayExpandable.isCollapsed = true;
stackFrame1StructMemberArrayExpandable.size = 4;
let stackFrame1StructInArray1 = new DataModelStructures.Struct();             //Array element (struct variable)
stackFrame1StructInArray1.variableName = "stackFrame1StructInArray1"; 
stackFrame1StructInArray1.elements = new Array<DataModelStructures.Variable>();
stackFrame1StructInArray1.dataTypeString = "struct1";
stackFrame1StructInArray1.isCollapsed = true;
let stackFrame1StructInArray1Member1 = new DataModelStructures.Variable();
stackFrame1StructInArray1Member1.variableName = "stackFrame1StructInArray1Member1";
stackFrame1StructInArray1Member1.dataTypeString = "int";
stackFrame1StructInArray1Member1.valueString = "499";
let stackFrame1StructInArray1Member2 = new DataModelStructures.Variable();
stackFrame1StructInArray1Member2.variableName = "stackFrame1StructInArray1Member2";
stackFrame1StructInArray1Member2.dataTypeString = "bool";
stackFrame1StructInArray1Member2.valueString = "true";
stackFrame1StructInArray1.elements.push(stackFrame1StructInArray1Member1);
stackFrame1StructInArray1.elements.push(stackFrame1StructInArray1Member2);
let stackFrame1StructInArray2 = new DataModelStructures.Struct();             //Array element (struct variable)
//struct without a variable name (just a basic member of an array)
stackFrame1StructInArray2.elements = new Array<DataModelStructures.Variable>();
stackFrame1StructInArray2.dataTypeString = "struct1";
stackFrame1StructInArray2.isCollapsed = true;
let stackFrame1StructInArray2Member1 = new DataModelStructures.Variable();
stackFrame1StructInArray2Member1.variableName = "stackFrame1StructInArray2Member1";
stackFrame1StructInArray2Member1.dataTypeString = "int";
stackFrame1StructInArray2Member1.valueString = "45630";
let stackFrame1StructInArray2Member2 = new DataModelStructures.Variable();
stackFrame1StructInArray2Member2.variableName = "stackFrame1StructInArray2Member2";
stackFrame1StructInArray2Member2.dataTypeString = "bool";
stackFrame1StructInArray2Member2.valueString = "false";
stackFrame1StructInArray2.elements.push(stackFrame1StructInArray2Member1);
stackFrame1StructInArray2.elements.push(stackFrame1StructInArray2Member2);
stackFrame1StructMemberArrayExpandable.elements[0] = stackFrame1StructInArray1;
stackFrame1StructMemberArrayExpandable.elements[2] = stackFrame1StructInArray2;

let stackFrame1StructMember6 = new DataModelStructures.Variable();
stackFrame1StructMember6.variableName = "stackFrame1StructMember6";
stackFrame1StructMember6.dataTypeString = "int";
stackFrame1StructMember6.valueString = "423";

stackFrame1StructMemberStruct1.elements.push(stackFrame1StructMember4);
stackFrame1StructMemberStruct1.elements.push(stackFrame1StructMember5);
stackFrame1StructMemberStruct2.elements.push(stackFrame1StructMember6);

stackFrame1StructVar1.elements.push(stackFrame1StructMember1);
stackFrame1StructVar1.elements.push(stackFrame1StructMember2);
stackFrame1StructVar1.elements.push(stackFrame1StructMemberStruct1);
stackFrame1StructVar1.elements.push(stackFrame1StructMemberStruct2);
stackFrame1StructVar1.elements.push(stackFrame1StructMemberArrayAtomic);
stackFrame1StructVar1.elements.push(stackFrame1StructMemberArrayExpandable);

stackFrame1.functionVariables[stackFrame1Var1.variableName] = stackFrame1Var1;
stackFrame1.functionVariables[stackFrame1Var2.variableName] = stackFrame1Var2;
stackFrame1.functionVariables[stackFrame1Var3.variableName] = stackFrame1Var3;
stackFrame1.functionVariables[stackFrame1StructVar1.variableName] = stackFrame1StructVar1;
stackFrame1.functionVariables[stackFrame1PointerVar1.variableName] = stackFrame1PointerVar1;
//Function parameters 1
let stackFrame1Param1 = new DataModelStructures.Variable();
stackFrame1Param1.variableName = "stackFrame1Param1";
stackFrame1Param1.dataTypeString = "int";
stackFrame1Param1.valueString = "273";
let stackFrame1Param2 = new DataModelStructures.Variable();
stackFrame1Param2.variableName = "stackFrame1Param2";
stackFrame1Param2.dataTypeString = "double";
stackFrame1Param2.valueString = "15.893";
stackFrame1.functionParameters[stackFrame1Param1.variableName] = stackFrame1Param1;
stackFrame1.functionParameters[stackFrame1Param2.variableName] = stackFrame1Param2;

//Example stackframe 2
let stackFrame2 = new DataModelStructures.StackFrame();
stackFrame2.frameId = 2;
stackFrame2.functionName = "Function2";
stackFrame2.isCollapsed = false;
//Function variables 2
let stackFrame2Var1 = new DataModelStructures.Variable();
stackFrame2Var1.variableName = "stackFrame2Var1";
stackFrame2Var1.dataTypeString = "bool";
stackFrame2Var1.valueString = "true";
let stackFrame2Var2 = new DataModelStructures.Variable();
stackFrame2Var2.variableName = "stackFrame2Var2";
stackFrame2Var2.dataTypeString = "int";
stackFrame2Var2.valueString = "17";
let stackFrame2Var3 = new DataModelStructures.Variable();
stackFrame2Var3.variableName = "stackFrame2Var3";
stackFrame2Var3.dataTypeString = "float";
stackFrame2Var3.valueString = "3.28";
let stackFrame2Var4 = new DataModelStructures.Array();                    //Array variable
stackFrame2Var4.variableName = "stackFrame2Array1";
stackFrame2Var4.dataTypeString = "int";
stackFrame2Var4.isCollapsed = true;
stackFrame2Var4.size = 6;
let stackFrame2Var4atIdx0 = new DataModelStructures.Variable();           //Array element
stackFrame2Var4atIdx0.valueString = "17";
let stackFrame2Var4atIdx1 = new DataModelStructures.Variable();           //Array element
stackFrame2Var4atIdx1.valueString = "18";
let stackFrame2Var4atIdx2 = new DataModelStructures.Variable();           //Array element
stackFrame2Var4atIdx2.valueString = "19";
let stackFrame2Var4atIdx4 = new DataModelStructures.Variable();           //Array element
stackFrame2Var4atIdx4.valueString = "21";
stackFrame2Var4atIdx4.valueChanged = true;
stackFrame2Var4.elements[0] = stackFrame2Var4atIdx0;
stackFrame2Var4.elements[1] = stackFrame2Var4atIdx1;
stackFrame2Var4.elements[2] = stackFrame2Var4atIdx2;
stackFrame2Var4.elements[4] = stackFrame2Var4atIdx4;

let stackFrame2PointerToHeap = new DataModelStructures.Variable();          //Pointer variable (pointing to heap)
stackFrame2PointerToHeap.variableName = "stackFrame2PointerToHeap";
stackFrame2PointerToHeap.dataTypeString = "int *";
stackFrame2PointerToHeap.valueString = "heapVar1";
stackFrame2PointerToHeap.isPointer = true;

stackFrame2.functionVariables[stackFrame2Var1.variableName] = stackFrame2Var1;
stackFrame2.functionVariables[stackFrame2Var2.variableName] = stackFrame2Var2;
stackFrame2.functionVariables[stackFrame2Var3.variableName] = stackFrame2Var3;
stackFrame2.functionVariables[stackFrame2Var4.variableName] = stackFrame2Var4;
stackFrame2.functionVariables[stackFrame2PointerToHeap.variableName] = stackFrame2PointerToHeap;
//Function parameters 2
let stackFrame2Param1 = new DataModelStructures.Variable();
stackFrame2Param1.variableName = "stackFrame2Param1";
stackFrame2Param1.dataTypeString = "int";
stackFrame2Param1.valueString = "273";
let stackFrame2Param2 = new DataModelStructures.Variable();
stackFrame2Param2.variableName = "stackFrame2Param2";
stackFrame2Param2.dataTypeString = "double";
stackFrame2Param2.valueString = "15.893";
stackFrame2.functionParameters[stackFrame2Param1.variableName] = stackFrame2Param1;
stackFrame2.functionParameters[stackFrame2Param2.variableName] = stackFrame2Param2;

//Preparing the heap variables
let heapValueVar1 = new DataModelStructures.Variable();
heapValueVar1.variableName = "heapVar1";
heapValueVar1.dataTypeString = "int";
heapValueVar1.valueString = "113";
let heapVar1 = new DataModelStructures.HeapVariable();
heapVar1.variable = heapValueVar1;
let heapValueVar2 = new DataModelStructures.Variable();
heapValueVar2.variableName = "heapVar2";
heapValueVar2.dataTypeString = "double";
heapValueVar2.valueString = "16.44";
let heapVar2 = new DataModelStructures.HeapVariable();
heapVar2.variable = heapValueVar2;
//Preparing the heap
let heap = new DataModelStructures.Heap();
heap.heapVariables[heapVar1.variable.variableName] = heapVar1;
heap.heapVariables[heapVar2.variable.variableName] = heapVar2;

//Creating the program stack
let programStack = new DataModelStructures.ProgramStack();
programStack.stackFrames = new Array<DataModelStructures.StackFrame>();

//Adding the stackframes
programStack.stackFrames[stackFrame1.frameId] = stackFrame1;
programStack.stackFrames[stackFrame2.frameId] = stackFrame2;
//Adding the heap
programStack.heap = heap;

//Drawing the program stack
console.log("[DEBUG] Drawing the full program stack");
myDrawingModule.drawProgramStack(programStack);                 //Unlimited in length
//myDrawingModule.drawProgramStack(programStack, 10, 10, 150);    //Limited in length


/*
//ing variables
//Example string
let String = new DataModelStructures.Variable();
String.variableName = "StringVariable";
String.dataTypeString = "string";
String.valueString = "I am a ing string.";

console.log("[DEBUG] Drawing the ing string");
myDrawingModule.drawVariable(String);

//Example char
let Char = new DataModelStructures.Variable();
Char.variableName = "CharVariable";
Char.dataTypeString = "char";
Char.valueString = "e";

console.log("[DEBUG] Drawing the ing char");
myDrawingModule.drawVariable(Char);

//Example number (int)
let Int = new DataModelStructures.Variable();
Int.variableName = "IntVariable";
Int.dataTypeString = "int";
Int.valueString = "846151";

console.log("[DEBUG] Drawing the ing int");
myDrawingModule.drawVariable(Int);

//Example bool
let Bool = new DataModelStructures.Variable();
Bool.variableName = "BoolVariable";
Bool.dataTypeString = "bool";
Bool.valueString = "1";

console.log("[DEBUG] Drawing the ing bool");
myDrawingModule.drawVariable(Bool);
*/
