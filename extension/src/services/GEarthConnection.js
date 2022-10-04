import fs from 'node:fs'
import { EventEmitter } from 'node:events'

import { Extension, HPacket, HDirection } from 'gnode-api'
import GetGuestRoomResult from '../parsers/in_GetGuestRoomResult.js'
import Waiter from '../utils/Waiter.js'
import SnapshotComposer from '../composers/SnapshotComposer.js'
import UserObject from '../parsers/in_UserObject.js'

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

	/** @type {SnapshotComposer} */
	#snapshot

	run() {
		this.#ext = new Extension(extensionInfo)

		this.#ext.on('init', () => {
			this.emit("gearthConnection", true)
		})

		this.#ext.on('connect', host => {
			this.#ext.writeToConsole(`Host detected: ${host}`)
			this.#habboHost = host
			this.#habboConnected = true
			this.#snapshot = new SnapshotComposer(this.#habboHost)
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


			if (!packetData.enterRoom) {
				this.#snapshot = new SnapshotComposer(this.#habboHost)
				return
			}

			this.#ext.sendToServer(new HPacket("{out:InfoRetrieve}"))

			this.#snapshot.in_GetGuestRoomResult = packet
			this.#checkSnapshotReady()
		})

		this.#ext.interceptByNameOrHash(HDirection.TOCLIENT, "UserObject", hMessage => {
			const packet = hMessage.getPacket()

			this.#snapshot.in_UserObject = packet
			this.#checkSnapshotReady()
		})

		this.#ext.interceptByNameOrHash(HDirection.TOCLIENT, "Objects", hMessage => {
			const packet = hMessage.getPacket()

			// console.log(this)
			this.#snapshot.in_Objects = packet
			this.#checkSnapshotReady()
		})

		this.#ext.interceptByNameOrHash(HDirection.TOCLIENT, "Items", hMessage => {
			const packet = hMessage.getPacket()

			this.#snapshot.in_Items = packet
			this.#checkSnapshotReady()
		})

		this.#ext.run()
	}

	#checkSnapshotReady() {
		if (this.#snapshot.ready) {
			const snapshotPacket = this.#snapshot.response || this.#snapshot.compose()
			const roomSummary = this.#snapshot.summary

			const snapshotData = {
				roomSummary,
				snapshotPacket,
			}

			fs.writeFileSync(`./snapshots/${roomSummary.timestamp}.json`, JSON.stringify({
				summary: roomSummary,
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