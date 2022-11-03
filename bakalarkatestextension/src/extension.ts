// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	//Global panel (to be accessible)
	let currentPanel: vscode.WebviewPanel;

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
		currentPanel = vscode.window.createWebviewPanel(
			'bakalarkaTestExtension', // Identifies the type of the webview. Used internally
			'Bakalarka Test Extension - dog preview', // Title of the panel displayed to the user
			vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')] //Allowing including only files from the "src" folder*/
			} // Webview options
		);

		//Getting the WebView HTML
		currentPanel.webview.html = getWebviewContent(currentPanel.webview, context);

		//Registering the debug adapter
		vscode.debug.registerDebugAdapterTrackerFactory('*', {
			createDebugAdapterTracker(session: vscode.DebugSession) {
			  return {
				onWillReceiveMessage: m => console.log(`bakalarkaTestExtension> ${JSON.stringify(m, undefined, 2)}`),
				onDidSendMessage: m => console.log(`bakalarkaTestExtension< ${JSON.stringify(m, undefined, 2)}`)
			  };
			}
		  });

		//Periodically sending "o" message to the WebView
		var messageString = "oogabooga";
		setInterval(() => {
			currentPanel.webview.postMessage({ messageData: messageString });
			messageString = "o";
        }, 1000);
	});

	//Second function (to reset the text - testing calling other functions that affect the panel)
	let resetTextCommand = vscode.commands.registerCommand('bakalarkatestextension.resetTextCommand', () => {
		if (!currentPanel) {
		  return;
		}
  
		// Send a message to our webview.
		// You can send any JSON serializable data.
		currentPanel.webview.postMessage({ command: 'resetText' });
	  });

	//Third function (to add a circle to the canvas - testing calling drawing from the outside script)
	let drawCircleCommand = vscode.commands.registerCommand('bakalarkatestextension.drawCircleCommand', () => {
		if (!currentPanel) {
		  return;
		}
  
		// Send a message to our webview.
		// You can send any JSON serializable data.
		currentPanel.webview.postMessage({ command: 'drawCircle' });
	  });  

	context.subscriptions.push(disposable);
	context.subscriptions.push(testPreviewCommand);
	context.subscriptions.push(resetTextCommand);
	context.subscriptions.push(drawCircleCommand);
}


// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(webview: vscode.Webview, context: any)
{
	let retHtml: string = ``;
  
	//Preparing the paths
  	const myScript = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src', 'testHtmlFileScript.js'));   // <--- 'src' is the folder where the .js file is stored
  	const fabricLibraryScript = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src', 'fabric.min.js'));
  	const rawHtml = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src', 'testHtmlFile.html'));

	//Loading the resources
	retHtml = fs.readFileSync(rawHtml.fsPath, 'utf8');

	//Replacing the key sequences
	retHtml = retHtml.replace("${myScript}", myScript.toString(true));
	retHtml = retHtml.replace("${fabricLibraryScript}", fabricLibraryScript.toString(true));

	return retHtml;
}