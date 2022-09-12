import { EventEmitter } from 'node:events'
import WebSocket, { WebSocketServer } from 'ws'

export default class WebsiteConnection extends EventEmitter {
	/** @type {WebSocketServer} */
	#websiteExtensionServer

	get port() {
		return 7247
	}

	run() {
		this.#websiteExtensionServer = new WebSocketServer({ port: this.port }, () => {
			console.log("Server started at", this.#websiteExtensionServer.address())
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

		socket.send('something')

		this.emit("connectionChange", true)
	}

	#onClose() {
		this.emit('connectionChange', false)
	}

	/** @param {WebSocket.RawData} data */
	#onMessage(data) {
		console.log('received: %s', data)
	}
}
