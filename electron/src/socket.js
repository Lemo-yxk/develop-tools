const socket = require("lows");

class Socket {
	ws = null;
	callback = null;

	constructor() {
		this.ws = new socket({
			host: "http://127.0.0.1",
			port: "12391",
		});

		this.ws.Global = { uuid: "develop-desktop-electron" };
		this.ws.OnOpen = () => this.open();
		this.ws.OnError = (err) => this.error(err);
		this.ws.OnClose = () => this.close();

		this.ws.AddListener("/Electron/System/login", (e, data) => this.login(e, data));
	}

	open() {
		console.log("on open");
		this.ws.Emit("/Electron/System/login", { dir: __dirname });
	}

	error(err) {
		console.log("on error", err.toString());
	}

	close() {
		console.log("on close");
	}

	login(e, data) {
		this.callback && this.callback();
	}

	start(callback) {
		this.callback = callback;
		this.ws.Start();
	}
}

module.exports = Socket;
