import { fabric } from "fabric";
import * as DataModelStructures from "./dataModelStructures";

class CustomCanvas extends fabric.Canvas {
    lockAllItems()
    {
        let allFabricItems = this.getObjects();

        allFabricItems.forEach(fabricObject => {
            fabricObject.selectable = false;
            fabricObject.hoverCursor = "default";
            fabricObject.evented = true;
        });
    }

    clearCanvas() {
        console.log("[DEBUG] Clearing the canvas");
        this.clear();
    }
}

//Class for temporary storage of data for the FabricDrawingModule
class FabricDrawingModuleCache {
    objectColor: string;
    pointeeObject: [fabric.Object, string];             //[backgroundRectangleObject, previousColor]
    pointerArrowObject : fabric.Object | undefined;     //Fabric object representing the arrow between variables (presuming there is only one arrow object temporarily present)
    pointers: Array<[any, any]>;                        //in a [pointerVariable, pointingTo] format
    drawProgramStackArguments?: [DataModelStructures.ProgramStack, number, number, number?];

    constructor() {
        this.objectColor = "";
        this.pointeeObject = [new fabric.Object, ""];
        this.pointerArrowObject = undefined;
        this.pointers = new Array<[any, any]>();
        this.drawProgramStackArguments = undefined;
    }
}

//Type containing all DataModel object types
type DataModelObject = DataModelStructures.Array
                    | DataModelStructures.DataType
                    | DataModelStructures.Memory
                    | DataModelStructures.ProgramStack 
                    | DataModelStructures.StackFrame 
                    | DataModelStructures.Struct 
                    | DataModelStructures.Variable;

interface Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelObject;
    fabricObject: fabric.Group; //Maybe "| fabric.Object" can be added - depending on usage
    startPos: {x: number, y: number};
    children: Array<Widget>;
    get width(): number | undefined;
    get height(): number | undefined;

    draw(): void;
}

//Class to limit number of variables needed for the ProgramStackWidget constructor call
class ProgramStackWidgetConfig {
    fabricDrawingModuleCache: FabricDrawingModuleCache;
    maxStackSlotWidth: number | undefined;
}

//Class to limit number of variables needed for the StackframeWidget constructor call
class StackframeWidgetConfig {
    slotWidth: number;
    slotHeight: number;
    textColor: string;
    shortenText: boolean;
}

//Class to limit number of variables needed for the StackframeSlotWidget constructor call
class StackframeSlotWidgetConfig extends StackframeWidgetConfig {
    slotColor: string;          //Specific for a single slot
    textFontSize: number;       //Calculated in a stackframe widget and passed
    textLeftOffset: number;     //Calculated in a stackframe widget and passed
    textRightOffset: number;    //Calculated in a stackframe widget and passed
}

class StringWidget implements Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;

    constructor(variableToDraw: DataModelStructures.Variable, drawToCanvas: CustomCanvas, setStartPosX = 10, setStartPosY = 10) {
        this.canvas = drawToCanvas;
        this.dataModelObject = variableToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
    }

    get width(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].x - coords[1].x);
    }

    get height(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].y - coords[3].y);
    }

    draw()
    {
        //Checking if the variable is really a string
        if (this.dataModelObject.dataTypeString != "string")
            return;

        //Default values
        let textFill = "black";

        //Drawing the slot's text
        let finalString = this.dataModelObject.variableName + " : \"" + this.dataModelObject.valueString + "\"";
        let fabricSlotText = new fabric.Text(finalString, {
            left: this.startPos.x,
            top: this.startPos.y,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        this.fabricObject = new fabric.Group([fabricSlotText]);

        //Adding the result group to the canvas
        this.canvas.add(this.fabricObject);

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

class CharWidget implements Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;

    constructor(variableToDraw: DataModelStructures.Variable, drawToCanvas: CustomCanvas, setStartPosX = 10, setStartPosY = 10) {
        this.canvas = drawToCanvas;
        this.dataModelObject = variableToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
    }

    get width(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].x - coords[1].x);
    }

    get height(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].y - coords[3].y);
    }

    draw() {
        //Checking if the variable is really a char
        if (this.dataModelObject.dataTypeString != "char")
            return;
    
        //Default values
        let textFill = "black";
    
        //Drawing the slot's text
        let finalString = this.dataModelObject.variableName + " : \'" + this.dataModelObject.valueString + "\'";
        let fabricSlotText = new fabric.Text(finalString, {
            left: this.startPos.x,
            top: this.startPos.y,
            fill: textFill,
            fontSize: 20
        });
    
        //Creating the result
        this.fabricObject = new fabric.Group([fabricSlotText]);
    
        //Adding the result group to the canvas
        this.canvas.add(this.fabricObject);
    
        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

class NumberWidget implements Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;

    constructor(variableToDraw: DataModelStructures.Variable, drawToCanvas: CustomCanvas, setStartPosX = 10, setStartPosY = 10) {
        this.canvas = drawToCanvas;
        this.dataModelObject = variableToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
    }

    get width(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].x - coords[1].x);
    }

    get height(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].y - coords[3].y);
    }

    draw() {
        //Checking if the variable is really a number
        if (this.dataModelObject.dataTypeString != "number" &&
            this.dataModelObject.dataTypeString != "int" &&
            this.dataModelObject.dataTypeString != "float")
            return;

        //Default values
        let textFill = "black";

        //Drawing the slot's text
        let finalString = this.dataModelObject.variableName + " : " + this.dataModelObject.valueString;
        let fabricSlotText = new fabric.Text(finalString, {
            left: this.startPos.x,
            top: this.startPos.y,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        this.fabricObject = new fabric.Group([fabricSlotText]);

        //Adding the result group to the canvas
        this.canvas.add(this.fabricObject);

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

class BooleanWidget implements Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;

    constructor(variableToDraw: DataModelStructures.Variable, drawToCanvas: CustomCanvas, setStartPosX = 10, setStartPosY = 10) {
        this.canvas = drawToCanvas;
        this.dataModelObject = variableToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
    }

    get width(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].x - coords[1].x);
    }

    get height(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].y - coords[3].y);
    }

    draw() {
        //Checking if the variable is really a number
        if (this.dataModelObject.dataTypeString != "bool" &&
            this.dataModelObject.dataTypeString != "boolean")
            return;

        //Default values
        let textFill = "black";

        //Drawing the slot's text
        let tempValueString = this.dataModelObject.valueString = "1" ? "true" : "false";
        let finalString = this.dataModelObject.variableName + " : " + tempValueString;
        let fabricSlotText = new fabric.Text(finalString, {
            left: this.startPos.x,
            top: this.startPos.y,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        this.fabricObject = new fabric.Group([fabricSlotText]);

        //Adding the result group to the canvas
        this.canvas.add(this.fabricObject);

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

class StackframeSlotWidget implements Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelStructures.Variable | DataModelStructures.StackFrame;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a stackframe slot widget
    slotConfig: StackframeSlotWidgetConfig;

    constructor(objectToDraw: DataModelStructures.Variable | DataModelStructures.StackFrame, drawToCanvas: CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: StackframeSlotWidgetConfig) {
        this.canvas = drawToCanvas;
        this.dataModelObject = objectToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
        //Added variables specific for a stackframe slot widget
        this.slotConfig = setConfig;
    }

    get width(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].x - coords[1].x);
    }

    get height(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value
 
        return Math.abs(coords[0].y - coords[3].y);
    }

    //Helper function from the program stack widget
    checkMaxArrayMemberTextWidth(arrayToCheck: DataModelStructures.Array) : number {
        let maxTotalArrayMemberTextWidth = 0;
        for (let key in arrayToCheck.elements) {
            let value = arrayToCheck.elements[key];
            
            if (value != null) {
                //"Mock" creating Fabric text (to calculate total width properly)
                let tempFabricSlotText = new fabric.Text(value.valueString, {
                    left: 0,
                    top: 0,
                    fill: "black",
                    fontSize: this.slotConfig.textFontSize
                });

                let textTotalWidth = this.slotConfig.textLeftOffset + tempFabricSlotText.getScaledWidth() + this.slotConfig.textRightOffset; 
    
                //Comparing the current variable text's length to the maximum 
                maxTotalArrayMemberTextWidth = textTotalWidth > maxTotalArrayMemberTextWidth ? textTotalWidth : maxTotalArrayMemberTextWidth;
            }
        }

        return maxTotalArrayMemberTextWidth;
    }

    draw() {
        let startingSlotHeight = this.slotConfig.slotHeight;
        let tempSlotHeight = startingSlotHeight;
        let slotStrokeWidth = this.slotConfig.textFontSize / 10;

        function checkForUncollapsedStructsOrArrays(variableToCheck: DataModelStructures.Variable) {
            if(variableToCheck instanceof DataModelStructures.Struct && !variableToCheck.isCollapsed)
            {
                tempSlotHeight += startingSlotHeight * (variableToCheck.elements.length + 1); //for the variable itself + (elements.length for elements + 1 for extra space for padding)
                for(let i = 0; i < variableToCheck.elements.length; i++)
                {
                    let currentElement = variableToCheck.elements[i];
                    if((currentElement instanceof DataModelStructures.Struct || currentElement instanceof DataModelStructures.Array) && !variableToCheck.isCollapsed)
                        checkForUncollapsedStructsOrArrays(currentElement);
                }
            }
            if(variableToCheck instanceof DataModelStructures.Array && !variableToCheck.isCollapsed)
            {
                tempSlotHeight += 2 * startingSlotHeight;  //+1 for elements + 1 for extra space for padding
                for(let i = 0; i < variableToCheck.size; i++)
                {
                    let currentElement = variableToCheck.elements[i];
                    if(currentElement != undefined && (currentElement instanceof DataModelStructures.Struct || currentElement instanceof DataModelStructures.Array) && !variableToCheck.isCollapsed)
                        checkForUncollapsedStructsOrArrays(currentElement);
                }
            }
        }

        //Checking for uncollapsed structs / arrays (and then increasing the total slot height)
        if(this.dataModelObject instanceof DataModelStructures.Variable)
            checkForUncollapsedStructsOrArrays(this.dataModelObject);

        //Drawing the slot's background
        let fabricSlotBackground = new fabric.Rect({
            left: this.startPos.x,
            top: this.startPos.y,
            width: this.slotConfig.slotWidth,
            height: tempSlotHeight,
            fill: this.slotConfig.slotColor,

            //Default values
            padding: this.slotConfig.textFontSize / 2.5,
            stroke: "#000000",
            strokeWidth: slotStrokeWidth
        });
        //Drawing the slot's text
        let slotText = "";
        if(this.dataModelObject instanceof DataModelStructures.StackFrame)
        {
            slotText = this.dataModelObject.functionName;
        }
        else if (this.dataModelObject instanceof DataModelStructures.Struct)
        {
            slotText = this.dataModelObject.variableName + ": " + this.dataModelObject.dataTypeString + " (...)";                                   //Custom value text for struct variables
        }
        else if (this.dataModelObject instanceof DataModelStructures.Array)
        {
            slotText = this.dataModelObject.variableName + ": " + this.dataModelObject.dataTypeString + " [" + this.dataModelObject.size + "]";     //Custom value text for array variables
        }
        else
        {
            slotText = this.dataModelObject.variableName + ": " + this.dataModelObject.dataTypeString + " (" + this.dataModelObject.valueString + ")";
        }
        let fabricSlotText = new fabric.Text(slotText, {
            left: this.startPos.x + this.slotConfig.textLeftOffset,
            top: this.startPos.y - 2 + (this.slotConfig.slotHeight - this.slotConfig.textFontSize) / 2,
            fill: this.slotConfig.textColor,
            fontSize: this.slotConfig.textFontSize
        });

        if (this.slotConfig.shortenText) {
            //Checking if the text is longer than maximum
            let maxTextLength = this.slotConfig.slotWidth - this.slotConfig.textLeftOffset - this.slotConfig.textRightOffset;
            if(fabricSlotText.getScaledWidth() > maxTextLength) {
                //Calculating how much to shorten the text
                let averageCharLength = fabricSlotText.getScaledWidth() / slotText.length;
                let overflowInWidth = fabricSlotText.getScaledWidth() - maxTextLength;
                let overflowInChars = overflowInWidth / averageCharLength + 2;  //+2 to account for the space of "..."
                let newSlotText = slotText.substring(0, slotText.length - 1 - overflowInChars) + "...";

                //Making a shortened version of the text
                fabricSlotText = new fabric.Text(newSlotText, {
                    left: this.startPos.x + this.slotConfig.textLeftOffset,
                    top: this.startPos.y - 2 + (this.slotConfig.slotHeight - this.slotConfig.textFontSize) / 2,
                    fill: this.slotConfig.textColor,
                    fontSize: this.slotConfig.textFontSize
                });
            }
        }

        //Creating the result
        this.fabricObject = new fabric.Group([fabricSlotBackground, fabricSlotText]);

        //Adding the group to the canvas
        this.canvas.add(this.fabricObject);

        //Adding the elements (in case of a struct)
        if(this.dataModelObject instanceof DataModelStructures.Struct && !this.dataModelObject.isCollapsed)
        {
            //Creating the config for the elements
            let elementsConfig = new StackframeSlotWidgetConfig();
            elementsConfig.slotWidth = this.slotConfig.slotWidth - this.slotConfig.slotHeight;  //1/2 of slotHeight sized padding on the left, 1/2 of slotHeight sizedPadding on the right
            elementsConfig.slotHeight = this.slotConfig.slotHeight;
            elementsConfig.textColor = this.slotConfig.textColor;
            elementsConfig.shortenText = this.slotConfig.shortenText;
            elementsConfig.slotColor = this.slotConfig.slotColor;
            elementsConfig.textFontSize = this.slotConfig.textFontSize;
            elementsConfig.textLeftOffset = this.slotConfig.textLeftOffset;
            elementsConfig.textRightOffset = this.slotConfig.textRightOffset;
            //Drawing the elements
            let tempStartPosX = this.startPos.x + this.slotConfig.slotHeight/2;
            let tempStartPosY = this.startPos.y + this.slotConfig.slotHeight + this.dataModelObject.elements.length * slotStrokeWidth;  //Accounting for the parent variable + all element slot's stroke widths
            //Drawing the elements themselves
            for(let i = 0; i < this.dataModelObject.elements.length; i++)
            {
                let currentChild = new StackframeSlotWidget(this.dataModelObject.elements[i], 
                                                            this.canvas,
                                                            tempStartPosX,
                                                            tempStartPosY,
                                                            elementsConfig);
                this.children.push(currentChild);
                currentChild.draw();
                //Adjusting the starting position for the next element
                let childHeight = currentChild.height;
                tempStartPosY += childHeight == undefined ? 0 : childHeight - slotStrokeWidth;  
            }
        }
        //Adding the elements (in case of an array)
        else if(this.dataModelObject instanceof DataModelStructures.Array && !this.dataModelObject.isCollapsed)
        {
            //Creating the config for the elements
            let elementsConfig = new StackframeSlotWidgetConfig();
            elementsConfig.slotWidth = this.checkMaxArrayMemberTextWidth(this.dataModelObject);
            elementsConfig.slotHeight = this.slotConfig.slotHeight;
            elementsConfig.textColor = this.slotConfig.textColor;
            elementsConfig.shortenText = this.slotConfig.shortenText;
            elementsConfig.slotColor = this.slotConfig.slotColor;
            elementsConfig.textFontSize = this.slotConfig.textFontSize;
            elementsConfig.textLeftOffset = this.slotConfig.textLeftOffset;
            elementsConfig.textRightOffset = this.slotConfig.textRightOffset;
            //Drawing the elements
            let tempStartPosX = this.startPos.x + this.slotConfig.slotHeight/2;
            let tempStartPosY = this.startPos.y + this.slotConfig.slotHeight + this.dataModelObject.size * slotStrokeWidth;  //Accounting for the parent variable + all element slot's stroke widths
            //Drawing the elements themselves
            let emptyVariable = new DataModelStructures.Variable();     //To signify an empty space in an array
            emptyVariable.valueString = "";
            for(let i = 0; i < this.dataModelObject.size; i++)
            {
                let currentChild;
                //If the current index is populated
                if(this.dataModelObject.elements[i] != undefined)
                {
                    currentChild = new ArrayVariableWidget(this.dataModelObject.elements[i], 
                                                            this.canvas,
                                                            tempStartPosX,
                                                            tempStartPosY,
                                                            elementsConfig);
                }
                else
                {
                    currentChild = new ArrayVariableWidget(emptyVariable, 
                                                            this.canvas,
                                                            tempStartPosX,
                                                            tempStartPosY,
                                                            elementsConfig);
                }
                this.children.push(currentChild);
                currentChild.draw();
                //Adjusting the starting position for the next element
                tempStartPosX += elementsConfig.slotWidth;
            }
        }

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

class ArrayVariableWidget implements Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a stackframe slot widget
    slotConfig: StackframeSlotWidgetConfig;

    constructor(objectToDraw: DataModelStructures.Variable, drawToCanvas: CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: StackframeSlotWidgetConfig) {
        this.canvas = drawToCanvas;
        this.dataModelObject = objectToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
        //Added variables specific for a stackframe slot widget
        this.slotConfig = setConfig;
    }

    get width(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].x - coords[1].x);
    }

    get height(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value
 
        return Math.abs(coords[0].y - coords[3].y);
    }

    draw() {
        let startingSlotHeight = this.slotConfig.slotHeight;
        let tempSlotHeight = startingSlotHeight;
        let slotStrokeWidth = this.slotConfig.textFontSize / 10;

        //Drawing the slot's background
        let fabricSlotBackground = new fabric.Rect({
            left: this.startPos.x,
            top: this.startPos.y,
            width: this.slotConfig.slotWidth,
            height: tempSlotHeight,
            fill: this.slotConfig.slotColor,

            //Default values
            padding: this.slotConfig.textFontSize / 2.5,
            stroke: "#000000",
            strokeWidth: slotStrokeWidth
        });
        //Drawing the slot's text
        let slotText = this.dataModelObject.valueString;    //Custom value for array elements

        let fabricSlotText = new fabric.Text(slotText, {
            left: this.startPos.x + this.slotConfig.textLeftOffset,
            top: this.startPos.y - 2 + (this.slotConfig.slotHeight - this.slotConfig.textFontSize) / 2,
            fill: this.slotConfig.textColor,
            fontSize: this.slotConfig.textFontSize
        });

        if (this.slotConfig.shortenText) {
            //Checking if the text is longer than maximum
            let maxTextLength = this.slotConfig.slotWidth - this.slotConfig.textLeftOffset - this.slotConfig.textRightOffset;
            if(fabricSlotText.getScaledWidth() > maxTextLength) {
                //Calculating how much to shorten the text
                let averageCharLength = fabricSlotText.getScaledWidth() / slotText.length;
                let overflowInWidth = fabricSlotText.getScaledWidth() - maxTextLength;
                let overflowInChars = overflowInWidth / averageCharLength + 2;  //+2 to account for the space of "..."
                let newSlotText = slotText.substring(0, slotText.length - 1 - overflowInChars) + "...";

                //Making a shortened version of the text
                fabricSlotText = new fabric.Text(newSlotText, {
                    left: this.startPos.x + this.slotConfig.textLeftOffset,
                    top: this.startPos.y - 2 + (this.slotConfig.slotHeight - this.slotConfig.textFontSize) / 2,
                    fill: this.slotConfig.textColor,
                    fontSize: this.slotConfig.textFontSize
                });
            }
        }

        //Creating the result
        this.fabricObject = new fabric.Group([fabricSlotBackground, fabricSlotText]);

        //Adding the group to the canvas
        this.canvas.add(this.fabricObject);

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

class StackframeWidget implements Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelStructures.StackFrame;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a stackframe widget
    stackframeConfig: StackframeWidgetConfig;

    constructor(stackFrameToDraw: DataModelStructures.StackFrame, drawToCanvas: CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: StackframeWidgetConfig) {
        this.canvas = drawToCanvas;
        this.dataModelObject = stackFrameToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
        //Added variables specific for a stackframe widget
        this.stackframeConfig = setConfig;
    }

    get width(): number | undefined {
        let minX, maxX;
        if(this.children.length >= 1)
        {
            let firstChildsCoords = this.children[0].fabricObject.getCoords(true);   //Getting the object's coordinates in absolute value 
            minX = Math.min(firstChildsCoords[0].x, firstChildsCoords[1].x, firstChildsCoords[2].x, firstChildsCoords[3].x);
            maxX = Math.max(firstChildsCoords[0].x, firstChildsCoords[1].x, firstChildsCoords[2].x, firstChildsCoords[3].x);
        }
        else
        {
            return undefined;
        }

        //Checking the other child object for lower / higher values
        for(let i = 1; i < this.children.length; i++)
        {
            let currentChildsCoords = this.children[i].fabricObject.getCoords(true);   //Getting the object's coordinates in absolute value 
            //Calculating the child's min / max values
            let currentMinX = Math.min(currentChildsCoords[0].x, currentChildsCoords[1].x, currentChildsCoords[2].x, currentChildsCoords[3].x);
            let currentMaxX = Math.max(currentChildsCoords[0].x, currentChildsCoords[1].x, currentChildsCoords[2].x, currentChildsCoords[3].x);
            //Comparing those values
            minX = currentMinX < minX ? currentMinX : minX;
            maxX = currentMaxX > maxX ? currentMaxX : maxX;
        }

        return Math.abs(maxX - minX);
    }

    get height(): number | undefined {
        let minY, maxY;
        if(this.children.length >= 1)
        {
            let firstChildsCoords = this.children[0].fabricObject.getCoords(true);   //Getting the object's coordinates in absolute value 
            minY = Math.min(firstChildsCoords[0].y, firstChildsCoords[1].y, firstChildsCoords[2].y, firstChildsCoords[3].y);
            maxY = Math.max(firstChildsCoords[0].y, firstChildsCoords[1].y, firstChildsCoords[2].y, firstChildsCoords[3].y);
        }
        else
        {
            return undefined;
        }

        //Checking the other child object for lower / higher values
        for(let i = 1; i < this.children.length; i++)
        {
            let currentChildsCoords = this.children[i].fabricObject.getCoords(true);   //Getting the object's coordinates in absolute value 
            //Calculating the child's min / max values
            let currentMinY = Math.min(currentChildsCoords[0].y, currentChildsCoords[1].y, currentChildsCoords[2].y, currentChildsCoords[3].y);
            let currentMaxY = Math.max(currentChildsCoords[0].y, currentChildsCoords[1].y, currentChildsCoords[2].y, currentChildsCoords[3].y);
            //Comparing those values
            minY = currentMinY < minY ? currentMinY : minY;
            maxY = currentMaxY > maxY ? currentMaxY : maxY;
        }

        return Math.abs(maxY - minY);
    }

    draw() {
        //Default values
        let backgroundColorBlue = '#33ccff';
        let backgroundColorGrey = '#8f8f8f';
        let backgroundColorGreen = '#00ff04';
        let tempStartPosX = this.startPos.x;
        let tempStartPosY = this.startPos.y;
        //Note: Text and frame rectangle variables are dynamically adjusted by the stackSlotHeight variable
        let textFontSize = this.stackframeConfig.slotHeight - this.stackframeConfig.slotHeight / 3;
        let textLeftOffset = textFontSize / 5;
        let textRightOffset = textLeftOffset * 2;
        let backgroundStrokeWidth = textFontSize / 10;

        //To prepare the slot's shared config
        function createSlotConfig(setSlotColor: string, stackframeConfig: StackframeWidgetConfig) : StackframeSlotWidgetConfig{
            let retSlotConfig = new StackframeSlotWidgetConfig();
            retSlotConfig.slotWidth = stackframeConfig.slotWidth;
            retSlotConfig.slotHeight = stackframeConfig.slotHeight;
            retSlotConfig.slotColor = setSlotColor;
            retSlotConfig.textColor = stackframeConfig.textColor;
            retSlotConfig.textFontSize = textFontSize;
            retSlotConfig.textLeftOffset = textLeftOffset;
            retSlotConfig.textRightOffset = textRightOffset;
            retSlotConfig.shortenText = stackframeConfig.shortenText;
            return retSlotConfig;
        }

        //Function name
        let headerStackSlotConfig = createSlotConfig(backgroundColorBlue, this.stackframeConfig);
        this.children.push(new StackframeSlotWidget(this.dataModelObject, this.canvas, tempStartPosX, tempStartPosY, headerStackSlotConfig));
        this.children[this.children.length-1].draw();                                                       //Drawing the slot (to have it's height data available)
        let currentChildHeight = this.children[this.children.length-1].height;                              //Getting the height of the current child
        tempStartPosY += currentChildHeight == undefined ? 0 : currentChildHeight - backgroundStrokeWidth;  //Accounting for the stroke width
        //Function variables
        if (this.dataModelObject.functionVariables != null && !this.dataModelObject.isCollapsed)
        {
            for (let key in this.dataModelObject.functionVariables) {
                let value = this.dataModelObject.functionVariables[key];
                
                if (value != null) {
                    let stackSlotConfig = createSlotConfig(backgroundColorGrey, this.stackframeConfig);
                    this.children.push(new StackframeSlotWidget(value, this.canvas, tempStartPosX, tempStartPosY, stackSlotConfig));
                    this.children[this.children.length-1].draw();                                                       //Drawing the slot (to have it's height data available)
                    currentChildHeight = this.children[this.children.length-1].height;                                  //Getting the height of the current child
                    tempStartPosY += currentChildHeight == undefined ? 0 : currentChildHeight - backgroundStrokeWidth;  //Accounting for the stroke width
                }
            }
        }
        //Function parameters
        if (this.dataModelObject.functionParameters != null && !this.dataModelObject.isCollapsed)
        {
            for (let key in this.dataModelObject.functionParameters) {
                let value = this.dataModelObject.functionParameters[key];
                
                if (value != null) {
                    let stackSlotConfig = createSlotConfig(backgroundColorGreen, this.stackframeConfig);
                    this.children.push(new StackframeSlotWidget(value, this.canvas, tempStartPosX, tempStartPosY, stackSlotConfig));
                    this.children[this.children.length-1].draw();                                                       //Drawing the slot (to have it's height data available)
                    currentChildHeight = this.children[this.children.length-1].height;                                  //Getting the height of the current child
                    tempStartPosY += currentChildHeight == undefined ? 0 : currentChildHeight - backgroundStrokeWidth;  //Accounting for the stroke width
                }
            }
        }

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

class ProgramStackWidget implements Widget {
    canvas: CustomCanvas;
    dataModelObject: DataModelStructures.ProgramStack;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a program stack widget
    programStackConfig: ProgramStackWidgetConfig;

    constructor(programStackToDraw: DataModelStructures.ProgramStack, drawToCanvas: CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: ProgramStackWidgetConfig) {
        this.canvas = drawToCanvas;
        this.dataModelObject = programStackToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
        //Added variables specific for a program stack widget
        this.programStackConfig = setConfig;
    }

    get width(): number | undefined {
        if(this.children.length < 1)
        {
            return undefined;
        }

        //Finding the widest stackframe (due to the stackframes having the same starting X position)
        let maxWidth = 0;
        for(let i = 0; i < this.children.length; i++)
        {
            let currentChildsWidth = this.children[i].width;
            if(currentChildsWidth != undefined)
                maxWidth = Math.max(currentChildsWidth, maxWidth);
        }

        return maxWidth;
    }

    get height(): number | undefined {
        if(this.children.length < 1)
        {
            return undefined;
        }

        let heightSum = 0;
        for(let i = 0; i < this.children.length; i++)
        {
            let currentChild = this.children[i];
            if(currentChild instanceof StackframeWidget)
            {
                let currentChildsHeight = currentChild.height;
                if(currentChildsHeight != undefined) 
                    heightSum += currentChildsHeight;   //Adding the stackframe's height

                //In case there are more than 1 stackframe, accounting for the rectangle stroke width
                if(i > 1)
                {
                    let currentChildsFirstSlot = currentChild.children[0];
                    if(currentChildsFirstSlot instanceof StackframeSlotWidget)
                        heightSum -= currentChildsFirstSlot.slotConfig.textFontSize / 10;
                }
            }
        }

        return heightSum;
    }

    draw() {
        let shortenText = false;
        let stackSlotHeight = 30;
        let textColor = "black";
        let textFontSize = stackSlotHeight - stackSlotHeight / 3;
        let textLeftOffset = textFontSize / 5;
        let textRightOffset = textLeftOffset * 2;
        let structLeftOffset = stackSlotHeight/2;   //X offset of the struct's children (compared to the variable 1 level up)
        let calculatedMaxTextWidth = this.calculateMaxTextWidth(textFontSize, textLeftOffset, textRightOffset, structLeftOffset);
        let tempStartPosX = this.startPos.x;
        let tempStartPosY = this.startPos.y;

        //Saving the now drawn program stack state (and the arguments of the last call)
        this.programStackConfig.fabricDrawingModuleCache.drawProgramStackArguments = [this.dataModelObject, this.startPos.x, this.startPos.y, this.programStackConfig.maxStackSlotWidth];

        //Caching the pointers in the program stack
        this.checkForPointers();
        
        //If maximum stack slot width is set
        if (this.programStackConfig.maxStackSlotWidth != undefined) {
            //Checking if we'll need to shorten the variable text (if all variable texts are shorter than the desired stackSlotWidth)
            shortenText = this.programStackConfig.maxStackSlotWidth < calculatedMaxTextWidth;
        }

        //To prepare the slot's shared config
        function createConfig(programStackConfig: ProgramStackWidgetConfig) : StackframeWidgetConfig{
            let retSlotConfig = new StackframeWidgetConfig();
            if(shortenText && programStackConfig.maxStackSlotWidth != undefined)
                retSlotConfig.slotWidth = programStackConfig.maxStackSlotWidth;
            else
                retSlotConfig.slotWidth = calculatedMaxTextWidth + textRightOffset;
            retSlotConfig.slotHeight = stackSlotHeight;
            retSlotConfig.textColor = textColor;
            retSlotConfig.shortenText = shortenText;
            return retSlotConfig;
        }
        
        //Drawing all the stackframes present
        for (let key in this.dataModelObject.stackFrames) {
            let value = this.dataModelObject.stackFrames[key];
            
            if (value != null) {
                let stackConfig = createConfig(this.programStackConfig);
                let stackframeWidget = new StackframeWidget(value, this.canvas, tempStartPosX, tempStartPosY, stackConfig);
                this.children.push(stackframeWidget);       //Adding the stackframe to the children array
                stackframeWidget.draw();                    //Drawing the stackframe
                if(stackframeWidget.height != undefined)
                {
                    tempStartPosY += stackframeWidget.height;   //Chaging the starting position with each drawn stackframe
                    if(stackframeWidget.children[0] instanceof StackframeSlotWidget)
                    {
                        tempStartPosY -= stackframeWidget.children[0].slotConfig.textFontSize / 10;     //Accounting for the rectangle stroke width
                    }
                } 
            }
        }
    }

    //Helper function used to calculate max text width in a provided program stack (used to determine neccessary slot width)
    calculateMaxTextWidth(textFontSize: number, textLeftOffset: number, textRightOffset: number, structLeftOffset: number) : number {
        let maxTotalTextWidth = 0;
        let allVariableTexts = new Array<{variableText: string, level: number, arrayElementXOffset: number}>();

        function checkMaxArrayMemberTextWidth(arrayToCheck: DataModelStructures.Array) : number {
            let maxTotalArrayMemberTextWidth = 0;
            for (let key in arrayToCheck.elements) {
                let value = arrayToCheck.elements[key];
                
                if (value != null) {
                    //"Mock" creating Fabric text (to calculate total width properly)
                    let tempFabricSlotText = new fabric.Text(value.valueString, {
                        left: 0,
                        top: 0,
                        fill: "black",
                        fontSize: textFontSize
                    });

                    let textTotalWidth = textLeftOffset + tempFabricSlotText.getScaledWidth() + textRightOffset; 
        
                    //Comparing the current variable text's length to the maximum 
                    maxTotalArrayMemberTextWidth = textTotalWidth > maxTotalArrayMemberTextWidth ? textTotalWidth : maxTotalArrayMemberTextWidth;
                }
            }
    
            return maxTotalArrayMemberTextWidth;
        }

        function checkVariableText(variableToCheck: DataModelStructures.Variable, currentLevel = 0) {
            if(variableToCheck instanceof DataModelStructures.Struct)
            {
                let currentVariableText = variableToCheck.variableName + ": " + variableToCheck.dataTypeString + " (...)";
                allVariableTexts.push({variableText: currentVariableText, level: currentLevel, arrayElementXOffset: 0});

                //If uncollapsed, going through it's members 
                if(!variableToCheck.isCollapsed)
                {
                    for(let i = 0; i < variableToCheck.elements.length; i++)
                    {
                        let currentElement = variableToCheck.elements[i];
                        checkVariableText(currentElement, currentLevel + 1);
                    }
                }
            }
            else if(variableToCheck instanceof DataModelStructures.Array)
            {
                let currentVariableText = variableToCheck.variableName + ": " + variableToCheck.dataTypeString + " [" + variableToCheck.size + "]";
                allVariableTexts.push({variableText: currentVariableText, level: currentLevel, arrayElementXOffset: 0});

                //If uncollapsed, going through it's members 
                if(!variableToCheck.isCollapsed)
                {
                    let maxElementWidth = checkMaxArrayMemberTextWidth(variableToCheck);

                    for (let i = 0; i < variableToCheck.size; i++)
                    {
                        currentVariableText = "";
                        allVariableTexts.push({variableText: currentVariableText, level: currentLevel, arrayElementXOffset: maxElementWidth * (i+1)});  //empty string ("") and "i+1" and  due to the array's slots being longer than their text (to end with the next slot)
                    }
                }
            }
            else
            {
                let currentMemberVariableText = variableToCheck.variableName + ": " + variableToCheck.dataTypeString + " (" + variableToCheck.valueString + ")";
                allVariableTexts.push({variableText: currentMemberVariableText, level: currentLevel, arrayElementXOffset: 0});
            }
        }
        
        //Going through all stackframes present (and noting their parameter's and variable's text)
        for (let stackFrameKey in this.dataModelObject.stackFrames) {
            let currentStackFrame = this.dataModelObject.stackFrames[stackFrameKey];
            
            if (currentStackFrame != null) {
                //Going through function parameters
                for (let functionParameterKey in currentStackFrame.functionParameters) {
                    let currentFunctionParameter = currentStackFrame.functionParameters[functionParameterKey];
                    if (currentFunctionParameter != null) {
                        checkVariableText(currentFunctionParameter, 0);
                    }
                }

                //Going through function variables
                for (let functionVariableKey in currentStackFrame.functionVariables) {
                    let currentFunctionVariable = currentStackFrame.functionVariables[functionVariableKey];
                    if (currentFunctionVariable != null) {
                        checkVariableText(currentFunctionVariable, 0);
                    }
                }
            }
        }

        //For all variables found
        for (let i = 0; i < allVariableTexts.length; i++) {
            //"Mock" creating Fabric text (to calculate total width properly)
            let tempFabricSlotText = new fabric.Text(allVariableTexts[i].variableText, {
                left: 0,
                top: 0,
                fill: "black",
                fontSize: textFontSize
            });

            let textTotalXOffset = textLeftOffset + allVariableTexts[i].level * (textLeftOffset + structLeftOffset) + allVariableTexts[i].arrayElementXOffset;
            let textTotalWidth = textTotalXOffset + tempFabricSlotText.getScaledWidth() + textRightOffset; 

            //Comparing the current variable text's length to the maximum 
            maxTotalTextWidth = textTotalWidth > maxTotalTextWidth ? textTotalWidth : maxTotalTextWidth;
        }

        return maxTotalTextWidth;
    }

    //Helper function checking for pointer variables in a provided program stack (assigns values to the this.cache.pointers in a [pointerVariable, pointingTo] format)
    checkForPointers() {
        this.programStackConfig.fabricDrawingModuleCache.pointers.splice(0, this.programStackConfig.fabricDrawingModuleCache.pointers.length);  //Emptying the array

        //Going through all stackframes present (and noting their parameter's and variable's text)
        for (let stackFrameKey in this.dataModelObject.stackFrames) {
            let currentStackFrame = this.dataModelObject.stackFrames[stackFrameKey];
            
            if (currentStackFrame != null) {
                //Going through function parameters
                for (let functionParameterKey in currentStackFrame.functionParameters) {
                    let currentFunctionParameter = currentStackFrame.functionParameters[functionParameterKey];
                    if (currentFunctionParameter != null) {
                        if (currentFunctionParameter.isPointer == true) {
                            //Check the value pointed to
                            let valuePointedTo;
                            if(currentFunctionParameter.value != null) {
                                valuePointedTo = currentFunctionParameter.value;
                            }
                            else {
                                valuePointedTo = currentFunctionParameter.valueString;
                            }

                            this.programStackConfig.fabricDrawingModuleCache.pointers.push([currentFunctionParameter.variableName, valuePointedTo]);
                        }
                    }
                }

                //Going through function variables
                for (let functionVariableKey in currentStackFrame.functionVariables) {
                    let currentFunctionVariable = currentStackFrame.functionVariables[functionVariableKey];
                    if (currentFunctionVariable != null) {
                        if (currentFunctionVariable.isPointer == true) {
                            //Check the value pointed to
                            let valuePointedTo;
                            if(currentFunctionVariable.value != null) {
                                valuePointedTo = currentFunctionVariable.value;
                            }
                            else {
                                valuePointedTo = currentFunctionVariable.valueString;
                            }

                            this.programStackConfig.fabricDrawingModuleCache.pointers.push([currentFunctionVariable.variableName, valuePointedTo]);
                        }
                    }
                }
            }
        }
    }
}

export class FabricDrawingModule {
    canvas: CustomCanvas;
    cache: FabricDrawingModuleCache;

    constructor(canvasName: string) {
        this.canvas = new CustomCanvas(canvasName);
        //To have it a bit larger (not yet exact sizing)
        //TODO: Think the sizing through and adjust accordingly
        this.canvas.setWidth(screen.width);
        this.canvas.setHeight(screen.height);
        this.cache = new FabricDrawingModuleCache();
        
        this.initPanning();
        this.initZooming();
        this.initHoverOver();
    }

    initPanning() {
        let drawingModuleThis = this;

        this.canvas.on('mouse:down', function (opt) {
            //Checking if the desired action was just to click (and not drag)
            if(opt.target !== undefined && opt.target !== null)
            {
                //If we clicked on an object (stackframe slot)
                if(opt.target instanceof fabric.Group)
                {
                    let hoveredOverObjectText;
                    if(opt.target._objects[1] instanceof fabric.Text)
                        hoveredOverObjectText = opt.target._objects[1].text;
                    
                    let foundMatch = drawingModuleThis.findDataModelObjectByText(hoveredOverObjectText);
                    if(foundMatch != undefined && ( foundMatch instanceof DataModelStructures.StackFrame ||
                                                    foundMatch instanceof DataModelStructures.Struct ||
                                                    foundMatch instanceof DataModelStructures.Array))
                    {
                        foundMatch.isCollapsed = !foundMatch.isCollapsed;

                        //Redraw the canvas
                        if (drawingModuleThis.cache.drawProgramStackArguments != undefined && drawingModuleThis.cache.drawProgramStackArguments != null)
                        {
                            drawingModuleThis.canvas.clearCanvas();
                            drawingModuleThis.drawProgramStack(...drawingModuleThis.cache.drawProgramStackArguments);
                        }
                    }
                    //Preventing the mouse going to selection mode and returning (to skip the dragging logic)
                    this.selection = false;
                    return;
                }
            }

            //Author: Unknown (Fabric.js)
            //Date: 15.10.2022
            //Availability: http://fabricjs.com/fabric-intro-part-5
            //Citation start
            //Handling the dragging behavior
            var evt = opt.e;

            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        });
        this.canvas.on('mouse:move', function (opt) {
            if (this.isDragging) {
                var e = opt.e;
                var vpt = this.viewportTransform;
                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                this.requestRenderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
            }
        });
        this.canvas.on('mouse:up', function (opt) {
            // on mouse up we want to recalculate new interaction
            // for all objects, so we call setViewportTransform
            this.setViewportTransform(this.viewportTransform);
            this.isDragging = false;
        });
        //Citation end
    }

    initZooming() {
        //Author: Unknown (Fabric.js)
        //Date: 15.10.2022
        //Availability: http://fabricjs.com/fabric-intro-part-5
        //Citation start
        this.canvas.on('mouse:wheel', function (opt) {
            var delta = opt.e.deltaY;
            var zoom = this.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            this.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
        //Citation end
    }

    initHoverOver() {
        const requestRenderAll = this.canvas.requestRenderAll.bind(this.canvas);
        const calculateNewHex = this.calculateLighterDarkerHex;
        const markPointee = this.markPointee.bind(this);
        let drawingModuleThis = this;

        this.canvas.on('mouse:over', function(opt) {
            console.log("[DEBUG] mouse:over event - target: " + opt.target);
            if(!this.isDragging)
            {
                if(opt.target !== undefined && opt.target !== null)
                {
                    if(opt.target instanceof fabric.Group)
                    {
                        //Changing the color of the variable (over which we're hovering)
                        let previousObjectColor = opt.target._objects[0].get('fill')?.toString();
                        if (previousObjectColor != undefined)
                            drawingModuleThis.setObjectColor(opt.target, calculateNewHex(previousObjectColor, -20), true, false);
                        else
                            console.log("[DEBUG] Error - previousObjectColor was undefined");
    
                        //Checking if the hovered over variable is a pointer
                        if(drawingModuleThis.cache.pointers != undefined)
                        {
                            for (let i = 0; i < drawingModuleThis.cache.pointers.length; i++)
                            {
                                if("text" in opt.target._objects[1])
                                {
                                    let hoveredOverVariableText;
                                    if(opt.target._objects[1] instanceof fabric.Text)
                                        hoveredOverVariableText = opt.target._objects[1].text;
                                    let searchedForText = drawingModuleThis.cache.pointers[i][0] + ":";
        
                                    console.log("[DEBUG] Hovering over: \"" + hoveredOverVariableText + "\", searching for: \"" + searchedForText + "\"");
                                    //If the hovered over variable is of pointer type
                                    if (hoveredOverVariableText.includes(searchedForText)) {
                                        markPointee(drawingModuleThis.cache.pointers[i][1]);
                                        
                                        let fromVariableObject = drawingModuleThis.findFabricObjectByText(hoveredOverVariableText);
                                        let toVariableObject = drawingModuleThis.findFabricObjectByText(drawingModuleThis.cache.pointers[i][1]);
                                        if (fromVariableObject == undefined || toVariableObject == undefined)
                                            console.log("[DEBUG] Error - FROM variable or TO variable are undefined");
                                        else
                                            drawingModuleThis.drawArrowBetweenVariables(fromVariableObject, toVariableObject);
                                    }
                                }
                            }
                        }
                        requestRenderAll();
                    }
                }
            }
        });
        
        this.canvas.on('mouse:out', function(opt) {
            console.log("[DEBUG] mouse:out event - target: " + opt.target);
            if(!this.isDragging)
            {
                if(opt.target !== undefined && opt.target !== null)
                {
                    if(opt.target instanceof fabric.Group)
                    {
                        drawingModuleThis.setObjectColor(opt.target, drawingModuleThis.cache.objectColor, false, true);
    
                        //Resetting the state of the pointee variable (if changed)
                        if (drawingModuleThis.cache.pointeeObject[1] !== "")
                        {
                            //Resetting the pointee's previous color
                            drawingModuleThis.cache.pointeeObject[0].set("fill", drawingModuleThis.cache.pointeeObject[1]);
                            //Clearing the cached pointee
                            drawingModuleThis.cache.pointeeObject[0] = new fabric.Object();
                            drawingModuleThis.cache.pointeeObject[1] = "";

                            //Deleting the arrow object from canvas (if present)
                            if(drawingModuleThis.cache.pointerArrowObject != undefined)
                            {
                                drawingModuleThis.canvas.remove(drawingModuleThis.cache.pointerArrowObject);
                                drawingModuleThis.cache.pointerArrowObject = undefined;
                            }
                        }
                        requestRenderAll();
                    }
                }
            }
        });
    }

    //Helper function to return the object with the searched for text
    findFabricObjectByText(searchedForText : string) : fabric.Object | undefined {
        let allCanvasObjects = this.canvas.getObjects();
        for (let i = 0; i < allCanvasObjects.length; i++)
        {
            let currentObject = allCanvasObjects[i];
            //If the canvas object is a group
            if(currentObject instanceof fabric.Group)
            {
                if(currentObject._objects[1] instanceof fabric.Text)
                {
                    console.log("[DEBUG] Testing if \"" + currentObject._objects[1].text + "\" matches \"" + searchedForText + "\"");
                    //If the text object's text matches the searched for value
                    if (currentObject._objects[1].text != undefined && currentObject._objects[1].text.includes(searchedForText))
                    {
                        console.log("[DEBUG] Text match found!");
                        return currentObject;
                    }
                    else
                    {
                        console.log("[DEBUG] Error - currentObject._objects[1].text was undefined");
                    }
                }
                else
                {
                    console.log("[DEBUG] Error - currentObject doesn't contain text (not at the [1] position)");
                }
            }
        }
        console.log("[DEBUG] Text match not found!");
        return undefined;
    }

    //Helper function to return the object with the searched for text
    findDataModelObjectByText(searchedForText : string) : DataModelObject | undefined {
        let mainProgramStack;
        let shortenedText = searchedForText.endsWith("...");
        if(shortenedText)
        {
            searchedForText = searchedForText.slice(0,searchedForText.length-3);    //Omitting the "..." sequence
        }

        if(this.cache.drawProgramStackArguments == undefined)
        {
            console.log("[DEBUG] Cached ProgramStack is undefined!");
            return undefined;
        }
        else
        {
            mainProgramStack = this.cache.drawProgramStackArguments[0];
        }

        if(!(mainProgramStack instanceof DataModelStructures.ProgramStack))
        {
            console.log("[DEBUG] Cached ProgramStack is not an instance of DataModelStructures.ProgramStack!");
            return undefined;
        }
        else
        {
            function checkVariableForText(variableToCheck: DataModelStructures.Variable) : DataModelStructures.Variable | undefined {
                let stackFrameStringRepresentation = variableToCheck.variableName + ": " + variableToCheck.dataTypeString + " (" + variableToCheck.valueString + ")";
                console.log("[DEBUG] Checking variable \"" + variableToCheck.variableName + "\" for text \"" + searchedForText + "\"");
                if(shortenedText)
                {
                    if(variableToCheck.variableName.includes(searchedForText) || stackFrameStringRepresentation.includes(searchedForText))
                    {
                        return variableToCheck;
                    }
                }
                else
                {
                    if(variableToCheck.variableName == searchedForText || stackFrameStringRepresentation == searchedForText)
                    {
                        return variableToCheck;
                    }
                }
                //Structs and arrays
                if(variableToCheck instanceof DataModelStructures.Struct || variableToCheck instanceof DataModelStructures.Array)
                {
                    return checkStructArrayForText(variableToCheck);
                }
                return undefined;
            }
            function checkStructArrayForText(variableToCheck: DataModelStructures.Struct | DataModelStructures.Array) : DataModelStructures.Variable | undefined {
                let stackFrameStringRepresentation;
                if(variableToCheck instanceof DataModelStructures.Struct)
                    stackFrameStringRepresentation = variableToCheck.variableName + ": " + variableToCheck.dataTypeString + " (...)";
                else if (variableToCheck instanceof DataModelStructures.Array)
                    stackFrameStringRepresentation = variableToCheck.variableName + ": " + variableToCheck.dataTypeString + " [" + variableToCheck.size + "]";
                
                if(shortenedText)
                {
                    if(variableToCheck.variableName.includes(searchedForText) || stackFrameStringRepresentation.includes(searchedForText))
                    {
                        return variableToCheck;
                    }
                }
                else
                {
                    if(variableToCheck.variableName == searchedForText || stackFrameStringRepresentation == searchedForText)
                    {
                        return variableToCheck;
                    }
                }
                //Elements of structs and arrays
                if(variableToCheck instanceof DataModelStructures.Struct) {
                    for(let i = 0; i < variableToCheck.elements.length; i++)
                    {
                        let currentElement = variableToCheck.elements[i];
                        let foundMatch = checkVariableForText(currentElement);
                        if(foundMatch != undefined)
                            return foundMatch;
                    }
                }
                else if (variableToCheck instanceof DataModelStructures.Array)
                {
                    for(let key in variableToCheck.elements)
                    {
                        let currentElement = variableToCheck.elements[key];
                        let foundMatch = checkVariableForText(currentElement);
                        if(foundMatch != undefined)
                            return foundMatch;
                    }
                }

               
                return undefined;
            }

            //Going through the stackframes
            for (let key in mainProgramStack.stackFrames)
            {
                let currentStackFrame = mainProgramStack.stackFrames[key];
                if (currentStackFrame != null)
                {
                    let currentStackFrame = mainProgramStack.stackFrames[key];
                    //Checking the function stackframe for a match
                    if(currentStackFrame.functionName == searchedForText)   
                    {
                        return currentStackFrame;
                    }
                    //Function parameters
                    for (let key in currentStackFrame.functionParameters)
                    {
                        let currentFunctionParameter = currentStackFrame.functionParameters[key];
                        if (currentFunctionParameter != null)
                        {
                            let foundMatch = checkVariableForText(currentFunctionParameter);
                            if(foundMatch != undefined)
                            {
                                return foundMatch;
                            }
                        }
                    }
                    //Function variables
                    for (let key in currentStackFrame.functionVariables)
                    {
                        let currentFunctionVariable = currentStackFrame.functionVariables[key];
                        if (currentFunctionVariable != null)
                        {
                            let foundMatch = checkVariableForText(currentFunctionVariable);
                            if(foundMatch != undefined)
                            {
                                return foundMatch;
                            }
                        }
                    }
                }
            }
        }
        console.log("[DEBUG] Text match not found!");
        return undefined;
    }

    //Helper function to change a color of an object (stack slot) - after the change, there must be a call to "requestRenderAll()" afterwards
    setObjectColor(affectedObject : fabric.Object, newObjectColor : string, savePreviousColor : boolean, clearColorCache : boolean) {
        if(affectedObject !== undefined && affectedObject !== null)
        {
            if(affectedObject instanceof fabric.Group)
            {
                if(newObjectColor != "")
                {
                    if(savePreviousColor && clearColorCache)
                    {
                        console.log("[DEBUG] Error - tried to save previous color and clear cache at the same time");
                    }
                    else if(savePreviousColor)
                    {
                        let previousObjectColor = affectedObject._objects[0].get("fill")?.toString(); 
                        if(previousObjectColor != undefined)
                            this.cache.objectColor = previousObjectColor;
                    }
                    else if(clearColorCache)
                    {
                        this.cache.objectColor = "";
                    }

                    if(affectedObject._objects[1] instanceof fabric.Text)
                        console.log("[DEBUG] Setting \"" + affectedObject._objects[1].text + "\" to color \"" + newObjectColor + "\"");
                    else
                        console.log("[DEBUG] Error - affectedObject doesn't contain text (not at the [1] position)");
                    
                    affectedObject._objects[0].set('fill', newObjectColor);
                }
                else
                {
                    if(affectedObject._objects[1] instanceof fabric.Text)
                        console.log("[DEBUG] Error - tried to set \"" + affectedObject._objects[1].text + "to empty color");
                    else
                        console.log("[DEBUG] Error - affectedObject doesn't contain text (not at the [1] position)");
                }
            }
        }
    }

    //Helper function (for mouse:over events, etc.)
    calculateLighterDarkerHex(inputHex : string, percentage : number) : string {
        //Parsing the rbg values
        const r = parseInt(inputHex.substring(1, 3), 16);
        const g = parseInt(inputHex.substring(3, 5), 16);
        const b = parseInt(inputHex.substring(5, 7), 16);

        //Helper function to keep values between bounds
        function clamp(value: number, min: number, max: number): number {
            return Math.min(Math.max(value, min), max);
        }
        
        const clampedPercentage = clamp(percentage, -100, 100);         //Percentage by which to lighten / darken the color
        const offset = Math.round((clampedPercentage / 100) * 255);     //Calculated offset which will be added

        const newR = clamp(r + offset, 0, 255);
        const newG = clamp(g + offset, 0, 255);
        const newB = clamp(b + offset, 0, 255);
        
        //Helper function to convert decimal values back to a two-digit hex
        function toTwoDigitHex(value: number): string {
            const hex = value.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        }

        return "#" + toTwoDigitHex(newR) + toTwoDigitHex(newG) + toTwoDigitHex(newB);
    }

    //Helper function to mark the pointee variable (with a different color)
    markPointee(variableId : string) {
        let searchedForText = variableId + ":";
        let searchedForVariableObject = this.findFabricObjectByText(searchedForText);
                
        if (searchedForVariableObject instanceof fabric.Group)
        {
            console.log("[DEBUG] Pointee found!")

            //Saving the previous state of the pointee
            this.cache.pointeeObject[0] = searchedForVariableObject._objects[0];
            let previousColor = searchedForVariableObject._objects[0].get("fill")?.toString();
            if (previousColor != undefined)
                this.cache.pointeeObject[1] = previousColor;  
            else
                console.log("[DEBUG] Error - previous pointee color is undefined");
            //Changing the pointee's color
            searchedForVariableObject._objects[0].set("fill", "red");
        }
    }

    //Helper function to draw an arrow between two slots (used for pointers) - arrowOffset changes how far the arrow stretches sideways
    drawArrowBetweenVariables(fromVariableObject : fabric.Object, toVariableObject : fabric.Object, arrowOffset = 1) {
        let arrowColor = "black";
        let arrowEndTriangleWidth = 10;
        let arrowEndTriangleHeight = 15;

        if(fromVariableObject instanceof fabric.Group && toVariableObject instanceof fabric.Group)
        {
            if (fromVariableObject._objects[1] instanceof fabric.Text && toVariableObject._objects[1] instanceof fabric.Text)
                console.log("[DEBUG] Drawing an arrow between \"" + fromVariableObject._objects[1].text + "\" and \"" + toVariableObject._objects[1].text);
            else
                console.log("[DEBUG] Error - fromVariableObject or toVariableObject doesn't contain text (not at the [1] position)");
            let fromVariableObjectPosition = fromVariableObject.getCoords(true);    //Neccessary to get the absolute coordinates
            let toVariableObjectPosition = toVariableObject.getCoords(true);        //Neccessary to get the absolute coordinates
            let fromVarRightMiddlePoint =   [fromVariableObjectPosition[1].x,   fromVariableObjectPosition[1].y + (fromVariableObjectPosition[2].y  - fromVariableObjectPosition[1].y)  / 2];
            let toVarRightMiddlePoint =     [toVariableObjectPosition[1].x,     toVariableObjectPosition[1].y   + (toVariableObjectPosition[2].y    - toVariableObjectPosition[1].y)    / 2];

            //Drawing an arrow from the variable objects right X and middle points (Y)
            let lineStart = new fabric.Line([fromVarRightMiddlePoint[0] + arrowOffset * 50 + 1, fromVarRightMiddlePoint[1], fromVarRightMiddlePoint[0], fromVarRightMiddlePoint[1]], {
                stroke: arrowColor
            });

            let lineMiddle = new fabric.Line([fromVarRightMiddlePoint[0] + arrowOffset * 50, fromVarRightMiddlePoint[1], toVarRightMiddlePoint[0] + arrowOffset * 50, toVarRightMiddlePoint[1]], {
                stroke: arrowColor
            });
            
            let lineEnd = new fabric.Line([toVarRightMiddlePoint[0] + arrowOffset * 50, toVarRightMiddlePoint[1], toVarRightMiddlePoint[0] + arrowEndTriangleWidth, toVarRightMiddlePoint[1]], {
                stroke: arrowColor
            });


            let endTriangle = new fabric.Triangle({
                width: arrowEndTriangleWidth, 
                height: arrowEndTriangleHeight, 
                fill: arrowColor, 
                left: toVarRightMiddlePoint[0], 
                top: toVarRightMiddlePoint[1] + arrowEndTriangleHeight / 2 - 1,
                angle: 270
            });

            let arrowObjectGroup = new fabric.Group([lineStart, lineMiddle, lineEnd, endTriangle]);
            this.cache.pointerArrowObject = arrowObjectGroup;   //Saving the reference (for later deletion - presuming the arrow object is just one)
            this.canvas.add(arrowObjectGroup);
        }
        else
        {
            console.log("[DEBUG] FROM or TO variable object doesn't have an \"_objects\" property");
        }

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }

    drawProgramStack(programStackToDraw: DataModelStructures.ProgramStack, startPosX = 10, startPosY = 10, maxStackSlotWidth? : number) {
        let programStackConfig = new ProgramStackWidgetConfig();
        programStackConfig.fabricDrawingModuleCache = this.cache;
        programStackConfig.maxStackSlotWidth = maxStackSlotWidth;

        let programStackWidget = new ProgramStackWidget(programStackToDraw, this.canvas, startPosX, startPosY, programStackConfig);
        programStackWidget.draw();
    }

    //More general method that prevents the user from misusing the drawing methods
    drawVariable(variableToDraw: DataModelStructures.Variable, startPosX?: number, startPosY?: number) {
        if (variableToDraw.dataTypeString == "string")
            new StringWidget(variableToDraw, this.canvas, startPosX, startPosY).draw();
        else if (variableToDraw.dataTypeString == "char")
            new CharWidget(variableToDraw, this.canvas, startPosX, startPosY).draw();
        else if (variableToDraw.dataTypeString == "number" ||
            variableToDraw.dataTypeString == "int" ||
            variableToDraw.dataTypeString == "float")
            new NumberWidget(variableToDraw, this.canvas, startPosX, startPosY).draw();
        else if (variableToDraw.dataTypeString == "bool" ||
            variableToDraw.dataTypeString == "boolean")
            new BooleanWidget(variableToDraw, this.canvas, startPosX, startPosY).draw();
        else
            return;
    }
}
