import { fabric } from "fabric";
import * as DataModelStructures from "./dataModelStructures";
import * as FabricDrawingModule from "./fabricDrawingModule";

export interface Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.DataModelObject;
    fabricObject: fabric.Group; //Maybe "| fabric.Object" can be added - depending on usage
    startPos: {x: number, y: number};
    children: Array<Widget>;
    get width(): number | undefined;
    get height(): number | undefined;

    draw(): void;
}

//Class to limit number of variables needed for the ProgramStackWidget constructor call
export class ProgramStackWidgetConfig {
    fabricDrawingModuleCache: FabricDrawingModule.FabricDrawingModuleCache;
    maxStackSlotWidth: number | undefined;
}

//Class to limit number of variables needed for the StackframeWidget constructor call
export class StackframeWidgetConfig {
    slotWidth: number;
    slotHeight: number;
    textColor: string;
    shortenText: boolean;
}

//Class to limit number of variables needed for the HeapWidget constructor call
export class HeapWidgetConfig extends StackframeWidgetConfig {
    isShown: boolean;
}

//Class to limit number of variables needed for the StackframeSlotWidget constructor call
export class StackframeSlotWidgetConfig extends StackframeWidgetConfig {
    slotColor: string;          //Specific for a single slot
    textFontSize: number;       //Calculated in a stackframe widget and passed
    textLeftOffset: number;     //Calculated in a stackframe widget and passed
    textRightOffset: number;    //Calculated in a stackframe widget and passed
}

export class StringWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;

    constructor(variableToDraw: DataModelStructures.Variable, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10) {
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

export class CharWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;

    constructor(variableToDraw: DataModelStructures.Variable, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10) {
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

export class NumberWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;

    constructor(variableToDraw: DataModelStructures.Variable, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10) {
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

export class BooleanWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;

    constructor(variableToDraw: DataModelStructures.Variable, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10) {
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

export class StackframeSlotWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.Variable | DataModelStructures.StackFrame | DataModelStructures.HeapVariable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a stackframe slot widget
    slotConfig: StackframeSlotWidgetConfig;
    slotStrokeWidth: number;

    constructor(objectToDraw: DataModelStructures.Variable | DataModelStructures.StackFrame | DataModelStructures.HeapVariable, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: StackframeSlotWidgetConfig) {
        this.canvas = drawToCanvas;
        this.dataModelObject = objectToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
        //Added variables specific for a stackframe slot widget
        this.slotConfig = setConfig;
        this.slotStrokeWidth = this.slotConfig.textFontSize / 10;
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

    drawStructVertical(structToDraw: DataModelStructures.Struct) {
        console.log("[DEBUG] Drawing the struct \"" + structToDraw.variableName + "\" vertically");
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
        let tempStartPosY = this.startPos.y + this.slotConfig.slotHeight + structToDraw.elements.length * this.slotStrokeWidth;  //Accounting for the parent variable + all element slot's stroke widths
        //Drawing the elements themselves
        for(let i = 0; i < structToDraw.elements.length; i++)
        {
            let currentChild = new StackframeSlotWidget(structToDraw.elements[i], this.canvas, tempStartPosX, tempStartPosY, elementsConfig);
            this.children.push(currentChild);
            currentChild.draw();
            //Adjusting the starting position for the next element
            let childHeight = currentChild.height;
            tempStartPosY += childHeight == undefined ? 0 : childHeight - this.slotStrokeWidth;  
        }
    }

    drawArrayVertical(arrayToDraw: DataModelStructures.Array) {
        console.log("[DEBUG] Drawing the array \"" + arrayToDraw.variableName + "\" vertically");
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
        let tempStartPosY = this.startPos.y + this.slotConfig.slotHeight + arrayToDraw.size * this.slotStrokeWidth;  //Accounting for the parent variable + all element slot's stroke widths
        //Drawing the elements themselves
        let emptySlot = new DataModelStructures.StackFrame();     //To signify an empty space in an array
        emptySlot.functionName = "";
        for(let i = 0; i < arrayToDraw.size; i++)
        {
            let currentChild;
            //If the current index is populated
            if(arrayToDraw.elements[i] != undefined)
            {
                currentChild = new StackframeSlotWidget(arrayToDraw.elements[i], this.canvas, tempStartPosX, tempStartPosY, elementsConfig);
            }
            else
            {
                currentChild = new StackframeSlotWidget(emptySlot, this.canvas, tempStartPosX, tempStartPosY, elementsConfig);
            }
            this.children.push(currentChild);
            currentChild.draw();
            //Adjusting the starting position for the next element
            let childHeight = currentChild.height;
            tempStartPosY += childHeight == undefined ? 0 : childHeight - this.slotStrokeWidth;  
        }
    }

    drawArrayHorizontal(arrayToDraw: DataModelStructures.Array) {
        console.log("[DEBUG] Drawing the array \"" + arrayToDraw.variableName + "\" horizontally");
        //Creating the config for the elements
        let elementsConfig = new StackframeSlotWidgetConfig();
        elementsConfig.slotWidth = this.checkMaxArrayMemberTextWidth(arrayToDraw);
        elementsConfig.slotHeight = this.slotConfig.slotHeight;
        elementsConfig.textColor = this.slotConfig.textColor;
        elementsConfig.shortenText = this.slotConfig.shortenText;
        elementsConfig.slotColor = this.slotConfig.slotColor;
        elementsConfig.textFontSize = this.slotConfig.textFontSize;
        elementsConfig.textLeftOffset = this.slotConfig.textLeftOffset;
        elementsConfig.textRightOffset = this.slotConfig.textRightOffset;
        //Drawing the elements
        let tempStartPosX = this.startPos.x + this.slotConfig.slotHeight/2;
        let tempStartPosY = this.startPos.y + this.slotConfig.slotHeight + arrayToDraw.size * this.slotStrokeWidth;  //Accounting for the parent variable + all element slot's stroke widths
        //Drawing the elements themselves
        let emptyVariable = new DataModelStructures.Variable();     //To signify an empty space in an array
        emptyVariable.valueString = "";
        for(let i = 0; i < arrayToDraw.size; i++)
        {
            let currentChild;
            //If the current index is populated
            if(arrayToDraw.elements[i] != undefined)
            {
                currentChild = new ArrayVariableWidget(arrayToDraw.elements[i], this.canvas, tempStartPosX, tempStartPosY, elementsConfig);
            }
            else
            {
                currentChild = new ArrayVariableWidget(emptyVariable, this.canvas, tempStartPosX, tempStartPosY, elementsConfig);
            }
            this.children.push(currentChild);
            currentChild.draw();
            //Adjusting the starting position for the next element
            tempStartPosX += elementsConfig.slotWidth;
        }
    }

    initAndDrawChildren() {
        //Adding the elements (in case of a struct)
        if(this.dataModelObject instanceof DataModelStructures.Struct && !this.dataModelObject.isCollapsed)
        {
            this.drawStructVertical(this.dataModelObject);
        }
        //Adding the elements (in case of an array)
        else if(this.dataModelObject instanceof DataModelStructures.Array && !this.dataModelObject.isCollapsed)
        {
            //Checking if the array has elements
            let variableKeys = Object.keys(this.dataModelObject.elements); 
            if(variableKeys.length > 0)
            {
                //Checking if the element is an expandable variable
                if(this.dataModelObject.elements[variableKeys[0]] instanceof DataModelStructures.ExpandableVariable)
                    this.drawArrayVertical(this.dataModelObject);   //If yes, drawing it vertically (to be able to later further expand the elements)
                else
                    this.drawArrayHorizontal(this.dataModelObject);
            }
            else
            {
                this.drawArrayHorizontal(this.dataModelObject);     //By default, drawing horizontally
            }
        }
    }

    //Unused - changing the text's background is probably a better option
    highlightIfChanged() {

        if(this.dataModelObject instanceof DataModelStructures.Variable && this.dataModelObject.valueChanged)
        {
            let highlightStrokeWidth = this.slotStrokeWidth / 2;                        //divided by 2 to keep the text readable

            //Getting the absolute coords of the slot's background
            let backgroundRect = this.fabricObject._objects[0];
            let bgCoords = backgroundRect.getCoords(true);
            let bgSize = {width: backgroundRect.width ? backgroundRect.width : 0, height: backgroundRect.height ? backgroundRect.height : 0};
            //Creating the highlight
            let fabricSlotHighlight = new fabric.Rect({
                left: bgCoords[0].x + this.slotStrokeWidth,
                top: bgCoords[0].y + this.slotStrokeWidth,
                width: bgSize.width - this.slotStrokeWidth - highlightStrokeWidth,      //to compensate for both of the stroke widths
                height: bgSize.height - this.slotStrokeWidth - highlightStrokeWidth,    //to compensate for both of the stroke widths
                fill: "",                                                               //"" to have no fill
    
                //Default values
                padding: this.slotConfig.textFontSize / 2.5,
                stroke: "yellow",
                strokeWidth: highlightStrokeWidth
            });

            //Adding the highlight to the widget's fabric group
            this.fabricObject._objects.push(fabricSlotHighlight);
        }
    }

    draw() {
        let startingSlotHeight = this.slotConfig.slotHeight;
        let tempSlotHeight = startingSlotHeight;

        function addSpaceForExpandable(variableToCheck: DataModelStructures.ExpandableVariable) {
            function drawArrayVertically(arrayToCheck: DataModelStructures.Array) : boolean {
                //Checking if the array has elements
                let variableKeys = Object.keys(arrayToCheck.elements); 
                if(variableKeys.length > 0)
                {
                    //If the first found element is an expandable variable, drawing the array vertically
                    return arrayToCheck.elements[variableKeys[0]] instanceof DataModelStructures.ExpandableVariable;
                }
                return false;
            } 

            if(variableToCheck instanceof DataModelStructures.Struct && !variableToCheck.isCollapsed)
            {
                tempSlotHeight += startingSlotHeight * (variableToCheck.elements.length + 1);   //for the variable itself + (elements.length for elements + 1 for extra space for padding)
                for(let i = 0; i < variableToCheck.elements.length; i++)
                {
                    let currentElement = variableToCheck.elements[i];
                    if(currentElement instanceof DataModelStructures.ExpandableVariable && !variableToCheck.isCollapsed)
                        addSpaceForExpandable(currentElement);
                }
            }
            if(variableToCheck instanceof DataModelStructures.Array && !variableToCheck.isCollapsed)
            {
                if(drawArrayVertically(variableToCheck))
                    tempSlotHeight += startingSlotHeight * (variableToCheck.size + 1);          //for the variable itself + (size for elements + 1 for extra space for padding)
                else
                    tempSlotHeight += 2 * startingSlotHeight;                                   //+1 for elements + 1 for extra space for padding

                for(let i = 0; i < variableToCheck.size; i++)
                {
                    let currentElement = variableToCheck.elements[i];
                    if(currentElement != undefined && currentElement instanceof DataModelStructures.ExpandableVariable && !variableToCheck.isCollapsed)
                        addSpaceForExpandable(currentElement);
                }
            }
        }

        //Checking for uncollapsed structs / arrays (and then increasing the total slot height)
        if(this.dataModelObject instanceof DataModelStructures.ExpandableVariable)
            addSpaceForExpandable(this.dataModelObject);

        //Drawing the slot's background
        let fabricSlotBackground = new fabric.Rect({
            left: this.startPos.x,
            top: this.startPos.y,
            width: this.slotConfig.slotWidth,
            height: tempSlotHeight,
            fill: this.slotConfig.slotColor,

            //Default values
            padding: this.slotConfig.textFontSize / 2.5,
            stroke: "black",
            strokeWidth: this.slotStrokeWidth
        });
        //Drawing the slot's text
        let slotText = "";
        if(this.dataModelObject instanceof DataModelStructures.StackFrame)
        {
            slotText = this.dataModelObject.functionName;
        }
        else if (this.dataModelObject instanceof DataModelStructures.Struct)
        {
            if(this.dataModelObject.variableName != undefined)
                slotText = this.dataModelObject.variableName + ": " + this.dataModelObject.dataTypeString + " (...)";                               //Custom value text for struct variables
            else
                slotText = this.dataModelObject.dataTypeString + " (...)"
        }
        else if (this.dataModelObject instanceof DataModelStructures.Array)
        {
            slotText = this.dataModelObject.variableName + ": " + this.dataModelObject.dataTypeString + " [" + this.dataModelObject.size + "]";     //Custom value text for array variables
        }
        else if(this.dataModelObject instanceof DataModelStructures.HeapVariable)
        {
            slotText = this.dataModelObject.variable.variableName + ": " + this.dataModelObject.variable.dataTypeString + " (" + this.dataModelObject.variable.valueString + ")";   //Custom access to the variable
        }
        else
        {
            slotText = this.dataModelObject.variableName + ": " + this.dataModelObject.dataTypeString + " (" + this.dataModelObject.valueString + ")";
        }

        let textBackgroundColor: string | undefined = undefined;
        if(this.dataModelObject instanceof DataModelStructures.Variable && this.dataModelObject.valueChanged)
            textBackgroundColor = FabricDrawingModule.FabricDrawingModule.calculateLighterDarkerHex(this.slotConfig.slotColor, 15);

        let fabricSlotText = new fabric.Text(slotText, {
            left: this.startPos.x + this.slotConfig.textLeftOffset,
            top: this.startPos.y - 2 + (this.slotConfig.slotHeight - this.slotConfig.textFontSize) / 2,
            fill: this.slotConfig.textColor,
            fontSize: this.slotConfig.textFontSize,
            backgroundColor: textBackgroundColor
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
                    fontSize: this.slotConfig.textFontSize,
                    backgroundColor: textBackgroundColor
                });
            }
        }

        //Creating the result
        this.fabricObject = new fabric.Group([fabricSlotBackground, fabricSlotText]);

        //In case the value has changed (has it's "valueChanged" flag set to "true"), highlighting it
        //this.highlightIfChanged();

        //Adding the group to the canvas
        this.canvas.add(this.fabricObject);

        //In case of structs / arrays, preparing (and drawing) their elements
        this.initAndDrawChildren();

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

export class ArrayVariableWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.Variable;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a stackframe slot widget
    slotConfig: StackframeSlotWidgetConfig;
    slotStrokeWidth: number;

    constructor(objectToDraw: DataModelStructures.Variable, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: StackframeSlotWidgetConfig) {
        this.canvas = drawToCanvas;
        this.dataModelObject = objectToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
        //Added variables specific for a stackframe slot widget
        this.slotConfig = setConfig;
        this.slotStrokeWidth = this.slotConfig.textFontSize / 10;
    }

    get width(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value

        return Math.abs(coords[0].x - coords[1].x);
    }

    get height(): number | undefined {
        let coords = this.fabricObject.getCoords(true); //Getting the group's coordinates in absolute value
 
        return Math.abs(coords[0].y - coords[3].y);
    }

    //Unused - changing the text's background is probably a better option
    highlightIfChanged() {

        if(this.dataModelObject instanceof DataModelStructures.Variable && this.dataModelObject.valueChanged)
        {
            let highlightStrokeWidth = this.slotStrokeWidth / 2;                        //divided by 2 to keep the text readable

            //Getting the absolute coords of the slot's background
            let backgroundRect = this.fabricObject._objects[0];
            let bgCoords = backgroundRect.getCoords(true);
            let bgSize = {width: backgroundRect.width ? backgroundRect.width : 0, height: backgroundRect.height ? backgroundRect.height : 0};
            //Creating the highlight
            let fabricSlotHighlight = new fabric.Rect({
                left: bgCoords[0].x + this.slotStrokeWidth,
                top: bgCoords[0].y + this.slotStrokeWidth,
                width: bgSize.width - this.slotStrokeWidth - highlightStrokeWidth,      //to compensate for both of the stroke widths
                height: bgSize.height - this.slotStrokeWidth - highlightStrokeWidth,    //to compensate for both of the stroke widths
                fill: "",                                                               //"" to have no fill
    
                //Default values
                padding: this.slotConfig.textFontSize / 2.5,
                stroke: "yellow",
                strokeWidth: highlightStrokeWidth
            });

            //Adding the highlight to the widget's fabric group
            this.fabricObject._objects.push(fabricSlotHighlight);
        }
    }

    draw() {
        let startingSlotHeight = this.slotConfig.slotHeight;
        let tempSlotHeight = startingSlotHeight;

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
            strokeWidth: this.slotStrokeWidth
        });
        //Drawing the slot's text
        let slotText = this.dataModelObject.valueString;    //Custom value for array elements

        let textBackgroundColor: string | undefined = undefined;
        if(this.dataModelObject instanceof DataModelStructures.Variable && this.dataModelObject.valueChanged)
            textBackgroundColor = FabricDrawingModule.FabricDrawingModule.calculateLighterDarkerHex(this.slotConfig.slotColor, 15);

        let fabricSlotText = new fabric.Text(slotText, {
            left: this.startPos.x + this.slotConfig.textLeftOffset,
            top: this.startPos.y - 2 + (this.slotConfig.slotHeight - this.slotConfig.textFontSize) / 2,
            fill: this.slotConfig.textColor,
            fontSize: this.slotConfig.textFontSize,
            backgroundColor: textBackgroundColor
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
                    fontSize: this.slotConfig.textFontSize,
                    backgroundColor: textBackgroundColor
                });
            }
        }

        //Creating the result
        this.fabricObject = new fabric.Group([fabricSlotBackground, fabricSlotText]);

        //In case the value has changed (has it's "valueChanged" flag set to "true"), highlighting it
        //this.highlightIfChanged();

        //Adding the group to the canvas
        this.canvas.add(this.fabricObject);

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

export class StackframeWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.StackFrame;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a stackframe widget
    stackframeConfig: StackframeWidgetConfig;

    constructor(stackFrameToDraw: DataModelStructures.StackFrame, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: StackframeWidgetConfig) {
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

export class HeapWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.Heap;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a heap widget
    heapConfig: HeapWidgetConfig;

    constructor(heapToDraw: DataModelStructures.Heap, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: HeapWidgetConfig) {
        this.canvas = drawToCanvas;
        this.dataModelObject = heapToDraw;
        this.fabricObject = new fabric.Group();
        this.startPos = {x: setStartPosX, y: setStartPosY};
        this.children = new Array<Widget>();
        //Added variables specific for a heap widget
        this.heapConfig = setConfig;
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
        let textFontSize = this.heapConfig.slotHeight - this.heapConfig.slotHeight / 3;
        let textLeftOffset = textFontSize / 5;
        let textRightOffset = textLeftOffset * 2;
        let backgroundStrokeWidth = textFontSize / 10;

        //Skipping drawing if the heap is not shown
        if(!this.heapConfig.isShown)
            return;

        //To prepare the slot's shared config
        function createSlotConfig(setSlotColor: string, heapConfig: HeapWidgetConfig) : StackframeSlotWidgetConfig{
            let retSlotConfig = new StackframeSlotWidgetConfig();
            retSlotConfig.slotWidth = heapConfig.slotWidth;
            retSlotConfig.slotHeight = heapConfig.slotHeight;
            retSlotConfig.slotColor = setSlotColor;
            retSlotConfig.textColor = heapConfig.textColor;
            retSlotConfig.textFontSize = textFontSize;
            retSlotConfig.textLeftOffset = textLeftOffset;
            retSlotConfig.textRightOffset = textRightOffset;
            retSlotConfig.shortenText = heapConfig.shortenText;
            return retSlotConfig;
        }

        //Going through all variables
        let currentChildHeight: number | undefined = 0;
        if (this.dataModelObject.heapVariables != null)
        {
            for (let key in this.dataModelObject.heapVariables) {
                let currentHeapVariable = this.dataModelObject.heapVariables[key];
                
                if (currentHeapVariable != null) {
                    let stackSlotConfig = createSlotConfig(backgroundColorGrey, this.heapConfig);
                    let currentStackframeSlotWidget = new StackframeSlotWidget(currentHeapVariable, this.canvas, tempStartPosX, tempStartPosY, stackSlotConfig); 
                    this.children.push(currentStackframeSlotWidget);
                    currentStackframeSlotWidget.draw();                                                                         //Drawing the slot (to have it's height data available)
                    currentChildHeight = currentStackframeSlotWidget.height;                                                    //Getting the height of the current child
                    //Accounting for the stroke width (adding the child height) + adding a single slot width (to keep the variables drawn separately)
                    tempStartPosY += currentChildHeight == undefined ? 0 : currentChildHeight - backgroundStrokeWidth + this.heapConfig.slotHeight;    
                }
            }
        }

        //Locking the movement of the items
        this.canvas.lockAllItems();
    }
}

export class ProgramStackWidget implements Widget {
    canvas: FabricDrawingModule.CustomCanvas;
    dataModelObject: DataModelStructures.ProgramStack;
    fabricObject: fabric.Group;
    startPos: {x: number, y: number};
    children: Array<Widget>;
    //Added variables specific for a program stack widget
    programStackConfig: ProgramStackWidgetConfig;

    constructor(programStackToDraw: DataModelStructures.ProgramStack, drawToCanvas: FabricDrawingModule.CustomCanvas, setStartPosX = 10, setStartPosY = 10, setConfig: ProgramStackWidgetConfig) {
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

    //Helper function used to calculate max text width in a provided program stack (used to determine neccessary slot width)
    calculateMaxTextWidth(textFontSize: number, textLeftOffset: number, textRightOffset: number, structLeftOffset: number, checkOnlyHeap = false) : number {
        let maxTotalTextWidth = 0;
        let allVariableTexts = new Array<{variableText: string, level: number, arrayElementXOffset: number}>();

        function checkMaxArrayMemberTextWidth(arrayToCheck: DataModelStructures.Array) : number {
            let maxTotalArrayMemberTextWidth = 0;
            for (let key in arrayToCheck.elements) {
                let value = arrayToCheck.elements[key];
                
                if (value != null) {
                    //"Mock" creating Fabric text (to calculate total width properly)
                    let tempFabricSlotText = new fabric.Text(value.valueString != undefined ? value.valueString : "", {
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

                    //Checking if the elements are expandable variables
                    let isArrayOfExpandables = false;
                    let variableKeys = Object.keys(variableToCheck.elements); 
                    if(variableKeys.length > 0) //Checking if the array has elements
                    {
                        //Checking if the element is an expandable variable
                        isArrayOfExpandables = variableToCheck.elements[variableKeys[0]] instanceof DataModelStructures.ExpandableVariable
                    }

                    for (let i = 0; i < variableToCheck.size; i++)
                    {
                        if(isArrayOfExpandables)
                        {
                            let currentElement = variableToCheck.elements[i];
                            if(currentElement != undefined)
                                checkVariableText(currentElement, currentLevel + 1);
                        }
                        else
                        {
                            currentVariableText = "";
                            allVariableTexts.push({variableText: currentVariableText, level: currentLevel, arrayElementXOffset: maxElementWidth * (i+1)});  //empty string ("") and "i+1" and  due to the array's slots being longer than their text (to end with the next slot)   
                        }
                    }
                }
            }
            else
            {
                let currentMemberVariableText = variableToCheck.variableName + ": " + variableToCheck.dataTypeString + " (" + variableToCheck.valueString + ")";
                allVariableTexts.push({variableText: currentMemberVariableText, level: currentLevel, arrayElementXOffset: 0});
            }
        }
        
        if(!checkOnlyHeap)
        {
            //Going through all stackframes present (and noting their parameters' and variables' text)
            for (let stackFrameKey in this.dataModelObject.stackFrames) {
                let currentStackFrame = this.dataModelObject.stackFrames[stackFrameKey];
                
                if (currentStackFrame != null) {
                    //Pushing the function name
                    allVariableTexts.push({variableText: currentStackFrame.functionName, level: 0, arrayElementXOffset: 0});

                    //If the stackframe is uncollapsed, going through it's variables
                    if(!currentStackFrame.isCollapsed)
                    {
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
            }
        }
        else
        {
            //Going through the heap (and it's variables' text)
            for (let heapKey in this.dataModelObject.heap.heapVariables) {
                let currentVariable = this.dataModelObject.heap.heapVariables[heapKey];
                
                if (currentVariable != null) {
                    checkVariableText(currentVariable.variable, 0);
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
            let textTotalWidth = textTotalXOffset + tempFabricSlotText.getScaledWidth() + textRightOffset * (allVariableTexts[i].level + 1) //+1 due to the 0th level having right offset already; 

            //Comparing the current variable text's length to the maximum 
            maxTotalTextWidth = textTotalWidth > maxTotalTextWidth ? textTotalWidth : maxTotalTextWidth;
        }

        return maxTotalTextWidth;
    }

    //Helper function checking for pointer variables in a provided program stack (assigns values to the this.cache.pointers)
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

                            this.programStackConfig.fabricDrawingModuleCache.pointers.push({pointerVariable: currentFunctionParameter.variableName, pointingTo: valuePointedTo});
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

                            this.programStackConfig.fabricDrawingModuleCache.pointers.push({pointerVariable: currentFunctionVariable.variableName, pointingTo: valuePointedTo});
                        }
                    }
                }
            }
        }
    }

    drawArrowsToHeap() {
        //Helper function to draw an arrow between two slots (used for pointers) - specialized version of a FabricDrawingModule function (to draw arrows to heap)
        function drawArrowBetweenVariables(canvasToDrawTo: FabricDrawingModule.CustomCanvas, fromVariableObject : fabric.Object, toVariableObject : fabric.Object)
        {
            let arrowColor = "white";
            let arrowEndTriangleWidth = 10;
            let arrowEndTriangleHeight = 15;

            if(fromVariableObject instanceof fabric.Group && toVariableObject instanceof fabric.Group)
            {
                if (fromVariableObject._objects[1] instanceof fabric.Text && toVariableObject._objects[1] instanceof fabric.Text)
                    console.log("[DEBUG] Drawing an arrow between \"" + fromVariableObject._objects[1].text + "\" and \"" + toVariableObject._objects[1].text);
                else
                    console.log("[DEBUG] Error - fromVariableObject or toVariableObject doesn't contain text (not at the [1] position)");
                let arrowObjectGroup = new fabric.Group();
                let fromVariableObjectPosition = fromVariableObject.getCoords(true);    //Neccessary to get the absolute coordinates
                let toVariableObjectPosition = toVariableObject.getCoords(true);        //Neccessary to get the absolute coordinates
                let fromVarRightMiddlePoint =   [fromVariableObjectPosition[1].x,   fromVariableObjectPosition[1].y + (fromVariableObjectPosition[2].y  - fromVariableObjectPosition[1].y)  / 2];
                let toVarRightMiddlePoint =     [toVariableObjectPosition[1].x,     toVariableObjectPosition[1].y   + (toVariableObjectPosition[2].y    - toVariableObjectPosition[1].y)    / 2];
                //In case the pointee is on heap
                let toVarLeftMiddlePoint =     [toVariableObjectPosition[0].x,     toVariableObjectPosition[0].y   + (toVariableObjectPosition[3].y    - toVariableObjectPosition[0].y)    / 2];

                //Compensating for a possible mismatch in X values
                let higherXValue = Math.max(fromVarRightMiddlePoint[0], toVarRightMiddlePoint[0]);

                //Drawing an arrow from the variable objects right X and middle points (Y)
                let lineFromTo = new fabric.Line([fromVarRightMiddlePoint[0], fromVarRightMiddlePoint[1], toVarLeftMiddlePoint[0] - arrowEndTriangleHeight, toVarLeftMiddlePoint[1]], {
                    stroke: arrowColor
                });

                let endTriangle = new fabric.Triangle({
                    width: arrowEndTriangleWidth, 
                    height: arrowEndTriangleHeight, 
                    fill: arrowColor, 
                    left: toVarLeftMiddlePoint[0], 
                    top: toVarLeftMiddlePoint[1] - arrowEndTriangleHeight / 2 + 1,
                    angle: 90
                });
                
                arrowObjectGroup = new fabric.Group([lineFromTo, endTriangle]);
                
                canvasToDrawTo.add(arrowObjectGroup);
            }
            else
            {
                console.log("[DEBUG] FROM or TO variable object doesn't have an \"_objects\" property");
            }

            //Locking the movement of the items
            canvasToDrawTo.lockAllItems();
        }   

        //Getting all the widgets contained in the program stack (to compare)
        let widgetsToCompare = new Array<Widget>();
        function getAllChildrensWidgets(parentWidget: Widget) {
            widgetsToCompare.push(parentWidget);
            for(let i = 0; i < parentWidget.children.length; i++)
            {
                getAllChildrensWidgets(parentWidget.children[i]);
            } 
        }
        getAllChildrensWidgets(this);
        
        //Comparing all the ProgramStackWidget's widgets
        for(let i = 0; i < widgetsToCompare.length; i++)
        {
            let currentWidgetI = widgetsToCompare[i];
            for(let j = 0; j < widgetsToCompare.length; j++)
            {
                let currentWidgetJ = widgetsToCompare[j];
                //If the currentChildI is a pointer to the currentChildJ
                if( currentWidgetI.dataModelObject instanceof DataModelStructures.Variable &&
                    currentWidgetJ.dataModelObject instanceof DataModelStructures.HeapVariable && 
                    currentWidgetI.dataModelObject.isPointer && currentWidgetI.dataModelObject.valueString == currentWidgetJ.dataModelObject.variable.variableName)
                {
                    console.log({message: "[DEBUG] drawArrowsToHeap found a match", body: {pointer: currentWidgetI, pointee: currentWidgetJ}});
                    drawArrowBetweenVariables(this.canvas, currentWidgetI.fabricObject, currentWidgetJ.fabricObject);
                }
            }
        }
    }

    draw() {
        let shortenText = false;
        let stackSlotHeight = 30;
        let minStackSlotWidth = 150;
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
        function createConfig(programStackConfig: ProgramStackWidgetConfig, returnHeapConfig = false) : StackframeWidgetConfig | HeapWidgetConfig{
            let retSlotConfig;
            if(!returnHeapConfig)
                retSlotConfig = new StackframeWidgetConfig();
            else
            {
                retSlotConfig = new HeapWidgetConfig();
                retSlotConfig.isShown = true;       //Default value
            }

            if(shortenText && programStackConfig.maxStackSlotWidth != undefined)
                retSlotConfig.slotWidth = programStackConfig.maxStackSlotWidth;
            else if(calculatedMaxTextWidth + textRightOffset > minStackSlotWidth)
                retSlotConfig.slotWidth = calculatedMaxTextWidth + textRightOffset;
            else
                retSlotConfig.slotWidth = minStackSlotWidth;
            retSlotConfig.slotHeight = stackSlotHeight;
            retSlotConfig.textColor = textColor;
            retSlotConfig.shortenText = shortenText;
            return retSlotConfig;
        }

        //Drawing the "Program stack" text
        let fabricProgramStackText = new fabric.Text("Program stack", {
            left: this.startPos.x,
            top: this.startPos.y,
            fill: "white", // idc, i need white
            fontSize: textFontSize * 1.2
        });
        this.canvas.add(fabricProgramStackText);

        //Advancing the starting Y position
        let fabricProgramStackTextHeight = fabricProgramStackText.height;
        tempStartPosY += fabricProgramStackTextHeight != undefined ? fabricProgramStackTextHeight * 1.5 : 0;
        
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

        //Saving the current state to the cache
        this.programStackConfig.fabricDrawingModuleCache.programStackWidget = this;

        //Preparing the heap's config
        let heapConfig = createConfig(this.programStackConfig, true);
        let calculatedMaxHeapTextWidth = this.calculateMaxTextWidth(textFontSize, textLeftOffset, textRightOffset, structLeftOffset, true);
        if (this.programStackConfig.maxStackSlotWidth != undefined) {
            //Checking if we'll need to shorten the variable text (if all variable texts are shorter than the desired stackSlotWidth)
            heapConfig.shortenText = this.programStackConfig.maxStackSlotWidth < calculatedMaxHeapTextWidth;
        }
        //Setting the slot's width
        if(heapConfig.shortenText && this.programStackConfig.maxStackSlotWidth != undefined)
            heapConfig.slotWidth = this.programStackConfig.maxStackSlotWidth;
        else
            heapConfig.slotWidth = calculatedMaxHeapTextWidth + textRightOffset;

        //Drawing the heap
        if(heapConfig instanceof HeapWidgetConfig)
        {
            let heapStartPosX;
            let heapStartPosY = this.startPos.y;
            if(this.programStackConfig.maxStackSlotWidth != undefined)
            {
                heapStartPosX = (1.5 * this.programStackConfig.maxStackSlotWidth) + textRightOffset;    //1.5 times to add a proportinal space in between
            }
            else if(calculatedMaxTextWidth + textRightOffset > minStackSlotWidth)
            {
                heapStartPosX = (1.5 * calculatedMaxTextWidth) + textRightOffset;                       //1.5 times to add a proportinal space in between
            }
            else
           {
                heapStartPosX = (1.5 * minStackSlotWidth);                                              //1.5 times to add a proportinal space in between
           }

            //Drawing the "Heap" text
            let fabricHeapText = new fabric.Text("Heap", {
                left: heapStartPosX,
                top: heapStartPosY,
                fill: "white", // idc, i need white here as well
                fontSize: textFontSize * 1.2
            });
            this.canvas.add(fabricHeapText);

            //Advancing the starting Y position
            let fabricHeapTextHeight = fabricHeapText.height;
            heapStartPosY += fabricHeapTextHeight != undefined ? fabricHeapTextHeight * 1.5 : 0;

            let heapWidget = new HeapWidget(this.dataModelObject.heap, this.canvas, heapStartPosX, heapStartPosY, heapConfig);
            this.children.push(heapWidget);     //Adding the heap as a programStackWidget's child
            heapWidget.draw();
            this.drawArrowsToHeap();
        }
        else
        {
            console.log("[DEBUG] Error - heap widget config is not of type HeapWidgetConfig");
        }
    }
}