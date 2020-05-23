// const ioHook = require("iohook");

// var isStartHook = false;
// var isStartMouseMove = false;
// var mouseMoveFn = null;
// var isStartKeyUp = false;
// var keyUpfn = null;

// function mouseMove(e) {
// 	mouseMoveFn && mouseMoveFn(e);
// }

// function keyUp(e) {
// 	keyUpfn && keyUpfn(e);
// }

// function startHook() {
// 	if (isStartHook) return;
// 	isStartHook = true;
// 	ioHook.start();
// }

// function stopHook() {
// 	if (!isStartHook) return;
// 	isStartHook = false;

// 	ioHook.stop();
// }

// function unload() {
// 	ioHook.unload();
// }

// function startMouseMove(fn) {
// 	if (isStartMouseMove) return;
// 	isStartMouseMove = true;
// 	mouseMoveFn = fn;
// 	ioHook.on("mousemove", mouseMove);
// }

// function stopMouseMove(fn) {
// 	if (!isStartMouseMove) return;
// 	isStartMouseMove = false;
// 	mouseMoveFn = null;
// 	ioHook.off("mousemove", mouseMove);
// }

// function startKeyUp(fn) {
// 	if (isStartKeyUp) return;
// 	isStartKeyUp = true;
// 	keyUpfn = fn;
// 	ioHook.on("keyup", keyUp);
// }

// function stopKeyUp(fn) {
// 	if (!isStartKeyUp) return;
// 	isStartKeyUp = false;
// 	keyUpfn = null;
// 	ioHook.off("keyup", keyUp);
// }

// module.exports = {
// 	startHook,
// 	stopHook,
// 	startMouseMove,
// 	stopMouseMove,
// 	startKeyUp,
// 	stopKeyUp,
// 	unload,
// };
