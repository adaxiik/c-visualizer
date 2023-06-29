/*  ENUMS       */
//MemoryTypeEnum
export enum MemoryTypeEnum {
    dynamic = "dynamic",
    static = "static",
    global = "global"
}

//DataTypeEnum
export enum DataTypeEnum {
    int = "int",
    char = "char",
    float = "float",
    bool = "bool"
}

/*  CLASSES     */
//ProgramStack
export class ProgramStack {
    stackFrames: { [id: number] : StackFrame } = {};          //To easily avoid duplicates (differentiate by ID)
    heap: Heap;     //All heap variables / memory
}

//StackFrame
export class StackFrame {
    frameId: number;
    functionName: string;
    functionVariables:  { [id: string] : Variable } = {};
    functionParameters: { [id: string] : Variable } = {};
    isCollapsed: boolean;
}

//Variable
export class Variable {
    variableName: string;
    dataTypeEnum: DataType;
    dataTypeString: string;
    isPointer: boolean;                 //if true, value / valueString is the "id" of the value pointed to / address pointed to
    value: any;                         //TODO: Consider changing to a different type (I'm not yet sure, if there'll be a better type)
    valueString: string;
    valueChanged: boolean;              //To be able to show values that changed compared to last breakpoint (when debugging)
}

//ExpandableVariable
export class ExpandableVariable extends Variable {
    isCollapsed: boolean;
}

//Struct
export class Struct extends ExpandableVariable {
    elements: Variable[];
    memory: Memory;
}

//Array
export class Array extends ExpandableVariable {
    dimensionCount: number;
    isAllocated: boolean;
    arrayPointerAddress: string;
    size: number;                       //If the array is already allocated (if this.isAllocated == true)
    elements: { [index: string] : Variable } = {}; 
    memory: Memory;
}

//DataType
export class DataType {
    dataTypeEnum: DataTypeEnum;
    dataTypeString: string;
}

//HeapVariable
export class HeapVariable {
    variable: Variable; 
    memory: Memory;
}

//Heap
export class Heap {
    heapVariables:  { [id: string] : HeapVariable } = {}; 
}

//Memory
export class Memory {
    isAllocated: boolean;
    size: number;                       //If the memory is already allocated (if this.isAllocated == true)
    memoryType: MemoryTypeEnum;
    pointer: string;                    //Present if the memory is dynamic (if this.memoryType == MemoryTypeEnum.dynamic) - otherwise it probably doesn't have much sense
    memoryElements: { [index: string] : Variable } = {};      //Indexes to be able to track fragmented memory
}