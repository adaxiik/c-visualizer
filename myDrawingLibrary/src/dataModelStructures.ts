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
}

//StackFrame
export class StackFrame {
    frameId: number;
    functionName: string;
    functionVariables: { [id: string] : Variable } = {};      //Using a dictionary for faster usage when searching 
    functionParameters: { [id: string] : Variable } = {};     //Using a dictionary for faster usage when searching
    isCollapsed: boolean;
}

//Array
export class Array {
    dataTypeEnum: DataType;
    dataTypeString: string;
    dimensionCount: number;
    isAllocated: boolean;
    arrayPointerAddress: string;
    size: number;                       //If the array is already allocated (if this.isAllocated == true)
    arrayElements: Variable[];
}

//Variable
export class Variable {
    variableName: string;
    dataTypeEnum: DataType;
    dataTypeString: string;
    isPointer: boolean;                 //if true, value / valueString is the "id" of the value pointed to / address pointed to
    value: any;                         //TODO: Consider changing to a different type (I'm not yet sure, if there'll be a better type)
    valueString: string;
}

//DataType
export class DataType {
    dataTypeEnum: DataTypeEnum;
    dataTypeString: string;
}

//Struct
export class Struct {
    name: string;
    structElements: Variable[];
    memory: Memory;
}

//Memory
export class Memory {
    isAllocated: boolean;
    size: number;                       //If the memory is already allocated (if this.isAllocated == true)
    memoryType: MemoryTypeEnum;
    pointer: string;                    //Present if the memory is dynamic (if this.memoryType == MemoryTypeEnum.dynamic) - otherwise it probably doesn't have much sense
    memoryElements: Variable[];       //TODO: Maybe change the implementation of this (it will be difficult to track fragmented memory / memory that isn't completely filled, etc.)
}