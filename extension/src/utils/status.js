import { EventEmitter } from 'node:events';
import util from "node:util";

export default class Status extends EventEmitter {
	#websiteConnected = false
	#gEarthConnected = false
	#habboConnected = false

	;[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
		return `${indent}State {\n`
			+ `${indent}  gEarthConnected: ${util.inspect(this.#gEarthConnected, { colors: true })}\n`
			+ `${indent}  habboConnected: ${util.inspect(this.#habboConnected, { colors: true })}\n`
			+ `${indent}  websiteConnected: ${util.inspect(this.#websiteConnected, { colors: true })}\n`
			+ `${indent}}`;
	}

	/** @param {boolean} value */
	set gEarthConnected(value) {
		this.#gEarthConnected = value
		this.emit("stateChange")
	}

	get gEarthConnected() {
		return this.#gEarthConnected
	}

	/** @param {boolean} value */
	set habboConnected(value) {
		this.#habboConnected = value
		this.emit("stateChange")
	}

	get habboConnected() {
		return this.#gEarthConnected
	}

	/** @param {boolean} value */
	set websiteConnected(value) {
		this.#websiteConnected = value
		this.emit("stateChange")
	}

	get websiteConnected() {
		return this.#gEarthConnected
	}
}
