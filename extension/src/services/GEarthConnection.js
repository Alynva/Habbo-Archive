import { EventEmitter } from 'node:events'

import { Extension, HPacket, HDirection } from 'gnode-api'

const extensionInfo = {
	name: "Habbo Archive",
	description: "Wayback Machine Habbo Aarchive",
	version: "1.0.0",
	author: "Alynva",
}

export default class GEarthConnection extends EventEmitter {
	run() {
		const ext = new Extension(extensionInfo)

		ext.on('init', () => {
			this.emit("gearthConnection")
		})

		ext.on('connect', host => {
			ext.writeToConsole(`Host detected: ${host}`)
			this.emit('habboConnection')
		})

		ext.run()
	}
}