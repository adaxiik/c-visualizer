import { fabric } from "fabric";
import * as myDataModelStructures from "./dataModelStructures";

export class myFabricDrawingModule {
    canvas: fabric.Canvas;

    constructor(canvasName: string) {
        this.canvas = new fabric.Canvas(canvasName);
        //To have it a bit larger (not yet exact sizing)
        //TODO: Think the sizing throught and adjust accordingly
        this.canvas.setWidth(screen.width);
        this.canvas.setHeight(screen.height / 2);

        this.initPanning();
        this.initZooming();
    }

    initPanning() {
        //TODO: Citation? (correctly)
        //src: http://fabricjs.com/fabric-intro-part-5
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
    }

    initZooming() {
        //TODO: Citation? (correctly) 
        //src: http://fabricjs.com/fabric-intro-part-5
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
    }

    lockAllItems() {
        let allFabricItems = this.canvas.getObjects();

        allFabricItems.forEach(fabricObject => {
            fabricObject.selectable = false;
            fabricObject.hoverCursor = "default";
            fabricObject.evented = false;
        });
    }

    //TODO: Move to a separate class (something like myFabricStackFrame) with it's own drawing method
    drawStackFrame(stackFrameToDraw: myDataModelStructures.myStackFrame) {
        //Default values
        let backgroundColorBlue = '#33ccff';
        let backgroundColorGrey = '#8f8f8f';
        let backgroundColorRed = '#ff0000';
        let backgroundColorGreen = '#00ff04';
        let textFill = "black";
        let stackSlotHeight = 30;   //Height of a single "slot" in the drawn stackframe
        let stackSlotWidth = 300;   //Width of a single "slot" in the drawn stackframe
        let currentPositionX = 10;  //The position where we're drawing
        let currentPositionY = 10;  //The position where we're drawing

        //TODO: After moving to a separate class (add a method for drawing a single "slot" in the stackframe)
        let myCreateSlotFunction = function (mySlotText: string, slotBackgroundColor: string): Array<fabric.Group> {
            let resultFabricStackFrameArray = new Array<fabric.Group>;    //Result group of stackframe "slots"
            //Drawing the slot's background
            let fabricSlotBackground = new fabric.Rect({
                left: currentPositionX,
                top: currentPositionY,
                width: stackSlotWidth,
                height: stackSlotHeight,
                fill: slotBackgroundColor,

                //TODO: Change (Testing values)
                padding: 8,
                stroke: "#000000",
                strokeWidth: 2
            });
            //Drawing the slot's text
            //TODO: Calculate the positioning correctly
            let fabricSlotText = new fabric.Text(mySlotText, {
                left: currentPositionX + 4,
                top: currentPositionY + stackSlotHeight / 8,
                fill: textFill,
                fontSize: 20
            });

            //Creating the result
            let resultFabricGroup = new fabric.Group([fabricSlotBackground, fabricSlotText]);
            //Adding the "slot's" group to the result group
            resultFabricStackFrameArray.push(resultFabricGroup);

            //Moving the position, where we're drawing
            currentPositionY += stackSlotHeight;

            return resultFabricStackFrameArray;
        };

        //Creating the slots
        //TODO: Refactor and improve
        let retAllSlots = new Array<Array<fabric.Group>>();
        //Function name
        retAllSlots.push(myCreateSlotFunction(stackFrameToDraw.functionName, backgroundColorBlue));
        //Function variables
        if (stackFrameToDraw.functionVariables != null)
        {
            stackFrameToDraw.functionVariables.forEach(functionVariable => {
                let variableText = functionVariable.variableName + ": " + functionVariable.dataTypeString + " (" + functionVariable.valueString + ")";
                retAllSlots.push(myCreateSlotFunction(variableText, backgroundColorGrey));
            });
        }
        //Function parameters
        if (stackFrameToDraw.functionParameters != null)
        {
            stackFrameToDraw.functionParameters.forEach(functionParameter => {
                let variableText = functionParameter.variableName + ": " + functionParameter.dataTypeString + " (" + functionParameter.valueString + ")";
                retAllSlots.push(myCreateSlotFunction(variableText, backgroundColorGreen));
            });
        }
        //Adding the result group to the canvas
        retAllSlots.forEach(stackGroup => {
            stackGroup.forEach(stackFrameSlot => {
                this.canvas.add(stackFrameSlot);
            });
        });

        //Locking the movement of the items
        this.lockAllItems();
    }

    //TODO: Move to a separate class with it's own drawing method
    //More general method that prevents the user from misusing the drawing methods
    drawVariable(variableToDraw: myDataModelStructures.myVariable) {
        if (variableToDraw.dataTypeString == "string")
            this.drawString(variableToDraw);
        else if (variableToDraw.dataTypeString == "char")
            this.drawChar(variableToDraw);
        else if (variableToDraw.dataTypeString == "number" ||
            variableToDraw.dataTypeString == "int" ||
            variableToDraw.dataTypeString == "float")
            this.drawNumber(variableToDraw);
        else if (variableToDraw.dataTypeString == "bool" ||
            variableToDraw.dataTypeString == "boolean")
            this.drawBool(variableToDraw)
        else
            return;
    }

    drawString(stringToDraw: myDataModelStructures.myVariable) {
        //Checking if the variable is really a string
        if (stringToDraw.dataTypeString != "string")
            return;

        //Default values
        let textFill = "black";
        let currentPositionX = 30;  //The position where we're drawing
        let currentPositionY = 10;  //The position where we're drawing

        //Drawing the slot's text
        //TODO: Calculate the positioning correctly
        let finalString = stringToDraw.variableName + " : \"" + stringToDraw.valueString + "\"";
        let fabricSlotText = new fabric.Text(finalString, {
            left: currentPositionX,
            top: currentPositionY,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        let resultFabricGroup = new fabric.Group([fabricSlotText]); //TODO: Add more things to the group (like background and such)

        //Adding the result group to the canvas
        this.canvas.add(resultFabricGroup);

        //Locking the movement of the items
        this.lockAllItems();
    }

    //TODO: Move to a separate class with it's own drawing method
    drawChar(charToDraw: myDataModelStructures.myVariable) {
        //Checking if the variable is really a char
        if (charToDraw.dataTypeString != "char")
            return;

        //Default values
        let textFill = "black";
        let currentPositionX = 30;  //The position where we're drawing
        let currentPositionY = 35;  //The position where we're drawing

        //Drawing the slot's text
        //TODO: Calculate the positioning correctly
        let finalString = charToDraw.variableName + " : \'" + charToDraw.valueString + "\'";
        let fabricSlotText = new fabric.Text(finalString, {
            left: currentPositionX,
            top: currentPositionY,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        let resultFabricGroup = new fabric.Group([fabricSlotText]); //TODO: Add more things to the group (like background and such)

        //Adding the result group to the canvas
        this.canvas.add(resultFabricGroup);

        //Locking the movement of the items
        this.lockAllItems();
    }

    //TODO: Move to a separate class with it's own drawing method
    drawNumber(numberToDraw: myDataModelStructures.myVariable) {
        //Checking if the variable is really a number
        if (numberToDraw.dataTypeString != "number" &&
            numberToDraw.dataTypeString != "int" &&
            numberToDraw.dataTypeString != "float")
            return;

        //Default values
        let textFill = "black";
        let currentPositionX = 30;  //The position where we're drawing
        let currentPositionY = 60;  //The position where we're drawing

        //Drawing the slot's text
        //TODO: Calculate the positioning correctly
        let finalString = numberToDraw.variableName + " : " + numberToDraw.valueString;
        let fabricSlotText = new fabric.Text(finalString, {
            left: currentPositionX,
            top: currentPositionY,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        let resultFabricGroup = new fabric.Group([fabricSlotText]); //TODO: Add more things to the group (like background and such)

        //Adding the result group to the canvas
        this.canvas.add(resultFabricGroup);

        //Locking the movement of the items
        this.lockAllItems();
    }

    //TODO: Move to a separate class with it's own drawing method
    drawBool(boolToDraw: myDataModelStructures.myVariable) {
        //Checking if the variable is really a number
        if (boolToDraw.dataTypeString != "bool" &&
            boolToDraw.dataTypeString != "boolean")
            return;

        //Default values
        let textFill = "black";
        let currentPositionX = 30;  //The position where we're drawing
        let currentPositionY = 80;  //The position where we're drawing

        //Drawing the slot's text
        //TODO: Calculate the positioning correctly
        let tempValueString = boolToDraw.valueString = "1" ? "true" : "false";
        let finalString = boolToDraw.variableName + " : " + tempValueString;
        let fabricSlotText = new fabric.Text(finalString, {
            left: currentPositionX,
            top: currentPositionY,
            fill: textFill,
            fontSize: 20
        });

        //Creating the result
        let resultFabricGroup = new fabric.Group([fabricSlotText]); //TODO: Add more things to the group (like background and such)

        //Adding the result group to the canvas
        this.canvas.add(resultFabricGroup);

        //Locking the movement of the items
        this.lockAllItems();
    }
}

//Old testing class (left just for inspiration and not exported outside of file)
//TODO: Delete
/*
class myInt {
    value: number;

    //Values for later drawing in Fabric
    fabricGroup: fabric.Group;
    fabricObject: fabric.Circle;
    fabricText: fabric.Text;
    color: string;
    radius: number;
    posTop: number;
    posLeft: number;

    constructor(setValue: number, setPosTop: number, setPosLeft: number) {
        //Default values
        this.color = '#33ccff';
        this.radius = 30;
        
        //Set values
        this.value = setValue;
        this.posTop = setPosTop;
        this.posLeft = setPosLeft;
        
        this.fabricObject = new fabric.Circle({
            radius: this.radius,
            fill: this.color,
            top: this.posTop,
            left: this.posLeft
        })
        this.fabricText = new fabric.Text(this.value.toString(), { 
            left: this.fabricObject.left,
            top: this.fabricObject.top,
            fill: 'black'
        });
        this.fabricGroup = new fabric.Group([this.fabricObject, this.fabricText]);
    }

    drawObject(drawIntoCanvas: fabric.Canvas) {
        drawIntoCanvas.add(this.fabricGroup);
    }
}
*/