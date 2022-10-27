"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
//import * as path from 'path';
//Importing my htmlFile
const testHtmlFile_1 = require("./testHtmlFile");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    //Global panel (to be accessible)
    let currentPanel;
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
        currentPanel = vscode.window.createWebviewPanel('bakalarkaTestExtension', // Identifies the type of the webview. Used internally
        'Bakalarka Test Extension - dog preview', // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
        {
            enableScripts: true
        } // Webview options
        );
        /*,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src'))] //Allowing including only files from the "src" folder*/
        //Testing including the HTML from a HTML file
        /*
        const onDiskPath = vscode.Uri.file(
            path.join(context.extensionPath, 'src', 'testHtmlFile2.html')
          );

        const htmlSrc = panel.webview.asWebviewUri(onDiskPath);

        panel.webview.html = getWebviewContent(htmlSrc);
        */
        currentPanel.webview.html = getWebviewContent();
        var messageString = "oogabooga";
        setInterval(() => {
            currentPanel.webview.postMessage({ messageData: messageString });
            messageString = "o";
        }, 1000);
    });
    //Second function (to reset the text - testing calling other functions that affect the panel)
    let resetTextcommand = vscode.commands.registerCommand('bakalarkatestextension.resetTextcommand', () => {
        if (!currentPanel) {
            return;
        }
        // Send a message to our webview.
        // You can send any JSON serializable data.
        currentPanel.webview.postMessage({ command: 'resetText' });
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(testPreviewCommand);
    context.subscriptions.push(resetTextcommand);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function getWebviewContent() {
    return testHtmlFile_1.default;
}
//# sourceMappingURL=extension.js.map