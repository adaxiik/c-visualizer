import { fabric } from "fabric";
import * as myDataModelStructures from "./dataModelStructures";

export class myFabricDrawingModule {
    canvas: fabric.Canvas;

    constructor(canvasName: string) {
        this.canvas = new fabric.Canvas(canvasName);
    }

    drawStackFrame(stackFrameToDraw: myDataModelStructures.myStackFrame) {

    }
}

//Old testing class (left just for inspiration and not exported outside of file)
class MyInt {
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