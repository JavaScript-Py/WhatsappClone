

export class ClassEvent {

	constructor() {
		if (!this._events) this._events = {};
	}

	on(eventName, fn) {

		if (!this._events[eventName]) {
			this._events[eventName] = new Array();

		}

		this._events[eventName].push(fn);

	

		console.log("this._events ON", this._events[eventName]);

	}

	trigger() {

		let args = [...arguments];

		console.log("args", args);

		let eventName = args.shift();

		console.log("args", args);

		console.log("this._events", this._events);
		console.log("eventName", eventName);
		console.log("this._events[eventName]", this._events[eventName]);
		console.log(typeof this._events[eventName], "typeof this._events[eventName]");

		if (Array.isArray(this._events[eventName])) {

			console.log("this._events[eventName] instanceof Array");

			this._events[eventName].forEach(fn => {
				console.log("fn", fn);

				fn.apply(null, args);

			});
		}
	}
}