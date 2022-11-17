import { fabric } from "fabric";
import { MyInt } from "./dataStructuresTest";


console.log("[debug] Initialzing Fabric");
var canvas = new fabric.Canvas('myCanvas');

console.log("[debug] Creating a first myInt");
var myInt1 = new MyInt(12, 100, 100);
myInt1.drawObject(canvas);
console.log("[debug] After drawing a the first myInt");