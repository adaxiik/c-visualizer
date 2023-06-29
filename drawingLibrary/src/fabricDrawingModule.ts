import { fabric } from "fabric";
import * as DataModelStructures from "./dataModelStructures";
import * as DrawingWidgets from "./drawingWidgets";

//Type containing all DataModel object types
type DataModelObject = DataModelStructures.Array
                    | DataModelStructures.DataType
                    | DataModelStructures.Memory
                    | DataModelStructures.ProgramStack 
                    | DataModelStructures.StackFrame 
                    | DataModelStructures.Struct 
                    | DataModelStructures.Variable
                    | DataModelStructures.ExpandableVariable
                    | DataModelStructures.HeapVariable
                    | DataModelStructures.Heap;

export class CustomCanvas extends fabric.Canvas {
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
export class FabricDrawingModuleCache {
    objectColor: string;
    hoveredOverWidget: DrawingWidgets.StackframeSlotWidget | DrawingWidgets.ArrayVariableWidget | undefined;
    pointeeObject: {bgRectObject: fabric.Object, textObject: fabric.Object, previousColor: string};             //[backgroundRectangleObject, slotTextObject, previousColor]
    pointerArrowObject : fabric.Object | undefined;     //Fabric object representing the arrow between variables (presuming there is only one arrow object temporarily present)
    pointers: Array<{pointerVariable: any, pointingTo: any}>;
    drawProgramStackArguments?: [dataModelObject: DataModelStructures.ProgramStack, startPosX: number, startPoxY: number, maxStackSlotWidth?: number];    //[this.dataModelObject, this.startPos.x, this.startPos.y, this.programStackConfig.maxStackSlotWidth]
    programStackWidget: DrawingWidgets.ProgramStackWidget | undefined; //Reference to the current program stack widget

    constructor() {
        this.objectColor = "";
        this.hoveredOverWidget = undefined;
        this.pointeeObject = {bgRectObject: new fabric.Object, textObject: new fabric.Object, previousColor: ""};
        this.pointerArrowObject = undefined;
        this.pointers = new Array<{pointerVariable: any, pointingTo: any}>();
        this.drawProgramStackArguments = undefined;
        this.programStackWidget = undefined;
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
                    let hoveredOverWidget;
                    if(drawingModuleThis.cache.programStackWidget != undefined)
                    {
                        hoveredOverWidget = drawingModuleThis.findWidgetByFabricObject(opt.target, drawingModuleThis.cache.programStackWidget); 
                        console.log({message: "[DEBUG] mouse:down on widget:", body: hoveredOverWidget});
                    }
                    else
                    {
                        console.log("[DEBUG] Error - cached programStackWidget is undefined");
                    }
                    
                    if(hoveredOverWidget != undefined && (  hoveredOverWidget.dataModelObject instanceof DataModelStructures.StackFrame ||
                                                            hoveredOverWidget.dataModelObject instanceof DataModelStructures.ExpandableVariable))
                    {
                        hoveredOverWidget.dataModelObject.isCollapsed = !hoveredOverWidget.dataModelObject.isCollapsed;

                        //Redraw the canvas
                        drawingModuleThis.redrawCanvas();

                        //Preventing the mouse going to selection mode and returning (to skip the dragging logic)
                        this.selection = false;
                        return;
                    }
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
        const calculateNewHex = FabricDrawingModule.calculateLighterDarkerHex;
        let drawingModuleThis = this;

        this.canvas.on('mouse:over', function(opt) {
            console.log({message: "[DEBUG] mouse:over event - target: ", body: opt.target});
            if(!this.isDragging)
            {
                if(opt.target !== undefined && opt.target !== null)
                {
                    if(opt.target instanceof fabric.Group)
                    {
                        let hoveredOverWidget;
                        if(drawingModuleThis.cache.programStackWidget != undefined)
                        {
                            hoveredOverWidget = drawingModuleThis.findWidgetByFabricObject(opt.target, drawingModuleThis.cache.programStackWidget); 
                            console.log({message: "[DEBUG] Hovering over widget:", body: hoveredOverWidget});
                        }
                        else
                        {
                            console.log("[DEBUG] Error - cached programStackWidget is undefined");
                        }
                        
                        //If the hovered over widget is not undefined (is a slot widget)
                        if(hoveredOverWidget instanceof DrawingWidgets.StackframeSlotWidget || hoveredOverWidget instanceof DrawingWidgets.ArrayVariableWidget)
                        {
                            //Changing the color of the variable (over which we're hovering)
                            let previousObjectColor = hoveredOverWidget.fabricObject._objects[0].get('fill')?.toString();
                            if (previousObjectColor != undefined && drawingModuleThis.cache.hoveredOverWidget == undefined) //"drawingModuleThis.cache.hoveredOverWidget == undefined" to avoid repeated darkening of object
                            {
                                //Saving it to the cache
                                drawingModuleThis.cache.hoveredOverWidget = hoveredOverWidget;

                                //Changing the slot's background color
                                drawingModuleThis.setObjectColor(hoveredOverWidget.fabricObject, calculateNewHex(previousObjectColor, -20), true, false);
                                //Changing the color of the text's background color (if present)
                                if(hoveredOverWidget.fabricObject._objects[1].backgroundColor != undefined)
                                    hoveredOverWidget.fabricObject._objects[1].backgroundColor = calculateNewHex(hoveredOverWidget.fabricObject._objects[1].backgroundColor, -15);
                            }
                            else
                                console.log("[DEBUG] Error - previousObjectColor was undefined");

                            //Checking if the hovered over variable is a pointer
                            if(drawingModuleThis.cache.pointers != undefined)
                            {
                                if(hoveredOverWidget.dataModelObject instanceof DataModelStructures.Variable && hoveredOverWidget.dataModelObject.isPointer)
                                {
                                    drawingModuleThis.markPointee(hoveredOverWidget.dataModelObject.valueString); //Mark the variable that is being pointed to
                                            
                                    let fromVariableObject = hoveredOverWidget.fabricObject;
                                    let toVariableObject = drawingModuleThis.findFabricObjectByText(hoveredOverWidget.dataModelObject.valueString + ":");
                                    if (fromVariableObject == undefined || toVariableObject == undefined)
                                    {
                                        console.log("[DEBUG] Error - FROM variable or TO variable are undefined");
                                    }
                                    else
                                    {
                                        if(toVariableObject instanceof fabric.Group && drawingModuleThis.cache.programStackWidget != undefined)
                                        {
                                            let toVariableWidget = drawingModuleThis.findWidgetByFabricObject(toVariableObject, drawingModuleThis.cache.programStackWidget);
                                            let toVariableWidgetOnHeap = toVariableWidget != undefined ? drawingModuleThis.isWidgetOnHeap(toVariableWidget) : undefined;
                                            if(!toVariableWidgetOnHeap)
                                                drawingModuleThis.drawArrowBetweenVariables(fromVariableObject, toVariableObject);
                                        }
                                    }
                                }
                            }
                            drawingModuleThis.canvas.requestRenderAll();
                        }
                    }
                }
            }
        });
        
        this.canvas.on('mouse:out', function(opt) {
            console.log({message: "[DEBUG] mouse:out event - target: ", body: opt.target});
            if(!this.isDragging)
            {
                if(opt.target !== undefined && opt.target !== null)
                {
                    if(opt.target instanceof fabric.Group)
                    {
                        //If we're still hovering over the same object (if the canvas hasn't changed causing us to skip from one object to another)
                        if(drawingModuleThis.cache.hoveredOverWidget != undefined && opt.target == drawingModuleThis.cache.hoveredOverWidget.fabricObject)
                        {
                            //Changing the color of the text's background color (if present) - before setObjectColor, that clears the cached color
                            if(opt.target._objects[1].backgroundColor != undefined)
                            opt.target._objects[1].backgroundColor = calculateNewHex(drawingModuleThis.cache.objectColor, 15);
                            //Changing the slot's background color
                            if(drawingModuleThis.cache.objectColor != "")
                            drawingModuleThis.setObjectColor(opt.target, drawingModuleThis.cache.objectColor, false, true);
                        }
                        
                        //Resetting the state of the pointee variable (if changed)
                        if (drawingModuleThis.cache.pointeeObject.previousColor !== "")
                        {
                            //Resetting the pointee's previous color
                            drawingModuleThis.cache.pointeeObject.bgRectObject.set("fill", drawingModuleThis.cache.pointeeObject.previousColor);
                            //Changing the color of the text's background color (if present)
                            if(drawingModuleThis.cache.pointeeObject.textObject.backgroundColor != undefined)
                                drawingModuleThis.cache.pointeeObject.textObject.backgroundColor = calculateNewHex(drawingModuleThis.cache.pointeeObject.previousColor, 15);
                            //Clearing the cached pointee
                            drawingModuleThis.cache.pointeeObject.bgRectObject = new fabric.Object();
                            drawingModuleThis.cache.pointeeObject.textObject = new fabric.Object();
                            drawingModuleThis.cache.pointeeObject.previousColor = "";

                            //Deleting the arrow object from canvas (if present)
                            if(drawingModuleThis.cache.pointerArrowObject != undefined)
                            {
                                drawingModuleThis.canvas.remove(drawingModuleThis.cache.pointerArrowObject);
                                drawingModuleThis.cache.pointerArrowObject = undefined;
                            }
                        }
                        //Resetting the "hoveredOverWidget" cache
                        drawingModuleThis.cache.hoveredOverWidget = undefined;

                        drawingModuleThis.canvas.requestRenderAll();
                    }
                }
            }
        });
    }

    //A function to fully redraw the canvas
    redrawCanvas() {
        if (this.cache.drawProgramStackArguments != undefined && this.cache.drawProgramStackArguments != null)
        {
            this.canvas.clearCanvas();
            this.drawProgramStack(...this.cache.drawProgramStackArguments);
        }
    }

    //Helper function to return the parent widget of the Fabric object (group)
    findWidgetByFabricObject(searchedForFabricGroup: fabric.Group, startSearchFrom: DrawingWidgets.Widget): DrawingWidgets.Widget | undefined {
        //Checking the main widget for a match
        if(startSearchFrom.fabricObject == searchedForFabricGroup)
        {
            console.log("[DEBUG] Widget match found!");
            return startSearchFrom;
        }
        else
        {
            //Checking it's children
            for (let i = 0; i < startSearchFrom.children.length; i++)
            {
                let tempReturn = this.findWidgetByFabricObject(searchedForFabricGroup, startSearchFrom.children[i]);
                if(tempReturn != undefined)
                    return tempReturn;
            }

            return undefined;
        }    
    }

    //Helper function to return the object with the searched for text
    findFabricObjectByText(searchedForText: string) : fabric.Object | undefined {
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
                    if (currentObject._objects[1].text != undefined)
                    {
                        if(currentObject._objects[1].text.includes(searchedForText))
                        {
                            console.log("[DEBUG] Text match found!");
                            return currentObject;
                        }
                        else
                        {
                            console.log("[DEBUG] Text doesn't match.");
                        }
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
    findDataModelObjectByText(searchedForText: string) : DataModelObject | undefined {
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
                if(variableToCheck instanceof DataModelStructures.ExpandableVariable)
                {
                    return checkExpandableForText(variableToCheck);
                }
                return undefined;
            }
            function checkExpandableForText(variableToCheck: DataModelStructures.ExpandableVariable) : DataModelStructures.Variable | undefined {
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
    setObjectColor(affectedObject: fabric.Object, newObjectColor: string, savePreviousColor: boolean, clearColorCache: boolean) {
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
                        console.log("[DEBUG] Error - tried to set \"" + affectedObject._objects[1].text + "\" to empty color");
                    else
                        console.log("[DEBUG] Error - tried to set affectedObject (that doesn't containt text) to empty color");
                }
            }
        }
    }

    //Helper function (for mouse:over events, etc.)
    static calculateLighterDarkerHex(inputHex: string, percentage: number) : string {
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
            this.cache.pointeeObject.bgRectObject = searchedForVariableObject._objects[0];
            this.cache.pointeeObject.textObject = searchedForVariableObject._objects[1];
            let previousColor = searchedForVariableObject._objects[0].get("fill")?.toString();
            if (previousColor != undefined)
                this.cache.pointeeObject.previousColor = previousColor;  
            else
                console.log("[DEBUG] Error - previous pointee color is undefined");
            //Changing the pointee's color
            searchedForVariableObject._objects[0].set("fill", "red");                   //Changing the color of the slot
            if(searchedForVariableObject._objects[1].backgroundColor != undefined)      //Changing the color of the text's background color (if present)
                searchedForVariableObject._objects[1].backgroundColor = "red";
        }
    }

    isWidgetOnHeap(widgetToCheck: DrawingWidgets.Widget) : boolean {
        let cache = this.cache;

        function getHeapWidget() : DrawingWidgets.HeapWidget | undefined {
            if(cache != undefined)
            {
                let programStackWidgetsChildren = cache.programStackWidget?.children; 
                if(programStackWidgetsChildren != undefined)                        //Going through the program stack's children
                {
                    for(let i = 0; i < programStackWidgetsChildren.length; i++)
                    {
                        let currentChild = programStackWidgetsChildren[i];
                        if(currentChild instanceof DrawingWidgets.HeapWidget)                      //If we found the heap widget
                            return currentChild;
                    }           
                }
            }
            return undefined;
        }

        function widgetInWidget(startSearchFrom: DrawingWidgets.Widget, searchedForWidget: DrawingWidgets.Widget) : boolean {
            //Checking the main widget for a match
            if(startSearchFrom == searchedForWidget)
            {
                return true;
            }
            else
            {
                //Checking it's children
                for (let i = 0; i < startSearchFrom.children.length; i ++)
                {
                    let tempReturn = widgetInWidget(startSearchFrom.children[i], searchedForWidget);
                    if(tempReturn)
                        return true;
                }

                return false;
            }  
        }

        let heapWidget = getHeapWidget();
        if(heapWidget != undefined)
        {
            if(widgetInWidget(heapWidget, widgetToCheck))
            {
                return true;
            }
        }

        return false;
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
            let arrowObjectGroup = new fabric.Group();
            let fromVariableObjectPosition = fromVariableObject.getCoords(true);    //Neccessary to get the absolute coordinates
            let toVariableObjectPosition = toVariableObject.getCoords(true);        //Neccessary to get the absolute coordinates
            let fromVarRightMiddlePoint =   [fromVariableObjectPosition[1].x,   fromVariableObjectPosition[1].y + (fromVariableObjectPosition[2].y  - fromVariableObjectPosition[1].y)  / 2];
            let toVarRightMiddlePoint =     [toVariableObjectPosition[1].x,     toVariableObjectPosition[1].y   + (toVariableObjectPosition[2].y    - toVariableObjectPosition[1].y)    / 2];

            //Compensating for a possible mismatch in X values
            let higherXValue = Math.max(fromVarRightMiddlePoint[0], toVarRightMiddlePoint[0]);

            //Drawing an arrow from the variable objects right X and middle points (Y)
            let lineStart = new fabric.Line([higherXValue + arrowOffset * 50 + 1, fromVarRightMiddlePoint[1], fromVarRightMiddlePoint[0], fromVarRightMiddlePoint[1]], {
                stroke: arrowColor
            });

            let lineMiddle = new fabric.Line([higherXValue + arrowOffset * 50, fromVarRightMiddlePoint[1], higherXValue + arrowOffset * 50, toVarRightMiddlePoint[1]], {
                stroke: arrowColor
            });

            let lineEnd = new fabric.Line([higherXValue + arrowOffset * 50, toVarRightMiddlePoint[1], toVarRightMiddlePoint[0] + arrowEndTriangleWidth, toVarRightMiddlePoint[1]], {
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

            arrowObjectGroup = new fabric.Group([lineStart, lineMiddle, lineEnd, endTriangle]);
            
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
        let programStackConfig = new DrawingWidgets.ProgramStackWidgetConfig();
        programStackConfig.fabricDrawingModuleCache = this.cache;
        programStackConfig.maxStackSlotWidth = maxStackSlotWidth;

        //Drawing the program stack
        let programStackWidget = new DrawingWidgets.ProgramStackWidget(programStackToDraw, this.canvas, startPosX, startPosY, programStackConfig);
        programStackWidget.draw();
    }

    //More general method that prevents the user from misusing the drawing methods
    drawVariable(variableToDraw: DataModelStructures.Variable, startPosX?: number, startPosY?: number) {
        if (variableToDraw.dataTypeString == "string")
            new DrawingWidgets.StringWidget(variableToDraw, this.canvas, startPosX, startPosY).draw();
        else if (variableToDraw.dataTypeString == "char")
            new DrawingWidgets.CharWidget(variableToDraw, this.canvas, startPosX, startPosY).draw();
        else if (variableToDraw.dataTypeString == "number" ||
            variableToDraw.dataTypeString == "int" ||
            variableToDraw.dataTypeString == "float")
            new DrawingWidgets.NumberWidget(variableToDraw, this.canvas, startPosX, startPosY).draw();
        else if (variableToDraw.dataTypeString == "bool" ||
            variableToDraw.dataTypeString == "boolean")
            new DrawingWidgets.BooleanWidget(variableToDraw, this.canvas, startPosX, startPosY).draw();
        else
            return;
    }
}