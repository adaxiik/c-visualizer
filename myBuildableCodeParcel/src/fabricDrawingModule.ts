import { fabric } from "fabric";
import * as myDataModelStructures from "./dataModelStructures";

export class myFabricDrawingModule {
    canvas: fabric.Canvas;

    constructor(canvasName: string) {
        this.canvas = new fabric.Canvas(canvasName);
        //To have it a bit larger (not yet exact sizing)
        //TODO: Think the sizing throught and adjust accordingly
        this.canvas.setWidth(screen.width);
        this.canvas.setHeight(screen.height/2);
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
        let stackSlotWidth = 200;   //Width of a single "slot" in the drawn stackframe
        let currentPositionX = 10;  //The position where we're drawing
        let currentPositionY = 10;  //The position where we're drawing

        //TODO: After moving to a separate class (add a method for drawing a single "slot" in the stackframe)
        let myCreateSlotFunction = function(myVariableName: string, slotBackgroundColor: string): Array<fabric.Group> {
            let resultFabricStackFrameArray = new Array<fabric.Group>;    //Result group of stackframe "slots"
            //Drawing the slot's background
            let fabricSlotBackground = new fabric.Rect({
                left: currentPositionX,
                top: currentPositionY,
                width: stackSlotWidth,
                height: stackSlotHeight,
                fill:slotBackgroundColor,

                //TODO: Change (Testing values)
                padding: 8,
                stroke: "#000000",
                strokeWidth: 2
            });
            //Drawing the slot's text
            let fabricSlotText = new fabric.Text(myVariableName, { 
                left: currentPositionX + 4,
                top: currentPositionY + stackSlotHeight/8,
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
        let retAllSlots = new Array<Array<fabric.Group>>;
        retAllSlots.push(myCreateSlotFunction(stackFrameToDraw.functionName, backgroundColorBlue));
        stackFrameToDraw.functionVariables.forEach(functionVariable => {
            retAllSlots.push(myCreateSlotFunction(functionVariable.variableName, backgroundColorGrey)); 
        });
        retAllSlots.push(myCreateSlotFunction(stackFrameToDraw.returnAddress, backgroundColorRed));
        stackFrameToDraw.functionParameters.forEach(functionParameter => {
            retAllSlots.push(myCreateSlotFunction(functionParameter.variableName, backgroundColorGreen)); 
        });
        //Adding the result group to the canvas
        retAllSlots.forEach(stackGroup => {
           stackGroup.forEach(stackFrameSlot => {
            this.canvas.add(stackFrameSlot);
           }); 
        });
    }
}

//Old testing class (left just for inspiration and not exported outside of file)
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