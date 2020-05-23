// const { BrowserWindow } = require("electron");
// const hook = require("./hook");
// const robotjs = require("robotjs");
// const Jimp = require("jimp");

// let dev = !!process.env.NODE_ENV;

// let width = 0;
// let height = 0;
// let x = 0;
// let y = 0;

// let { hx, hy } = robotjs.getScreenSize();

// var hasResize = false;

// function ResizeWindow() {
// 	if (hasResize) return;

// 	hasResize = true;

// 	let mainWindow = BrowserWindow.getAllWindows()[0];

// 	let size = mainWindow.getSize();
// 	width = size[0];
// 	height = size[1];

// 	let pos = mainWindow.getPosition();
// 	x = pos[0];
// 	y = pos[1];

// 	mainWindow.setAlwaysOnTop(true, "floating");
// 	mainWindow.setSize(dev ? 825 : 250, 250);
// 	mainWindow.setPosition(0, 0);
// 	mainWindow.resizable = false;
// }

// function ResetWindow() {
// 	if (!hasResize) return;

// 	hasResize = false;

// 	let mainWindow = BrowserWindow.getAllWindows()[0];

// 	mainWindow.setAlwaysOnTop(false, "floating");
// 	mainWindow.setSize(width, height);
// 	mainWindow.setPosition(x, y);
// 	mainWindow.resizable = true;
// }

// function StartListen(event) {
// 	hook.startHook();
// 	hook.startMouseMove((e) => mouseMove(e, event));
// 	hook.startKeyUp((e) => keyUp(e, event));
// }

// function StopListen() {
// 	hook.stopHook();
// 	hook.stopMouseMove();
// 	hook.stopKeyUp();
// }

// function mouseMove(e, event) {
// 	var color = robotjs.getPixelColor(e.x, e.y);

// 	if (e.x < 4) return;
// 	if (e.y < 4) return;
// 	if (hx - e.x < 4) return;
// 	if (hy - e.y < 4) return;

// 	var picture = robotjs.screen.capture(e.x - 4, e.y - 4, 8, 8);

// 	screenCaptureToFile(picture).then((image) => {
// 		image.getBuffer(Jimp.MIME_PNG, (err, png) => {
// 			event.sender.send("mouseMove", {
// 				x: e.x,
// 				y: e.y,
// 				color,
// 				width: picture.width,
// 				height: picture.height,
// 				image: png.toString("base64"),
// 			});
// 		});
// 	});
// }

// function keyUp(e, event) {
// 	event.sender.send("keyUp", e);
// }

// module.exports = {
// 	ResizeWindow,
// 	ResetWindow,
// 	StartListen,
// 	StopListen,
// };

// function screenCaptureToFile(robotScreenPic) {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			const image = new Jimp(robotScreenPic.width, robotScreenPic.height);
// 			let pos = 0;
// 			image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
// 				/* eslint-disable no-plusplus */
// 				image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++);
// 				image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++);
// 				image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++);
// 				image.bitmap.data[idx + 3] = robotScreenPic.image.readUInt8(pos++);
// 				/* eslint-enable no-plusplus */
// 			});
// 			resolve(image);
// 		} catch (e) {
// 			console.error(e);
// 			reject(e);
// 		}
// 	});
// }

const { BrowserWindow } = require("electron");

let dev = !!process.env.NODE_ENV;

let width = 0;
let height = 0;
let x = 0;
let y = 0;

var hasResize = false;

function ResizeWindow() {
	if (hasResize) return;

	hasResize = true;

	let mainWindow = BrowserWindow.getAllWindows()[0];

	let size = mainWindow.getSize();
	width = size[0];
	height = size[1];

	let pos = mainWindow.getPosition();
	x = pos[0];
	y = pos[1];

	mainWindow.setAlwaysOnTop(true, "floating");
	mainWindow.setSize(dev ? 825 : 250, 250);
	mainWindow.setPosition(0, 0);
	mainWindow.resizable = false;
}

function ResetWindow() {
	if (!hasResize) return;

	hasResize = false;

	let mainWindow = BrowserWindow.getAllWindows()[0];

	mainWindow.setAlwaysOnTop(false, "floating");
	mainWindow.setSize(width, height);
	mainWindow.setPosition(x, y);
	mainWindow.resizable = true;
}

module.exports = {
	ResizeWindow,
	ResetWindow,
};
