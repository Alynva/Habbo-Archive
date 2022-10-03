import { HPacket } from "gnode-api";

/**
 * @typedef SnapshotSummary
 * @property {number} timestamp
 * @property {String} host
 */

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
		return !!(this.in_GetGuestRoomResult && this.in_Objects && this.in_Items)
	}

	/**
	 * @returns {SnapshotSummary}
	 */
	get summary() {
		if (!this.ready)
			throw new Error("Please, set all packets before using the summary.")

		const timestamp = this.#timestamp || Date.now()
		this.#timestamp = timestamp

		return {
			timestamp,
			host: this.#host,
			// TODO: parse packets and extract important summary, eg visitor info (name, id, figure), room info (name, owner, ids), furni info (floor, wall, teleports), ...
		}
	}

	/**
	 * @param {HPacket} response
	 * @param {SnapshotSummary} summary
	 */
	#serializeSummary(response, summary) {
		response.appendLong(summary.timestamp)
		response.appendString(summary.host)

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