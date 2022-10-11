import { HPacket, HWallItem } from "gnode-api";

import GetGuestRoomResult from "./parsers/in_GetGuestRoomResult.mjs";
import UserObject from "./parsers/in_UserObject.mjs";
import { HFloorItem } from "./parsers/in_Objects.mjs";
import fetchAvatarImage from "./utils/fetchAvatarImage.mjs";
import fetchFurniData from "./utils/fetchFurniData.mjs";
import fetchRoomImage from "./utils/fetchRoomImage.mjs";

/**
 * @typedef SnapshotSummary
 * @property {number} timestamp
 * @property {String} host
 * @property {Object} visitor
 * @property {Number} visitor.id
 * @property {String} visitor.name
 * @property {String} visitor.figureString
 * @property {String} visitor.figureImage
 * @property {Object} room
 * @property {Number} room.id
 * @property {String} room.name
 * @property {Boolean} room.hasGroup
 * @property {String} room.image
 * @property {Object} owner
 * @property {Number} owner.id
 * @property {String} owner.name
 * @property {String} owner.figureString
 * @property {String} owner.figureImage
 * @property {Object} furni
 * @property {Number} furni.floorCount
 * @property {Number} furni.wallCount
 * @property {Number} furni.ownersCount
 * @property {Number} furni.teleportCount
 */

/**
 * @typedef FurniType
 * @property {Number} id
 * @property {String} classname
 * @property {Number} revision
 * @property {String} category
 * @property {String} name
 * @property {String} description
 * @property {String} furniline
 */

/** @type {{ [gameHost: String]: String }} */
const DOMAINS = {
	"game-us.habbo.com": "www.habbo.com",
	"game-br.habbo.com": "www.habbo.com.br",
}
/** @type {{ [gameHost: String]: String }} */
const HOTEL_IDS = {
	"game-us.habbo.com": "us",
	"game-br.habbo.com": "br",
}

const bytes2hex = bytes => Array.from(bytes).map(i => ('0'+i.toString(16)).slice(-2)).join(' ')

export default class Snapshot {
	/** @type {{floorFurni: Map<number, FurniType>, wallFurni: Map<number, FurniType>}} */
	static #FURNI_DATA = null

	/** @type {String} */
	static #host

	/** @param {String} host */
	static async loadFurniData(host) {
		Snapshot.#host = host

		const domain = DOMAINS[Snapshot.#host]
		if (!domain) throw new Error("Unknown host, unable to map it to the API domain.")

		Snapshot.#FURNI_DATA = await fetchFurniData(domain)
	}

	/** @param {HPacket} packet */
	static parse(packet) {
		const dumbPacket = new HPacket(packet.toBytes())

		/** @type {SnapshotSummary} */
		const summary = {
			version: dumbPacket.readInteger(),
			timestamp: dumbPacket.readLong(),
			host: dumbPacket.readString(),
			visitor: {
				id: dumbPacket.readLong(),
				name: dumbPacket.readString(),
				figure: {
					string: dumbPacket.readString(),
					image: dumbPacket.readString(),
				},
			},
			room: {
				id: dumbPacket.readLong(),
				name: dumbPacket.readString(),
				hasGroup: dumbPacket.readBoolean(),
				image: dumbPacket.readString(),
			},
			owner: {
				id: dumbPacket.readLong(),
				name: dumbPacket.readString(),
				figure: {
					string: dumbPacket.readString(),
					image: dumbPacket.readString(),
				},
			},
			furni: {
				floorCount: dumbPacket.readInteger(),
				wallCount: dumbPacket.readInteger(),
				ownersCount: dumbPacket.readInteger(),
				teleportCount: dumbPacket.readInteger(),
			},
		}

		const data = {}

		while (true) {
			const packetName = dumbPacket.readString()
			const packetSize = dumbPacket.readInteger()

			if (Snapshot.requiredPackets.includes(packetName)) {
				const packetParser = Snapshot.#parsers[packetName]

				if (!packetParser) {
					dumbPacket.readIndex += packetSize
					continue
				}

				data[packetName] = packetParser(dumbPacket, false)
			} else if (packetName === 'APIData') {
				// TODO: add APIData parser
				dumbPacket.readIndex += packetSize
				break;
			} else {
				break;
			}
		}

		return { summary, data }
	}
		
	static get version() { return 3 }

	static get headerId() { return 32_767 }

	static get requiredPackets() {
		return [
			"in_RoomReady",
			"in_RoomEntryTile",
			"in_FloorHeightMap",
			"in_Users",
			"in_Objects",
			"in_Items",
			"in_GetGuestRoomResult",
			"in_UserObject"
		]
	}

	static get #parsers() {
		/** @type {{ [direction_identifier: String]: (packet: HPacket) => any }} */
		const map = {
			'in_GetGuestRoomResult': (p, ...args) => new GetGuestRoomResult(p, ...args),
			'in_UserObject': (p, ...args) => new UserObject(p, ...args),
			'in_Objects': HFloorItem.parse,
			'in_Items': HWallItem.parse,
		}
		return map
	}

	/**
	 * @typedef ParsedPackets
	 * @property {GetGuestRoomResult} in_GetGuestRoomResult
	 * @property {UserObject} in_UserObject
	 * @property {HFloorItem[]} in_Objects
	 * @property {HWallItem[]} in_Items
	 */

	/**
	 * @typedef ApiData
	 * @property {{[avatarId: Number]: { string: String, image: String }}} avatarImages
	 * @property {{floorTypes: {[classname: String]: FurniType}, wallTypes: {[classname: String]: FurniType}}} furniData
	 * @property {String} roomImage
	 */

	/** @type {{[direction_identifier: string]: HPacket}} */
	rawPackets = {}
	/** @type {ParsedPackets} */
	parsedPackets = {}
	/** @type {ApiData} */
	apiData = {
		avatarImages: {},
		furniData: {
			floorTypes: {},
			wallTypes: {},
		}
	}

	/** @type {number} */
	#timestamp

	#ownersCount = 0
	#teleportCount = 0

	locked = false

	constructor() {
		if (!Snapshot.#FURNI_DATA) {
			throw new Error("Furni data not loaded! Call `Snapshot.loadFurniData(host)` first.")
		}

		this.#timestamp = Date.now()
	}

	get ready() {
		return Snapshot.requiredPackets
			.every(p => this.rawPackets[p])
	}

	/**
	 * @param {HPacket} packet
	 * @param {(packet: HPacket) => T} parser
	 * @template T
	 */
	#parsePacket(packet, parser) {
		// let readIndex = packet.readIndex;
		// packet.resetReadIndex()
		const dumbPacket = new HPacket(packet.toBytes())
		const data = parser(dumbPacket)
		// packet.readIndex = readIndex
		return data
	}

	async parseRawPackets() {
		this.apiData.avatarImages = {}
		this.#ownersCount = 0

		for (const packetName in this.rawPackets) {
			const packet = this.rawPackets[packetName]
			const parser = Snapshot.#parsers[packetName]

			if (!parser) continue

			this.parsedPackets[packetName] = this.#parsePacket(packet, parser)

			if (packetName === 'in_GetGuestRoomResult') {
				const room = this.parsedPackets.in_GetGuestRoomResult.roomData
				if (!this.apiData.avatarImages[room.ownerId]) {
					const ownerImage = await fetchAvatarImage(room.ownerName, DOMAINS[Snapshot.#host])
					this.apiData.avatarImages[room.ownerId] = {
						string: '', // TODO: fetch profile
						image: ownerImage,
					}
				}

				this.apiData.roomImage = await fetchRoomImage(room.flatId, HOTEL_IDS[Snapshot.#host])
			} else if (packetName === 'in_Objects') {
				await this.#fetchApiFloorFurnies(this.parsedPackets[packetName])
			} else if (packetName === 'in_Items') {
				await this.#fetchApiWallFurnies(this.parsedPackets[packetName])
			} else if (packetName === 'in_UserObject') {
				const visitor = this.parsedPackets.in_UserObject
				if (!this.apiData.avatarImages[visitor.id]) {
					const visitorImage = await fetchAvatarImage(visitor.name, DOMAINS[Snapshot.#host])
					this.apiData.avatarImages[visitor.id] = {
						string: visitor.figure,
						image: visitorImage,
					}
				}
			}
		}
	}

	/** @param {HFloorItem[]} furnies */
	async #fetchApiFloorFurnies(furnies) {
		this.apiData.furniData.floorTypes = {}
		this.#teleportCount = 0

		for (const floorFurni of furnies) {
			if (!this.apiData.avatarImages[floorFurni.ownerId]) {
				const ownerImage = await fetchAvatarImage(floorFurni.ownerName, DOMAINS[Snapshot.#host])
				this.apiData.avatarImages[floorFurni.ownerId] = {
					string: '', // TODO: fetch profile
					image: ownerImage,
				}

				// TODO: fix this counter, the in_GetGuestRoomResult is received first, and fill the room owner image before its furnis are loaded
				this.#ownersCount++
			}

			const data = Snapshot.#FURNI_DATA.floorFurni.get(floorFurni.typeId)

			if (data) {
				if (!this.apiData.furniData.floorTypes[data.classname])
					this.apiData.furniData.floorTypes[data.classname] = data

				if (data.category === 'teleport') this.#teleportCount++
			}
		}
	}

	/** @param {HWallItem[]} furnies */
	async #fetchApiWallFurnies(furnies) {
		this.apiData.furniData.wallTypes = {}

		for (const floorFurni of furnies) {
			if (!this.apiData.avatarImages[floorFurni.ownerId]) {
				const ownerImage = await fetchAvatarImage(floorFurni.ownerName, DOMAINS[Snapshot.#host])
				this.apiData.avatarImages[floorFurni.ownerId] = {
					string: '', // TODO: fetch profile
					image: ownerImage,
				}

				this.#ownersCount++
			}

			const data = Snapshot.#FURNI_DATA.wallFurni.get(floorFurni.typeId)

			if (data && !this.apiData.furniData.floorTypes[data.classname]) {
				this.apiData.furniData.floorTypes[data.classname] = data
			}
		}
	}

	async getSummary(allowIncomplete = false) {
		if (!allowIncomplete && !this.ready)
			throw new Error("Please, set all packets before using the summary. Missing Packets: " + Snapshot.requiredPackets.filter(p => !this.rawPackets[p]))

		await this.parseRawPackets()

		/** @type {SnapshotSummary} */
		const summary = {
			version: Snapshot.version,
			timestamp: this.#timestamp,
			host: Snapshot.#host,
			visitor: {
				id: this.parsedPackets.in_UserObject.id,
				name: this.parsedPackets.in_UserObject.name,
				figure: {
					string: this.parsedPackets.in_UserObject.figure,
					image: this.apiData.avatarImages[this.parsedPackets.in_UserObject.id].image,
				},
			},
			room: {
				id: this.parsedPackets.in_GetGuestRoomResult.roomData.flatId,
				name: this.parsedPackets.in_GetGuestRoomResult.roomData.roomName,
				hasGroup: !!this.parsedPackets.in_GetGuestRoomResult.roomData.groupId,
				image: this.apiData.roomImage,
				// tilesCount: 0, // TODO: parse from rawPackets.in_FloorHeightMap
			},
			owner: {
				id: this.parsedPackets.in_GetGuestRoomResult.roomData.ownerId,
				name: this.parsedPackets.in_GetGuestRoomResult.roomData.ownerName,
				figure: {
					string: this.apiData.avatarImages[this.parsedPackets.in_GetGuestRoomResult.roomData.ownerId].string,
					image: this.apiData.avatarImages[this.parsedPackets.in_GetGuestRoomResult.roomData.ownerId].image,
				},
			},
			furni: {
				floorCount: this.parsedPackets.in_Objects.length,
				wallCount: this.parsedPackets.in_Items.length,
				ownersCount: this.#ownersCount,
				teleportCount: this.#teleportCount,
			},
		}

		return summary
	}

	/**
	 * @param {HPacket} response
	 * @param {Object} object
	 */
	#serializeObject(response, object) {
		for (const prop in object) {
			switch (typeof object[prop]) {
				case "boolean":
					response.appendBoolean(object[prop])
					break;
				case "number": {
					/** @type {number} */
					const value = object[prop]

					if (value === Math.floor(value)) {
						if (value > 32_767) {
							response.appendLong(value)
						} else {
							response.appendInt(value)
						}
					} else {
						response.appendString(''+value)
					}
					break
				}

				case "string": {
					/** @type {string} */
					const value = object[prop]

					if (value.length < 65_535) {
						response.appendString(value)
					} else {
						response.appendLongString(value)
					}
					break
				}
				case "object":
					if (Array.isArray(object[prop])) {
						response.appendInt(object[prop].length)
						for (const elem of object[prop]) {
							this.#serializeObject(response, elem)
						}
					} else {
						this.#serializeObject(response, object[prop])
					}
					break
			
				default:
					throw new Error("Object has invalid prop value `" + typeof object[prop] + "` in `" + prop + "`")
			}
		}
	}

	/**
	 * @param {HPacket} response
	 * @param {String} packetName
	 * @param {HPacket} packet
	 */
	#serializePacket(response, packetName, packet) {
		response.appendString(packetName)

		const readIndex = packet.readIndex;
		packet.resetReadIndex()
		const data = packet.readBytes(packet.getBytesLength() - 6)
		packet.readIndex = readIndex
	
		response.appendInt(data.length)
		response.appendBytes(data)
	}

	/**
	 * @param {HPacket} response
	 * @param {ApiData} apiData
	 */
	#serializeApiData(response, apiData) {
		response.appendString("APIData")

		const tempPacket = new HPacket(0)

		tempPacket.appendInt(Object.keys(apiData.avatarImages).length)

		for (const avatarId in apiData.avatarImages) {
			tempPacket.appendString(apiData.avatarImages[avatarId].string)
			tempPacket.appendLongString(apiData.avatarImages[avatarId].image)
		}

		tempPacket.appendInt(Object.keys(apiData.furniData.floorTypes).length)

		for (const classname in apiData.furniData.floorTypes) {
			const data = apiData.furniData.floorTypes[classname]
			this.#serializeObject(tempPacket, data)
		}

		tempPacket.appendInt(Object.keys(apiData.furniData.wallTypes).length)

		for (const classname in apiData.furniData.wallTypes) {
			const data = apiData.furniData.wallTypes[classname]
			this.#serializeObject(tempPacket, data)
		}

		response.appendInt(tempPacket.getBytesLength())
		response.appendBytes(tempPacket.toBytes())
	}

	async compose(allowIncomplete = false) {
		const response = new HPacket(Snapshot.headerId)

		if (!allowIncomplete && !this.ready)
			throw new Error("Please, set all packets before composing.")

		this.#serializeObject(response, await this.getSummary(allowIncomplete))

		for (const packetName in this.rawPackets) {
			const packet = this.rawPackets[packetName]
			
			this.#serializePacket(response, packetName, packet)
		}

		this.#serializeApiData(response, this.apiData)

		return response
	}
}
