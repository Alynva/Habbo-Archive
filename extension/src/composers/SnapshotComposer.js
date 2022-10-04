import { HFloorItem, HPacket, HWallItem } from "gnode-api";
import GetGuestRoomResult from "../parsers/in_GetGuestRoomResult.js";
import UserObject from "../parsers/in_UserObject.js";

/**
 * @typedef SnapshotSummary
 * @property {number} timestamp
 * @property {String} host
 * @property {Object} visitor
 * @property {Number} visitor.id
 * @property {String} visitor.name
 * @property {String} visitor.figureString
 * @property {Object} room
 * @property {Number} room.id
 * @property {String} room.name
 * @property {Boolean} room.hasGroup
 * @property {Object} owner
 * @property {Number} owner.id
 * @property {String} owner.name
 * @property {String} owner.figureString
 */

export default class SnapshotComposer {
	/** @type {HPacket} */
	in_GetGuestRoomResult;
	/** @type {HPacket} */
	in_UserObject;
	/** @type {HPacket} */
	in_Objects;
	/** @type {HPacket} */
	in_Items;

	/** @type {String} */
	#host

	/** @type {HPacket} */
	#response

	/** @type {number} */
	#timestamp

	/**
	 * @param {String} host
	 */
	constructor(host) {
		this.#host = host
	}

	get headerId() {
		return 32_767
	}

	get response() {
		return this.#response
	}

	get ready() {
		return !!(this.in_GetGuestRoomResult && this.in_UserObject && this.in_Objects && this.in_Items)
	}

	/**
	 * @returns {SnapshotSummary}
	 */
	get summary() {
		if (!this.ready)
			throw new Error("Please, set all packets before using the summary.")

		const timestamp = this.#timestamp || Date.now()
		this.#timestamp = timestamp

		const roomData = new GetGuestRoomResult(this.in_GetGuestRoomResult)
		const userData = new UserObject(this.in_UserObject)

		let readIndex = this.in_Objects.readIndex;
		this.in_Objects.resetReadIndex()
		const objectsData = HFloorItem.parse(this.in_Objects)
		this.in_Objects.readIndex = readIndex
		readIndex = this.in_Items.readIndex;
		this.in_Items.resetReadIndex()
		const itemsData = HWallItem.parse(this.in_Items)
		this.in_Items.readIndex = readIndex

		// Not the best way to filter teleports, but kinda work (you can now reconnect it to other one)
		const teleportCount = objectsData.filter(x => x.id === x.extra - 1 || x.id === x.extra + 1).length

		return {
			timestamp,
			host: this.#host,
			visitor: {
				id: userData.id,
				name: userData.name,
				figureString: userData.figure,
				// figureImage: '', // TODO: fetch the current image and store as base64
			},
			room: {
				id: roomData.roomData.flatId,
				name: roomData.roomData.roomName,
				hasGroup: !!roomData.roomData.groupId,
				// picture: '', // TODO: fetch the current image and store as base64
				// tilesCount: 0, // TODO: get from {in:FloorHeightMap}
			},
			owner: {
				id: roomData.roomData.ownerId,
				name: roomData.roomData.ownerName,
				figureString: '', // TODO: fetch from API
				// figureImage: '', // TODO: fetch the current image and store as base64
			},
			furni: {
				floorCount: objectsData.length,
				wallCount: itemsData.length,
				teleportCount,
			},
		}
	}

	/**
	 * @param {HPacket} response
	 * @param {SnapshotSummary} summary
	 */
	#serializeSummary(response, summary) {
		response.appendLong(summary.timestamp)
		response.appendString(summary.host)

		response.appendInt(summary.visitor.id)
		response.appendString(summary.visitor.name)
		response.appendString(summary.visitor.figureString)

		response.appendInt(summary.room.id)
		response.appendString(summary.room.name)
		response.appendBoolean(summary.room.hasGroup)

		response.appendInt(summary.owner.id)
		response.appendString(summary.owner.name)
		response.appendString(summary.owner.figureString)

		// TODO: parse packets and extract important summary (eg room name, owner name, total furni count, teleports count, ...)
	}

	/**
	 * @param {HPacket} response
	 * @param {HPacket} packet
	 */
	#serializePacket(response, packet) {
		const readIndex = packet.readIndex;
		packet.resetReadIndex()
		const data = packet.readBytes(packet.getBytesLength() - 6)
		packet.readIndex = readIndex
		response.appendBytes(data)
	}

	compose() {
		if (this.completed) {
			console.warn("Attempt to compose the snapshot twice. Changes made after the first composition has no effect. Prefer to use the `response` property.")
			return this.response
		}

		const response = new HPacket(this.headerId)

		if (!this.ready)
			throw new Error("Please, set all packets before composing.")

		this.#serializeSummary(response, this.summary)
		this.#serializePacket(response, this.in_GetGuestRoomResult)
		this.#serializePacket(response, this.in_Objects)
		this.#serializePacket(response, this.in_Items)

		this.#response = response

		return this.response
	}
}