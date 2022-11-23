import { fabric } from "fabric";
import { MyInt } from "./dataStructuresTest";


console.log("[DEBUG] Initialzing Fabric");
var canvas = new fabric.Canvas('myCanvas');

console.log("[DEBUG] Creating a first MyInt");
var myInt1 = new MyInt(12, 100, 100);
myInt1.drawObject(canvas);
console.log("[DEBUG] After drawing a the first MyInt");