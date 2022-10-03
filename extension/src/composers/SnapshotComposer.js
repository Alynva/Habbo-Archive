import { HPacket } from "gnode-api";

export default class SnapshotComposer {
	/** @type {HPacket} */
	in_GetGuestRoomResult;
	/** @type {HPacket} */
	in_Objects;
	/** @type {HPacket} */
	in_Items;

	/** @type {String} */
	#host

	/** @type {HPacket} */
	#response
	#completed = false

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

	get completed() {
		return this.#completed
	}

	/**
	 * @param {HPacket} response
	 * @param {HPacket} packetRoom
	 * @param {HPacket} packetObjects
	 * @param {HPacket} packetItems
	 */
	#serializeSummary(response, packetRoom, packetObjects, packetItems) {
		response.appendLong(Date.now())
		response.appendString(this.#host)

		// TODO: parse packets and extract important summary (eg room name, owner name, total furni count, teleports count, ...)
	}

	/**
	 * @param {HPacket} response
	 * @param {HPacket} packet
	 */
	#serializePacket(response, packet) {
		const readIndex = packet.readIndex;
		packet.resetReadIndex()
		const data = packet.readBytes(packet.getBytesLength - 6)
		packet.readIndex = readIndex
		response.appendBytes(data)
	}

	compose() {
		if (this.completed) {
			console.warn("Attempt to compose the snapshot twice. Changes made after the first composition has no effect. Prefer to use the `response` property.")
			return this.response
		}

		const response = new HPacket(this.headerId)

		if (!this.in_GetGuestRoomResult || !this.in_Objects || !this.in_Items)
			throw new Error("Please, set all packets before composing.")

		this.#serializeSummary(response, this.in_GetGuestRoomResult, this.in_Objects, this.in_Items)
		this.#serializePacket(response, this.in_GetGuestRoomResult)
		this.#serializePacket(response, this.in_Objects)
		this.#serializePacket(response, this.in_Items)

		this.#response = response
		this.#completed = true

		return this.response
	}
}