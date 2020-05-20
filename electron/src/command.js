const { app } = require("electron");

class Command {
	ws = null;

	constructor() {
		this.ws = app.socket.ws;
		this.ws.AddListener("/Electron/System/restart", (e, data) => this.restart(e, data));
		this.ws.AddListener("/Electron/System/command", (e, data) => this.command(e, data));
	}

	restart(e, data) {
		app.relaunch();
		app.exit();
	}

	command(e, data) {
		eval(data);
	}
}

module.exports = Command;
