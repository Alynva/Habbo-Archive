import util from "node:util"

import { HPacket } from "gnode-api"

export default class FloorHeightMap {
	static get SEPARATOR() { return '\r' }
	static get VOID_HEIGHT() { return -110 }

	text = ""
	/** @type {Number} */
	width
	/** @type {Number} */
	height
	/**
	 * @type {Number}
	 * @description Value `-1` means disabled, using default/dynamic behavior. Setting X in the game, this value will be X-1 (starts at `0`)
	 */
	fixedWallsHeight
	/** @type {32|64} */
	scale

	/** @type {Number[][]} */
	#tilesHeight

	/** @type {Number} */
	tilesCount

	/** @param {HPacket} packet */
	constructor(packet, resetReadIndex = true) {
		if (!(packet instanceof HPacket)) {
			throw new Error("FloorHeightMap.constructor: packet must be an instance of HPacket");
		}

		let zoom = false
		;[zoom, this.fixedWallsHeight, this.text] = packet.read('BiS')

		this.scale = zoom ? 32 : 64

		const lines = this.text.split(FloorHeightMap.SEPARATOR)

		this.width = Math.max(...lines.map(x => x.length))
		this.height = lines.length

		this.#fillTilesHeight()

		this.tilesCount = this.text
			.toLowerCase()
			.replace(/x/g, '')
			.replace(new RegExp(FloorHeightMap.SEPARATOR, 'g'), '')
			.length
	}
	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
		return `${indent}FloorHeightMap { ...TODO... }`
	}

	#fillTilesHeight() {
		this.#tilesHeight = new Array(this.height).fill().map(_ => new Array(this.width).fill(FloorHeightMap.VOID_HEIGHT))
		
		const lines = this.text.split(FloorHeightMap.SEPARATOR)
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]
			const tileLine = this.#tilesHeight[i]

			if (line.length === 0) continue

			for (let j = 0; j < line.length; j++) {
				const char = line[j]
				if (char.toLowerCase() !== 'x') {
					tileLine[j] = parseInt(char, 32)
				}
			}
		}
	}

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	getTileHeight(x, y) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height)
			return FloorHeightMap.VOID_HEIGHT
		return this.#tilesHeight[y][x]
	}
}
