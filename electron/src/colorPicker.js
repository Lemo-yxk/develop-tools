const { BrowserWindow } = require("electron");

let mainWindow = BrowserWindow.getAllWindows()[0];

let width = 0;
let height = 0;
let x = 0;
let y = 0;

function ResizeWindow() {
	let size = mainWindow.getSize();
	width = size[0];
	height = size[1];

	let pos = mainWindow.getPosition();
	x = pos[0];
	y = pos[1];

	mainWindow.setAlwaysOnTop(true, "floating");
	mainWindow.setSize(250, 250);
	mainWindow.setPosition(0, 0);
	mainWindow.resizable = false;
}

function ResetWindow() {
	mainWindow.setAlwaysOnTop(false, "floating");
	mainWindow.setSize(width, height);
	mainWindow.setPosition(x, y);
	mainWindow.resizable = true;
}

module.exports = {
	ResizeWindow,
	ResetWindow,
};
