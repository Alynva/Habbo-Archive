import fs from 'node:fs'
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
			this.#snapshot = new Snapshot()
			
			this.#ext.sendToServer(new HPacket("{out:InfoRetrieve}"))
		})

		this.#interceptPackets()

		this.#ext.run()
	}

	#interceptPackets() {
		const packets = ["RoomReady", "RoomEntryTile", "FloorHeightMap", "Users", "Objects", "Items", "GetGuestRoomResult", "UserObject"]

		for (const packetName of packets) {
			this.#ext.interceptByNameOrHash(HDirection.TOCLIENT, packetName, hMessage => {
				const packet = hMessage.getPacket()

				// TODO: for "in_Users", the list should be appended
				this.#snapshot.rawPackets['in_' + packetName] = packet
				this.#checkSnapshotReady()
			})
		}
	}

	async #checkSnapshotReady() {
		if (this.#snapshot.ready) {
			const snapshotPacket = await this.#snapshot.compose()
			const summary = await this.#snapshot.getSummary()

			const snapshotData = {
				roomSummary: summary,
				snapshotPacket,
			}

			fs.writeFileSync(`./snapshots/${summary.timestamp}.json`, JSON.stringify({
				summary,
				data: Array.from(snapshotPacket.toBytes()),
			}))

			this.emit("snapshotReady", snapshotData)
		}
	}

	roomNotifiedAlert() {
		if (!this.#habboConnected) return

		this.#ext.sendToClient(new HPacket("{in:Chat}{i:-1}{s:\"Room ready to be save at https://habbo-archive.web.app/ !\"}{i:0}{i:30}{i:0}{i:-1}"))
	}
}