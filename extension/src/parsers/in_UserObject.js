import util from "node:util"

import { HPacket } from "gnode-api"

/**
 * You can send `{out:InfoRetrieve}` at any time to receive `{in:UserObject}...`
 */
export default class UserObject {
	/** @type {Number} */
	id
	/** @type {String} */
	name
	/** @type {String} */
	figure
	/** @type {String} */
	sex
	/** @type {String} */
	customData
	/** @type {String} */
	realName
	/** @type {Boolean} */
	directMail
	/** @type {Number} */
	respectTotal
	/** @type {Number} */
	respectLeft
	/** @type {Number} */
	petRespectLeft
	/** @type {Boolean} */
	streamPublishingAllowed
	/** @type {String} */
	lastAccessDate
	/** @type {Boolean} */
	nameChangeAllowed
	/** @type {Boolean} */
	accountSafetyLocked

	/** @param {HPacket} packet */
	constructor(packet, resetReadIndex = true) {
		if (!(packet instanceof HPacket)) {
			throw new Error("GetGuestRoomResult.constructor: packet must be an instance of HPacket");
		}

		let readIndex
		if (resetReadIndex) {
			readIndex = packet.readIndex;
			packet.resetReadIndex()
		}

		;[
			this.id, this.name, this.figure, this.sex, this.customData,
			this.realName, this.directMail, this.respectTotal,
			this.respectLeft, this.petRespectLeft,
			this.streamPublishingAllowed, this.lastAccessDate,
			this.nameChangeAllowed, this.accountSafetyLocked
		] = packet.read('iSSSSSBiiiBSBB');

		if (resetReadIndex) {
			packet.readIndex = readIndex
		}
	}

	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
		return `${indent}UserObject {\n`
			+ `${indent}  id: ${util.inspect(this.id, { colors: true })}\n`
			+ `${indent}  name: ${util.inspect(this.name, { colors: true })}\n`
			+ `${indent}  figure: ${util.inspect(this.figure, { colors: true })}\n`
			+ `${indent}  sex: ${util.inspect(this.sex, { colors: true })}\n`
			+ `${indent}  customData: ${util.inspect(this.customData, { colors: true })}\n`
			+ `${indent}  realName: ${util.inspect(this.realName, { colors: true })}\n`
			+ `${indent}  directMail: ${util.inspect(this.directMail, { colors: true })}\n`
			+ `${indent}  respectTotal: ${util.inspect(this.respectTotal, { colors: true })}\n`
			+ `${indent}  respectLeft: ${util.inspect(this.respectLeft, { colors: true })}\n`
			+ `${indent}  petRespectLeft: ${util.inspect(this.petRespectLeft, { colors: true })}\n`
			+ `${indent}  streamPublishingAllowed: ${util.inspect(this.streamPublishingAllowed, { colors: true })}\n`
			+ `${indent}  lastAccessDate: ${util.inspect(this.lastAccessDate, { colors: true })}\n`
			+ `${indent}  nameChangeAllowed: ${util.inspect(this.nameChangeAllowed, { colors: true })}\n`
			+ `${indent}  accountSafetyLocked: ${util.inspect(this.accountSafetyLocked, { colors: true })}\n`
			+ `${indent}}`;
	}
}
