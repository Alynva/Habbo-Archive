import { EventEmitter } from 'node:events'

import { Extension, HPacket, HDirection } from 'gnode-api'
import GetGuestRoomResult from '../parsers/GetGuestRoomResult.js'

const extensionInfo = {
	name: "Habbo Archive",
	description: "Wayback Machine Habbo Aarchive",
	version: "1.0.0",
	author: "Alynva",
}

export default class GEarthConnection extends EventEmitter {
	/** @type {Extension} */
	#ext
	#habboConnected = false
	/** @type {String} */
	#habboHost

	/** @type {Number} */
	#currentRoom

	run() {
		this.#ext = new Extension(extensionInfo)

		this.#ext.on('init', () => {
			this.emit("gearthConnection", true)
		})

		this.#ext.on('connect', host => {
			this.#ext.writeToConsole(`Host detected: ${host}`)
			this.#habboHost = host
			this.#habboConnected = true
			this.emit('habboConnection', true)
		})

		this.#ext.on('end', () => {
			this.#habboConnected = false
			this.emit('habboConnection', false)
		})

		this.#ext.on('socketdisconnect', () => {
			this.#habboConnected = false
			this.emit('gearthConnection', false)
		})

		this.#ext.interceptByNameOrHash(HDirection.TOCLIENT, "GetGuestRoomResult", hMessage => {
			const packet = hMessage.getPacket()
			const packetData = new GetGuestRoomResult(packet)
			
			if (!packetData.enterRoom) return
			
			const { flatId, roomName, ownerName, description } = packetData
			this.#currentRoom = flatId

			this.emit("entererRoom", {
				host: this.#habboHost, roomId: flatId, roomName, ownerName, description,
			})
		})

		this.#ext.run()
	}

	roomNotifiedAlert() {
		if (!this.#habboConnected) return

		this.#ext.sendToClient(new HPacket("{in:Chat}{i:-1}{s:\"Room ready tos be save at https://habbo-archive.web.app/ !\"}{i:0}{i:30}{i:0}{i:-1}"))
	}
}