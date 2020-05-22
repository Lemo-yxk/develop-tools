var windows = {};

var names = {};

var manager = {
	set(name, window) {
		if (names[name]) throw "name is exists";
		names[name] = window.id;
		windows[window.id] = window;
	},
	delete(name) {
		var id = names[name];
		delete names[name];
		delete windows[id];
	},
	get(name) {
		var id = names[name];
		return windows[id];
	},
};

module.exports = manager;
