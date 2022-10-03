import { HPacket } from 'gnode-api'
import { EventEmitter } from 'node:events'
import WebSocket, { WebSocketServer } from 'ws'

export default class WebsiteConnection extends EventEmitter {
	/** @type {WebSocketServer} */
	#websiteExtensionServer

	/** @type {WebSocket} */
	#socket

	get port() {
		return 7247
	}

	run() {
		this.#websiteExtensionServer = new WebSocketServer({ port: this.port }, () => {
			this.emit("init", this.#websiteExtensionServer.address().port)
		})
		this.#websiteExtensionServer.on('error', (err) => {
			console.error(err)
		})

		this.#websiteExtensionServer.on('connection', this.#onConnection.bind(this))

	}

	/** @param {WebSocket} socket */
	#onConnection(socket) {
		socket.on('message', this.#onMessage)
		socket.on('close', this.#onClose.bind(this))

		socket.send(JSON.stringify({
			type: "HELLO"
		}))

		this.disconnect()

		this.#socket = socket

		this.emit("connectionChange", true)
	}

	#onClose() {
		this.emit('connectionChange', false)
	}

	/** @param {WebSocket.RawData} message */
	#onMessage(message) {
		const parsedMessage = parseMessage(message)

		switch (parsedMessage.type) {
			case "HELLO":
				console.log("Friendly handshake")
				break;
		}
	}

	disconnect() {
		if (this.#socket instanceof WebSocket) this.#socket.close()
	}

	/**
	 * @param {import('../composers/SnapshotComposer').SnapshotSummary} summary
	 * @param {HPacket} roomData
	 */
	async notifyRoom(summary, roomData) {
		this.#socket.send(JSON.stringify({
			type: "ROOM_VISITED",
			summary,
			data: Array.from(roomData.toBytes()),
		}))
	}
}

function parseMessage(message) {
	try {
		return JSON.parse(message)
	} catch {
		return "[Invalid message]"
	}
}