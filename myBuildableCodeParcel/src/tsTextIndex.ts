import { fabric } from "fabric";
//import * from "./dataStructuresTest.ts"; //For now moved here
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
        
        this.fabricObject = new fabric.Circle({ radius: this.radius, fill: this.color, top: this.posTop, left: this.posLeft })
        this.fabricText = new fabric.Text(this.value.toString(), { left: this.fabricObject.left, top: this.fabricObject.top, fill: 'black' });
        this.fabricGroup = new fabric.Group([this.fabricObject, this.fabricText]);
    }

    drawObject(drawIntoCanvas: fabric.Canvas) {
        drawIntoCanvas.add(this.fabricGroup);
    }
}

console.log("[debug] Initialzing Fabric");
var canvas = new fabric.Canvas('myCanvas');

console.log("[debug] Creating a first myInt");
var myInt1 = new MyInt(12, 100, 100);
myInt1.drawObject(canvas);
console.log("[debug] After drawing a the first myInt");