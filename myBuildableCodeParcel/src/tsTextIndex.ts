import { fabric } from "fabric";

console.log("[debug] Before drawing a circle");
var canvas = new fabric.Canvas('myCanvas');
canvas.add(new fabric.Circle({ radius: 30, fill: '#33ccff', top: 100, left: 100 }));
console.log("[debug] After drawing a circle");