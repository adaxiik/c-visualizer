"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
//Importing my htmlFile
const testHtmlFile_1 = require("./testHtmlFile");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "bakalarkatestextension" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('bakalarkatestextension.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from BakalarkaTestExtension!');
    });
    //src: https://code.visualstudio.com/api/extension-guides/webview
    let testPreviewCommand = vscode.commands.registerCommand('bakalarkatestextension.showPreview', () => {
        // Create and show a new webview
        const panel = vscode.window.createWebviewPanel('bakalarkaTestExtension', // Identifies the type of the webview. Used internally
        'Bakalarka Test Extension - dog preview', // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
        {
            enableScripts: true
        } // Webview options
        );
        panel.webview.html = getWebviewContent();
        //delay(3000);	//Wait for 3 seconds - not working
        var messageString = "oogabooga";
        setInterval(() => {
            panel.webview.postMessage({ messageData: messageString });
            messageString = messageString + "o";
        }, 1000);
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(testPreviewCommand);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function getWebviewContent() {
    return testHtmlFile_1.default;
}
/*
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
*/ 
//# sourceMappingURL=extension.js.map