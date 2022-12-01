import { myFabricDrawingModule } from "./fabricDrawingModule";
import * as myDataModelStructures from "./dataModelStructures";

console.log("[DEBUG] Initialzing Fabric");
var myDrawingModule = new myFabricDrawingModule('myCanvas');

//Example stackframe
let testStackFrame = new myDataModelStructures.myStackFrame();
testStackFrame.functionName = "TestFunction";
//functionVariables: myVariable[];
testStackFrame.returnAddress = "testReturnAddress";
//functionParameters: myVariable[];

myDrawingModule.drawStackFrame(testStackFrame);