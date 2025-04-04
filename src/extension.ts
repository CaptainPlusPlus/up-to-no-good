import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function processFiles(dir: string, search: RegExp, replace: string) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      vscode.window.showErrorMessage(`Error reading directory: ${dir}`);
      return;
    }
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          vscode.window.showErrorMessage(`Error reading file stats: ${fullPath}`);
          return;
        }
        if (stats.isDirectory()) {
          processFiles(fullPath, search, replace);
        } else if (stats.isFile()) {
          fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
              vscode.window.showErrorMessage(`Error reading file: ${fullPath}`);
              return;
            }
            const result = data.replace(search, replace);
            fs.writeFile(fullPath, result, 'utf8', err => {
              if (err) {
                vscode.window.showErrorMessage(`Error writing file: ${fullPath}`);
              }
            });
          });
        }
      });
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  const stupifyCommand = vscode.commands.registerCommand('i-am-a-bad-friend.stupify', () => {
    if (vscode.workspace.workspaceFolders) {
      vscode.workspace.workspaceFolders.forEach(folder => {
        processFiles(folder.uri.fsPath, /;/g, ';');
      });
      vscode.window.showInformationMessage('Semicolons converted to Greek question marks.');
    } else {
      vscode.window.showWarningMessage('No workspace folder is open.');
    }
  });

  const reperoCommand = vscode.commands.registerCommand('i-am-a-bad-friend.repero', () => {
    if (vscode.workspace.workspaceFolders) {
      vscode.workspace.workspaceFolders.forEach(folder => {
        processFiles(folder.uri.fsPath, /;/g, ';');
      });
      vscode.window.showInformationMessage('Greek question marks converted back to semicolons.');
    } else {
      vscode.window.showWarningMessage('No workspace folder is open.');
    }
  });

  context.subscriptions.push(stupifyCommand, reperoCommand);
}

export function deactivate() {}
