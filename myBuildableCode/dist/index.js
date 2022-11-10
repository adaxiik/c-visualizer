System.register("index", ["fabric"], function (exports_1, context_1) {
    "use strict";
    var fabric_1, canvas;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (fabric_1_1) {
                fabric_1 = fabric_1_1;
            }
        ],
        execute: function () {
            console.log("asdasdd");
            canvas = new fabric_1.fabric.Canvas('canvas');
        }
    };
});
