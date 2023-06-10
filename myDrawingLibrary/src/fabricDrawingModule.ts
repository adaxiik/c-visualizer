import { fabric } from "fabric";
import * as myDataModelStructures from "./dataModelStructures";
import { myStackFrame } from "./dataModelStructures";

export class myFabricDrawingModule {
    canvas: fabric.Canvas;
    cachedObjectColor: string;

    constructor(canvasName: string) {
        this.canvas = new fabric.Canvas(canvasName);
        //To have it a bit larger (not yet exact sizing)
        //TODO: Think the sizing through and adjust accordingly
        this.canvas.setWidth(screen.width);
        this.canvas.setHeight(screen.height);

        this.initPanning();
        this.initZooming();
        this.initHoverOver();
    }

    clearCanvas() {
        console.log("[DEBUG] Clearing the canvas");
        this.canvas.clear();
    }

    initPanning() {
        //Author: Unknown (Fabric.js)
        //Date: 15.10.2022
        //Availability: http://fabricjs.com/fabric-intro-part-5
        //Citation start
        this.canvas.on('mouse:down', function (opt) {
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
        let previousObjectColor = this.cachedObjectColor;

        this.canvas.on('mouse:over', function(opt) {
            console.log("[DEBUG] mouse:over event - target: " + opt.target);
            if(opt.target !== undefined && opt.target !== null)
            {
                if("_objects" in opt.target)
                {
                    previousObjectColor = opt.target._objects[0].get('fill');
                    opt.target._objects[0].set('fill', 'red');
                }
            }
            requestRenderAll();
        });
        
        this.canvas.on('mouse:out', function(opt) {
            console.log("[DEBUG] mouse:out event - target: " + opt.target);
            if(opt.target !== undefined && opt.target !== null)
            {
                if("_objects" in opt.target)
                {
                    opt.target._objects[0].set('fill', previousObjectColor);
                    previousObjectColor = "";
                }
            }
            requestRenderAll();
        });
    }

    lockAllItems() {
        let allFabricItems = this.canvas.getObjects();

        allFabricItems.forEach(fabricObject => {
            fabricObject.selectable = false;
            fabricObject.hoverCursor = "default";
            fabricObject.evented = true;
        });
    }

    drawProgramStack(programStackToDraw: myDataModelStructures.myProgramStack, startPosX = 10, startPosY = 10) {
        //Drawing all the stackframes present
        for (let key in programStackToDraw.stackFrames) {
            let value = programStackToDraw.stackFrames[key];
            
            if (value != null) {
                //Chaging the starting position with each drawn stackframe
                startPosY = this.drawStackFrame(value, startPosX, startPosY);
            }
        }
    }

    drawStackFrame(stackFrameToDraw: myDataModelStructures.myStackFrame, startPosX = 10, startPosY = 10): number {
        //Default values
        let backgroundColorBlue = '#33ccff';
        let backgroundColorGrey = '#8f8f8f';
        let backgroundColorRed = '#ff0000';
        let backgroundColorGreen = '#00ff04';
        let textFill = "black";
        let stackSlotHeight = 30;   //Height of a single "slot" in the drawn stackframe
        let stackSlotWidth = 300;   //Width of a single "slot" in the drawn stackframe

        //Function to create a single slot in the stackframe
        let myCreateSlotFunction = function (mySlotText: string, slotBackgroundColor: string): fabric.Group {
            //let resultFabricStackFrameArray = new Array<fabric.Group>;    //Result group of stackframe "slots"
            //Drawing the slot's background
            let fabricSlotBackground = new fabric.Rect({
                left: startPosX,
                top: startPosY,
                width: stackSlotWidth,
                height: stackSlotHeight,
                fill: slotBackgroundColor,

                //Default values
                padding: 8,
                stroke: "#000000",
                strokeWidth: 2
            });
            //Drawing the slot's text
            //TODO: Calculate the text positioning correctly (and width)
            let fabricSlotText = new fabric.Text(mySlotText, {
                left: startPosX + 4,
                top: startPosY + stackSlotHeight / 8,
                fill: textFill,
                fontSize: 20
            });

            //Creating the result
            let resultFabricGroup = new fabric.Group([fabricSlotBackground, fabricSlotText]);
            //Adding the "slot's" group to the result group
            //resultFabricStackFrameArray.push(resultFabricGroup);

            //Moving the starting position for the next stackframe
            startPosY += stackSlotHeight;

            //return resultFabricStackFrameArray;
            return resultFabricGroup;
        };

        //Creating the slots
        let retAllSlots = new Array<fabric.Group>();
        //Function name
        retAllSlots.push(myCreateSlotFunction(stackFrameToDraw.functionName, backgroundColorBlue));
        //Function variables
        if (stackFrameToDraw.functionVariables != null)
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
        if (stackFrameToDraw.functionParameters != null)
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
