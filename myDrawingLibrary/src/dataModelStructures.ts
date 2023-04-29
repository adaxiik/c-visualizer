/*  ENUMS       */
//myMemoryTypeEnum
export enum myMemoryTypeEnum {
    dynamic = "dynamic",
    static = "static",
    global = "global"
}

//myDataTypeEnum
export enum myDataTypeEnum {
    int = "int",
    char = "char",
    float = "float",
    bool = "bool"
}

/*  CLASSES     */
//ProgramStack
export class myProgramStack {
    stackFrames: { [id: number] : myStackFrame } = {};          //To easily avoid duplicates (differentiate by ID)
}

//StackFrame
export class myStackFrame {
    frameId: number;
    functionName: string;
    functionVariables: { [id: string] : myVariable } = {};      //Using a dictionary for faster usage when searching 
    functionParameters: { [id: string] : myVariable } = {};     //Using a dictionary for faster usage when searching
}

//myArray
export class myArray {
    dataTypeEnum: myDataType;
    dataTypeString: string;
    dimensionCount: number;
    isAllocated: boolean;
    arrayPointerAddress: string;
    size: number;                       //If the array is already allocated (if this.isAllocated == true)
    arrayElements: myVariable[];
}

//myVariable
export class myVariable {
    variableName: string;
    dataTypeEnum: myDataType;
    dataTypeString: string;
    value: any;                         //TODO: Consider changing to a different type (I'm not yet sure, if there'll be a better type)
    valueString: string;
}

//myDataType
export class myDataType {
    dataTypeEnum: myDataTypeEnum;
    dataTypeString: string;
    isPointer: boolean;
}

//myStruct
export class myStruct {
    name: string;
    structElements: myVariable[];
    memory: myMemory;
}

//myMemory
export class myMemory {
    isAllocated: boolean;
    size: number;                       //If the memory is already allocated (if this.isAllocated == true)
    memoryType: myMemoryTypeEnum;
    pointer: string;                    //Present if the memory is dynamic (if this.memoryType == myMemoryTypeEnum.dynamic) - otherwise it probably doesn't have much sense
    memoryElements: myVariable[];       //TODO: Maybe change the implementation of this (it will be difficult to track fragmented memory / memory that isn't completely filled, etc.)
}