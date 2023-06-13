import { fabric } from "fabric";
import * as myDataModelStructures from "./dataModelStructures";
import { myStackFrame } from "./dataModelStructures";

export class myFabricDrawingModule {
    canvas: fabric.Canvas;
    cachedObjectColor: string;
    cachedPointeeObject: [fabric.Object, string];   //[backgroundRectangleObject, previousColor]
    cachedPointers: Array<[any, any]>;              //in a [pointerVariable, pointingTo] format
    cachedDrawProgramStackArguments?: [myDataModelStructures.myProgramStack, number, number, number?];

    constructor(canvasName: string) {
        this.canvas = new fabric.Canvas(canvasName);
        //To have it a bit larger (not yet exact sizing)
        //TODO: Think the sizing through and adjust accordingly
        this.canvas.setWidth(screen.width);
        this.canvas.setHeight(screen.height);
        this.cachedObjectColor = "";
        this.cachedPointeeObject = [new fabric.Object, ""];
        this.cachedPointers = new Array<[any, any]>();
        this.cachedDrawProgramStackArguments = undefined;

        this.initPanning();
        this.initZooming();
        this.initHoverOver();
    }

    clearCanvas() {
        console.log("[DEBUG] Clearing the canvas");
        this.canvas.clear();
    }

    initPanning() {
        let drawingModuleThis = this;

        this.canvas.on('mouse:down', function (opt) {
            //Checking if the desired action was just to click (and not drag)
            if(opt.target !== undefined && opt.target !== null)
            {
                //If we clicked on an object (stackframe slot)
                if("_objects" in opt.target)
                {
                    let hoveredOverObjectText = opt.target._objects[1].text;
                    //If the clicked on object is a stackFrame header (function name without ":")
                    if (!hoveredOverObjectText.includes(":")) {
                        //Set the corresponding stackframe as collapsed / uncollapsed
                        if (drawingModuleThis.cachedDrawProgramStackArguments != undefined && drawingModuleThis.cachedDrawProgramStackArguments != null)
                        {
                            for (let key in drawingModuleThis.cachedDrawProgramStackArguments[0].stackFrames) {
                                let value = drawingModuleThis.cachedDrawProgramStackArguments[0].stackFrames[key];
                                
                                if (value != null)
                                {
                                    if (value.functionName == hoveredOverObjectText)
                                    {
                                        value.isCollapsed = !value.isCollapsed;
                                    }
                                }
                            }
                            //Redraw the canvas
                            drawingModuleThis.clearCanvas();
                            drawingModuleThis.drawProgramStack(...drawingModuleThis.cachedDrawProgramStackArguments);
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
                    if("_objects" in opt.target)
                    {
                        //Changing the color of the variable (over which we're hovering)
                        drawingModuleThis.cachedObjectColor = opt.target._objects[0].get('fill');
                        if (drawingModuleThis.cachedObjectColor != "")
                        {
                            console.log("[DEBUG] Setting \"" + opt.target._objects[1].text + "\" to color \"" + drawingModuleThis.cachedObjectColor + "\"");
                            opt.target._objects[0].set('fill', calculateNewHex(drawingModuleThis.cachedObjectColor, -20));
                        }
    
                        //Checking if the hovered over variable is a pointer
                        if(drawingModuleThis.cachedPointers != undefined)
                        {
                            for (let i = 0; i < drawingModuleThis.cachedPointers.length; i++)
                            {
                                let hoveredOverVariableText = opt.target._objects[1].text; 
                                let searchedForText = drawingModuleThis.cachedPointers[i][0] + ":";
    
                                console.log("[DEBUG] Hovering over: \"" + hoveredOverVariableText + "\", searching for: \"" + searchedForText + "\"");
                                if (hoveredOverVariableText.includes(searchedForText)) {
                                    markPointee(drawingModuleThis.cachedPointers[i][1]);
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
                    if("_objects" in opt.target)
                    {
                        if(drawingModuleThis.cachedObjectColor != "")
                        {
                            console.log("[DEBUG] Setting \"" + opt.target._objects[1].text + "\" to color \"" + drawingModuleThis.cachedObjectColor + "\"");
                            opt.target._objects[0].set('fill', drawingModuleThis.cachedObjectColor);
                            drawingModuleThis.cachedObjectColor = "";
                        }
    
                        //Resetting the state of the pointee variable (if changed)
                        if (drawingModuleThis.cachedPointeeObject[1] !== "")
                        {
                            //Resetting the pointee's previous color
                            drawingModuleThis.cachedPointeeObject[0].set("fill", drawingModuleThis.cachedPointeeObject[1]);
                            //Clearing the cached pointee
                            drawingModuleThis.cachedPointeeObject[0] = new fabric.Object();
                            drawingModuleThis.cachedPointeeObject[1] = "";
                        }
                        requestRenderAll();
                    }
                }
            }
        });
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

    lockAllItems() {
        let allFabricItems = this.canvas.getObjects();

        allFabricItems.forEach(fabricObject => {
            fabricObject.selectable = false;
            fabricObject.hoverCursor = "default";
            fabricObject.evented = true;
        });
    }

    //Helper function used to calculate max text width in a provided program stack (used to determine neccessary slot width)
    calculateMaxTextWidth(programStackToDraw: myDataModelStructures.myProgramStack, textFontSize : number) : number {
        let maxTotalTextWidth = 0;
        let allVariableTexts = new Array<string>();
        
        //Going through all stackframes present (and noting their parameter's and variable's text)
        for (let stackFrameKey in programStackToDraw.stackFrames) {
            let currentStackFrame = programStackToDraw.stackFrames[stackFrameKey];
            
            if (currentStackFrame != null) {
                //Going through function parameters
                for (let functionParameterKey in currentStackFrame.functionParameters) {
                    let currentFunctionParameter = currentStackFrame.functionParameters[functionParameterKey];
                    if (currentFunctionParameter != null) {
                        let variableText = currentFunctionParameter.variableName + ": " + currentFunctionParameter.dataTypeString + " (" + currentFunctionParameter.valueString + ")";
                        allVariableTexts.push(variableText);
                    }
                }

                //Going through function variables
                for (let functionVariableKey in currentStackFrame.functionVariables) {
                    let currentFunctionVariable = currentStackFrame.functionVariables[functionVariableKey];
                    if (currentFunctionVariable != null) {
                        let variableText = currentFunctionVariable.variableName + ": " + currentFunctionVariable.dataTypeString + " (" + currentFunctionVariable.valueString + ")";
                        allVariableTexts.push(variableText);
                    }
                }
            }
        }

        //For all variables found
        for (let i = 0; i < allVariableTexts.length; i++) {
            //"Mock" creating Fabric text (to calculate total width properly)
            let tempFabricSlotText = new fabric.Text(allVariableTexts[i], {
                left: 0,
                top: 0,
                fill: "black",
                fontSize: textFontSize
            });

            //Comparing the current variable text's length to the maximum 
            maxTotalTextWidth = tempFabricSlotText.getScaledWidth() > maxTotalTextWidth ? tempFabricSlotText.getScaledWidth() : maxTotalTextWidth;
        }
        
        return maxTotalTextWidth;
    }

    //Helper function checking for pointer variables in a provided program stack (assigns values to the this.cachedPointers in a [pointerVariable, pointingTo] format)
    checkForPointers(programStackToDraw: myDataModelStructures.myProgramStack) {
        this.cachedPointers.splice(0, this.cachedPointers.length);  //Emptying the array

        //Going through all stackframes present (and noting their parameter's and variable's text)
        for (let stackFrameKey in programStackToDraw.stackFrames) {
            let currentStackFrame = programStackToDraw.stackFrames[stackFrameKey];
            
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

                            this.cachedPointers.push([currentFunctionParameter.variableName, valuePointedTo]);
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

                            this.cachedPointers.push([currentFunctionVariable.variableName, valuePointedTo]);
                        }
                    }
                }
            }
        }
    }

    //Helper function to mark the pointee variable (with a different color)
    markPointee(variableId : string) {
        let allCanvasObjects = this.canvas.getObjects();
        for (let i = 0; i < allCanvasObjects.length; i++) {
            //If the canvas object is a group
            if("_objects" in allCanvasObjects[i])
            {
                //If the found value is the value pointed to
                let currentCanvasObjectText = allCanvasObjects[i]._objects[1].text;
                let searchedForText = variableId + ":";
                console.log("[DEBUG] Testing if \"" + currentCanvasObjectText + "\" matches \"" + searchedForText + "\"");
                if (currentCanvasObjectText.includes(searchedForText))
                {
                    console.log("[DEBUG] Pointee found!")

                    //Saving the previous state of the pointee
                    this.cachedPointeeObject[0] = allCanvasObjects[i]._objects[0];
                    this.cachedPointeeObject[1] = allCanvasObjects[i]._objects[0].get("fill");  
                    //Changing the pointee's color
                    allCanvasObjects[i]._objects[0].set("fill", "red");
                }
            }
        }
    }

    drawProgramStack(programStackToDraw: myDataModelStructures.myProgramStack, startPosX = 10, startPosY = 10, maxStackSlotWidth? : number) {
        let shortenText = false;
        let stackSlotHeight = 30;
        let textFontSize = stackSlotHeight - stackSlotHeight / 3;
        let textLeftOffset = textFontSize / 5;
        let textRightOffset = textLeftOffset * 2;
        let calculatedMaxTextWidth = this.calculateMaxTextWidth(programStackToDraw, textFontSize);

        //Saving the now drawn program stack state (and the arguments of the last call)
        this.cachedDrawProgramStackArguments = [programStackToDraw, startPosX, startPosY, maxStackSlotWidth];

        //Caching the pointers in the program stack
        this.checkForPointers(programStackToDraw);

        //If maximum stack slot width is set
        if (typeof maxStackSlotWidth !== "undefined") {
            //Checking if we'll need to shorten the variable text (if all variable texts are shorter than the desired stackSlotWidth)
            shortenText = maxStackSlotWidth < calculatedMaxTextWidth;
        }
        
        //Drawing all the stackframes present
        for (let key in programStackToDraw.stackFrames) {
            let value = programStackToDraw.stackFrames[key];
            
            if (value != null) {
                //Chaging the starting position with each drawn stackframe
                if(shortenText) {
                    startPosY = this.drawStackFrame(value, startPosX, startPosY, stackSlotHeight, maxStackSlotWidth, shortenText);
                }
                else {
                    startPosY = this.drawStackFrame(value, startPosX, startPosY, stackSlotHeight, calculatedMaxTextWidth + textRightOffset, shortenText);
                }
            }
        }
    }

    drawStackFrame(stackFrameToDraw: myDataModelStructures.myStackFrame, startPosX = 10, startPosY = 10, stackSlotHeight = 30, stackSlotWidth = 300, shortenText = false): number {
        //Default values
        let backgroundColorBlue = '#33ccff';
        let backgroundColorGrey = '#8f8f8f';
        let backgroundColorRed = '#ff0000';
        let backgroundColorGreen = '#00ff04';
        let textFill = "black";
        //Note: Text and frame rectangle variables are dynamically adjusted by the stackSlotHeight variable
        let textFontSize = stackSlotHeight - stackSlotHeight / 3;
        let textLeftOffset = textFontSize / 5;
        let textRightOffset = textLeftOffset * 2;

        //Function to create a single slot in the stackframe
        let myCreateSlotFunction = function (mySlotText: string, slotBackgroundColor: string): fabric.Group {
            //Drawing the slot's background
            let fabricSlotBackground = new fabric.Rect({
                left: startPosX,
                top: startPosY,
                width: stackSlotWidth,
                height: stackSlotHeight,
                fill: slotBackgroundColor,

                //Default values
                padding: textFontSize / 2.5,
                stroke: "#000000",
                strokeWidth: textFontSize / 10
            });
            //Drawing the slot's text
            let fabricSlotText = new fabric.Text(mySlotText, {
                left: startPosX + textLeftOffset,
                top: startPosY - 2 + (stackSlotHeight - textFontSize) / 2,
                fill: textFill,
                fontSize: textFontSize
            });

            if (shortenText) {
                //Checking if the text is longer than maximum
                let maxTextLength = stackSlotWidth - textLeftOffset - textRightOffset;
                if(fabricSlotText.getScaledWidth() > maxTextLength) {
                    //Calculating how much to shorten the text
                    let averageCharLength = fabricSlotText.getScaledWidth() / mySlotText.length;
                    let overflowInWidth = fabricSlotText.getScaledWidth() - maxTextLength;
                    let overflowInChars = overflowInWidth / averageCharLength + 1;  //+1 to account for the space of "..."
                    let newSlotText = mySlotText.substring(0, mySlotText.length - 1 - overflowInChars) + "...";

                    //Making a shortened version of the text
                    fabricSlotText = new fabric.Text(newSlotText, {
                        left: startPosX + textLeftOffset,
                        top: startPosY - 2 + (stackSlotHeight - textFontSize) / 2,
                        fill: textFill,
                        fontSize: textFontSize
                    });
                }
            }

            //Creating the result
            let resultFabricGroup = new fabric.Group([fabricSlotBackground, fabricSlotText]);

            //Moving the starting position for the next stackframe
            startPosY += stackSlotHeight;

            return resultFabricGroup;
        };

        //Creating the slots
        let retAllSlots = new Array<fabric.Group>();
        //Function name
        retAllSlots.push(myCreateSlotFunction(stackFrameToDraw.functionName, backgroundColorBlue));
        //Function variables
        if (stackFrameToDraw.functionVariables != null && !stackFrameToDraw.isCollapsed)
        {
            for (let key in stackFrameToDraw.functionVariables) {
                let value = stackFrameToDraw.functionVariables[key];
                
                if (value != null) {
                    let variableText = value.variableName + ": " + value.dataTypeString + " (" + value.valueString + ")";
                    retAllSlots.push(myCreateSlotFunction(variableText, backgroundColorGrey));
                }
            }
        }
        //Function parameters
        if (stackFrameToDraw.functionParameters != null && !stackFrameToDraw.isCollapsed)
        {
            for (let key in stackFrameToDraw.functionParameters) {
                let value = stackFrameToDraw.functionParameters[key];
                
                if (value != null) {
                    let variableText = value.variableName + ": " + value.dataTypeString + " (" + value.valueString + ")";
                    retAllSlots.push(myCreateSlotFunction(variableText, backgroundColorGreen));
                }
            }
        }
        //Adding the result group to the canvas
        retAllSlots.forEach(stackFrameSlot => {
            this.canvas.add(stackFrameSlot);
        });

        //Locking the movement of the items
        this.lockAllItems();

        //Returning the future start position (for easy drawing of other stackframes under this one)
        return startPosY;
    }

    //More general method that prevents the user from misusing the drawing methods
    drawVariable(variableToDraw: myDataModelStructures.myVariable, startPosX?: number, startPosY?: number) {
        if (variableToDraw.dataTypeString == "string")
            this.drawString(variableToDraw, startPosX, startPosY);
        else if (variableToDraw.dataTypeString == "char")
            this.drawChar(variableToDraw, startPosX, startPosY);
        else if (variableToDraw.dataTypeString == "number" ||
            variableToDraw.dataTypeString == "int" ||
            variableToDraw.dataTypeString == "float")
            this.drawNumber(variableToDraw, startPosX, startPosY);
        else if (variableToDraw.dataTypeString == "bool" ||
            variableToDraw.dataTypeString == "boolean")
            this.drawBool(variableToDraw, startPosX, startPosY)
        else
            return;
    }

    drawString(stringToDraw: myDataModelStructures.myVariable, startPosX = 10, startPosY = 10) {
        //Checking if the variable is really a string
        if (stringToDraw.dataTypeString != "string")
            return;

        //Default values
        let textFill = "black";

        //Drawing the slot's text
        let finalString = stringToDraw.variableName + " : \"" + stringToDraw.valueString + "\"";
        let fabricSlotText = new fabric.Text(finalString, {
            left: startPosX,
            top: startPosY,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        let resultFabricGroup = new fabric.Group([fabricSlotText]);

        //Adding the result group to the canvas
        this.canvas.add(resultFabricGroup);

        //Locking the movement of the items
        this.lockAllItems();
    }

    drawChar(charToDraw: myDataModelStructures.myVariable, startPosX = 10, startPosY = 10) {
        //Checking if the variable is really a char
        if (charToDraw.dataTypeString != "char")
            return;

        //Default values
        let textFill = "black";

        //Drawing the slot's text
        let finalString = charToDraw.variableName + " : \'" + charToDraw.valueString + "\'";
        let fabricSlotText = new fabric.Text(finalString, {
            left: startPosX,
            top: startPosY,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        let resultFabricGroup = new fabric.Group([fabricSlotText]);

        //Adding the result group to the canvas
        this.canvas.add(resultFabricGroup);

        //Locking the movement of the items
        this.lockAllItems();
    }

    drawNumber(numberToDraw: myDataModelStructures.myVariable, startPosX = 10, startPosY = 10) {
        //Checking if the variable is really a number
        if (numberToDraw.dataTypeString != "number" &&
            numberToDraw.dataTypeString != "int" &&
            numberToDraw.dataTypeString != "float")
            return;

        //Default values
        let textFill = "black";

        //Drawing the slot's text
        let finalString = numberToDraw.variableName + " : " + numberToDraw.valueString;
        let fabricSlotText = new fabric.Text(finalString, {
            left: startPosX,
            top: startPosY,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        let resultFabricGroup = new fabric.Group([fabricSlotText]);

        //Adding the result group to the canvas
        this.canvas.add(resultFabricGroup);

        //Locking the movement of the items
        this.lockAllItems();
    }

    drawBool(boolToDraw: myDataModelStructures.myVariable, startPosX = 10, startPosY = 10) {
        //Checking if the variable is really a number
        if (boolToDraw.dataTypeString != "bool" &&
            boolToDraw.dataTypeString != "boolean")
            return;

        //Default values
        let textFill = "black";

        //Drawing the slot's text
        let tempValueString = boolToDraw.valueString = "1" ? "true" : "false";
        let finalString = boolToDraw.variableName + " : " + tempValueString;
        let fabricSlotText = new fabric.Text(finalString, {
            left: startPosX,
            top: startPosY,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        let resultFabricGroup = new fabric.Group([fabricSlotText]);

        //Adding the result group to the canvas
        this.canvas.add(resultFabricGroup);

        //Locking the movement of the items
        this.lockAllItems();
    }
}
