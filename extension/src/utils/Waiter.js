import { EventEmitter } from 'node:events'

import { Extension, HDirection, HMessage } from "gnode-api"

const sleep = ms => new Promise(res => setTimeout(res, ms))

/**
 * Usage:
 * ```
 * const waiter = new Waiter(ext)
 * waiter.timeout = 60 * 1000 // optional, defaults to 10.000
 * waiter.when(HDirection.TOSERVER, "MoveAvatar")
 * 	.then(hMessage => console.log(hMessage))
 * 	.catch(err => console.error(err))
 * ```
 */
export default class Waiter {
	/** @type {Extension} */
	#ext

	#events = new EventEmitter()

	timeout = 10 * 1000

	#logger = false

	/** @param {Extension} ext */
	constructor(ext) {
		if (!ext) throw new Error("You must pass the extension when creating a new Waiter.")

		this.#ext = ext
		ext.interceptAll(HDirection.TOCLIENT, this.#interceptHandler.bind(this))
		ext.interceptAll(HDirection.TOSERVER, this.#interceptHandler.bind(this))
	}

	/** @param {HMessage} message */
	#interceptHandler(message) {
		const packetNames = this.#getPacketNames(message)

		if (!packetNames || !packetNames.length) {
			console.warn(`Not packet info available or unknown packet.`)
		}

		for (const name of packetNames) {
			if (this.#logger) {
				this.#printLastLine(`[Waiter log] ${message.getDestination()}: ${name}`)
			}

			this.#events.emit(name, message)
		}
	}

	/** @param {HMessage} message */
	#getPacketNames(message) {
		const direction = message.getDestination()
		const packet = message.getPacket()

		const packetInfoManager = this.#ext.getPacketInfoManager()

		if (!packetInfoManager) {
			return
		}

		const packetInfos = packetInfoManager.getAllPacketInfoFromHeaderId(direction, packet.headerId())

		const packetNames = packetInfos
			.filter((x, i, a) => i.name !== null && i === a.indexOf(x))
			.map(i => `${i.name}`)

		return packetNames
	}

	#printLastLine(text) {
		process.stdout.cursorTo(0);
		process.stdout.moveCursor(0, -1)
		process.stdout.clearScreenDown();
		process.stdout.write(text + '\n');
	}

	/**
	 * @param {HDirection} direction
	 * @param {String} packetName
	 */
	async when(direction, packetName) {
		/** @type {Promise<HMessage>} */
		const promise = new Promise(async (res, rej) => {
			let completed = false

			/** @param {HMessage} message */
			function listener(message) {
				if (message.getDestination() === direction) {
					completed = true
					res(message)
				}
			}

			this.#events.once(packetName, listener)

			await sleep(this.timeout)

			this.#events.removeListener(packetName, listener)

			if (completed) return

			rej(new Error(`Waiting for ${packetName} timed out.`))
		})

		return promise
	}
}
