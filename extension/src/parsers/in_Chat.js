import { HPacket } from '../../protocol/hpacket.js'

export default class HChat {
	#userId;
	#text;
	#gesture;
	#styleId;
	#links = [];
	#trackingId;

	/** @param {HPacket} packet */
	constructor(packet, resetReadIndex = true) {
		if (!(packet instanceof HPacket)) {
			throw new Error(
				"HEntity.constructor: packet must be an instance of HPacket"
			);
		}

		let readIndex
		if (resetReadIndex) {
			readIndex = packet.readIndex
			packet.resetReadIndex()
		}

		this.#userId = packet.readInteger();
		this.#text = packet.readString();
		this.#gesture = packet.readInteger();
		this.#styleId = packet.readInteger();

		const n = packet.readInteger();

		for (let i = 0; i < n; i++) {
			this.#links.push(packet.read('SSB'));
		}

		this.#trackingId = packet.readInteger();

		if (resetReadIndex) {
			packet.readIndex = readIndex
		}
	}

	get userId() {
		return this.#userId;
	}

	set userId(val) {
		if (!Number.isInteger(val)) {
			throw new Error("HChat.userId: must be an integer");
		}

		this.#userId = val;
	}

	get text() {
		return this.#text;
	}

	set text(val) {
		if (typeof val != "string") {
			throw new Error("HChat.text: must be a string");
		}
	}

	get gexture() {
		return this.#gesture;
	}

	set gexture(val) {
		if (!Number.isInteger(val)) {
			throw new Error("HChat.gesture: must be an integer");
		}

		this.#gesture = val;
	}

	get styleId() {
		return this.#styleId;
	}

	set styleId(val) {
		if (!Number.isInteger(val)) {
			throw new Error("HChat.styleId: must be an integer");
		}

		this.#styleId = val;
	}

	get links() {
		return this.#links;
	}

	set links(val) {
		if (!Array.isArray(val)) {
			throw new Error("HChat.links: must be an array");
		}

		this.#links = val;
	}

	get trackingId() {
		return this.#trackingId;
	}

	set trackingId(val) {
		if (!Number.isInteger(val)) {
			throw new Error("HChat.trackingId: must be an integer");
		}

		this.#trackingId = val;
	}

}
