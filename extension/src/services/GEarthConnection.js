import path from 'node:path'
import { EventEmitter } from 'node:events'

import { Extension, HPacket, HDirection } from 'gnode-api'
import GetGuestRoomResult from '../parsers/in_GetGuestRoomResult.js'
import Snapshot from 'habbo-archive-snapshot'

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

	/** @type {Snapshot} */
	#snapshot

	run() {
		this.#ext = new Extension(extensionInfo)

		this.#ext.on('init', () => {
			this.emit("gearthConnection", true)
		})

		this.#ext.on('connect', host => {
			this.#ext.writeToConsole(`Host detected: ${host}`)
			Snapshot.loadFurniData(host).then(() => console.log('furnidata loaded!'))
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

		this.#ext.interceptByNameOrHash(HDirection.TOCLIENT, "OpenConnection", hMessage => {
			// this.#snapshot = new Snapshot()
			
			this.#ext.sendToServer(new HPacket("{out:InfoRetrieve}"))
		})

		this.#interceptPackets()

		this.#ext.run()
	}

	#interceptPackets() {
		const packets = ["RoomReady", "RoomEntryTile", "FloorHeightMap", "Users", "Objects", "Items", "GetGuestRoomResult", "UserObject"]

		for (const packetName of packets) {
			this.#ext.interceptByNameOrHash(HDirection.TOCLIENT, packetName, hMessage => {
				if (packetName === 'RoomReady') this.#ext.sendToServer(new HPacket("{out:InfoRetrieve}"))

				const packet = hMessage.getPacket()

				if (!this.#snapshot) this.#snapshot = new Snapshot()

				// TODO: for "in_Users", the list should be appended and filtered to only bots and pets
				this.#snapshot.rawPackets['in_' + packetName] = packet
				this.#checkSnapshotReady()
			})
		}
	}

	async #checkSnapshotReady() {
		if (this.#snapshot.ready && !this.#snapshot.locked) {
			this.#snapshot.locked = true

			const folderPath = path.join(process.cwd(), '..', 'snapshots', 'v' + Snapshot.version)
			await this.#snapshot.saveToFile(folderPath)

			this.emit("snapshotReady", this.#snapshot.id)

			this.#snapshot = new Snapshot()

			this.roomNotifiedAlert()
		}
	}

	roomNotifiedAlert() {
		if (!this.#habboConnected) return

		this.#ext.sendToClient(new HPacket("{in:Chat}{i:-1}{s:\"Room ready to be save at https://habbo-archive.web.app/ !\"}{i:0}{i:30}{i:0}{i:-1}"))
	}
}