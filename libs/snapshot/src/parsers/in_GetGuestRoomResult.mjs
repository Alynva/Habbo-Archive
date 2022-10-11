import util from "node:util"
import { HPacket } from "gnode-api"

// §_-j1b§
class ThumbnailObject {
	/** @type {Number} */
	pos
	/** @type {Number} */
	imgId

	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0)
		return `${indent}ThumbnailObject {\n`
			+ `${indent}  pos: ${util.inspect(this.pos, { colors: true })}\n`
			+ `${indent}  imgId: ${util.inspect(this.imgId, { colors: true })}\n`
			+ `${indent}}`
	}
}

// §_-m3§
class ThumbnailData {
	/** @type {Number} */
	bgImgId
	/** @type {Number} */
	frontImgId
	/** @type {ThumbnailObject[]} */
	objects

	/** @param {HPacket} packet */
	constructor(packet) {
		this.objects = []
		if (!(packet instanceof HPacket)) {
			return
		}

		;[this.bgImgId, this.frontImgId] = packet.read("ii")

		const count = packet.readInteger()
		for (let i = 0; i < count; i++) {
			const object = new ThumbnailObject()
			;[object.pos, object.imgId] = packet.read('ii')
			this.objects.push(object)
		}

		if (this.bgImgId === 0)
			this.setDefaults()
	}

	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0)
		return `${indent}ThumbnailData {\n`
			+ `${indent}  bgImgId: ${util.inspect(this.bgImgId, { colors: true })}\n`
			+ `${indent}  frontImgId: ${util.inspect(this.frontImgId, { colors: true })}\n`
			+ `${indent}  objects: ${util.inspect(this.objects, false, depth + 1)}\n`
			+ `${indent}}`
	}

	setDefaults() {
		this.bgImgId = 1
		this.frontImgId = 0
		const object = new ThumbnailObject()
		object.pos = 4
		object.imgId = 1
		this.objects.push(object)
	}
}

// §_-j13§
class RoomData {
	/** @type {Number} */
	flatId
	/** @type {String} */
	roomName
	/** @type {Boolean} */
	showOwner
	/** @type {Number} */
	ownerId
	/** @type {String} */
	ownerName
	/** @type {Number} */
	doorMode
	/** @type {Number} */
	userCount
	/** @type {Number} */
	maxUserCount
	/** @type {String} */
	description
	/** @type {Number} */
	tradeMode
	/** @type {Number} */
	score
	/** @type {Number} */
	ranking
	/** @type {Number} */
	categoryId

	/** @type {Number} */
	groupId
	/** @type {String} */
	groupName
	/** @type {String} */
	groupBadgeCode

	/** @type {String[]} */
	tags

	/** @type {ThumbnailData} */
	thumbnail

	/** @type {Boolean} */
	allowPets

	/** @type {Boolean} */
	displayRoomEntryAd
	/** @type {String} */
	roomAdName
	/** @type {String} */
	roomAdDescription
	/** @type {Number} */
	roomAdExpiresInMin

	/** @type {Boolean} */
	allInRoomMuted
	/** @type {String} */
	officialRoomPicRef

	/** @type {Boolean} */
	canMute

	/** @param {HPacket} packet */
	constructor(packet) {
		if (!(packet instanceof HPacket)) {
			throw new Error("RoomData.constructor: packet must be an instance of HPacket");
		}

		;[
			this.flatId, this.roomName, this.ownerId, this.ownerName,
			this.doorMode, this.userCount, this.maxUserCount,
			this.description, this.tradeMode, this.score, this.ranking,
			this.categoryId
		] = packet.read('iSiSiiiSiiii')
		
		this.tags = packet.read('S'.repeat(packet.readInteger()))

		let multiUse = packet.readInteger()

		if ((multiUse & 1) > 0)
			this.officialRoomPicRef = packet.readString()

		if ((multiUse & 2) > 0) {
			this.groupId = packet.readInteger()
			this.groupName = packet.readString()
			this.groupBadgeCode = packet.readString()
		}

		if ((multiUse & 4) > 0) {
			this.roomAdName = packet.readString()
			this.roomAdDescription = packet.readString()
			this.roomAdExpiresInMin = packet.readInteger()
		}

		this.showOwner = (multiUse & 8) > 0
		this.allowPets = (multiUse & 16) > 0
		this.displayRoomEntryAd = (multiUse & 32) > 0

		this.thumbnail = new ThumbnailData()
		this.thumbnail.setDefaults()
	}

	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0)
		return `${indent}RoomData {\n`
			+ `${indent}  flatId: ${util.inspect(this.flatId, { colors: true })}\n`
			+ `${indent}  roomName: ${util.inspect(this.roomName, { colors: true })}\n`
			+ `${indent}  showOwner: ${util.inspect(this.showOwner, { colors: true })}\n`
			+ `${indent}  ownerId: ${util.inspect(this.ownerId, { colors: true })}\n`
			+ `${indent}  ownerName: ${util.inspect(this.ownerName, { colors: true })}\n`
			+ `${indent}  doorMode: ${util.inspect(this.doorMode, { colors: true })}\n`
			+ `${indent}  userCount: ${util.inspect(this.userCount, { colors: true })}\n`
			+ `${indent}  maxUserCount: ${util.inspect(this.maxUserCount, { colors: true })}\n`
			+ `${indent}  description: ${util.inspect(this.description, { colors: true })}\n`
			+ `${indent}  tradeMode: ${util.inspect(this.tradeMode, { colors: true })}\n`
			+ `${indent}  score: ${util.inspect(this.score, { colors: true })}\n`
			+ `${indent}  ranking: ${util.inspect(this.ranking, { colors: true })}\n`
			+ `${indent}  categoryId: ${util.inspect(this.categoryId, { colors: true })}\n`
			+ `${this.groupId !== undefined && this.groupName !== undefined && this.groupBadgeCode !== undefined ? `${indent}  groupId: ${util.inspect(this.groupId, { colors: true })}\n` : ''}`
			+ `${this.groupId !== undefined && this.groupName !== undefined && this.groupBadgeCode !== undefined ? `${indent}  groupName: ${util.inspect(this.groupName, { colors: true })}\n` : ''}`
			+ `${this.groupId !== undefined && this.groupName !== undefined && this.groupBadgeCode !== undefined ? `${indent}  groupBadgeCode: ${util.inspect(this.groupBadgeCode, { colors: true })}\n` : ''}`
			+ `${indent}  tags: ${util.inspect(this.tags, { colors: true })}\n`
			+ `${indent}  thumbnail: ${util.inspect(this.thumbnail, false, depth + 1)}\n`
			+ `${indent}  allowPets: ${util.inspect(this.allowPets, { colors: true })}\n`
			+ `${indent}  displayRoomEntryAd: ${util.inspect(this.displayRoomEntryAd, { colors: true })}\n`
			+ `${this.roomAdName !== undefined && this.roomAdDescription !== undefined && this.roomAdExpiresInMin !== undefined ? `${indent}  roomAdName: ${util.inspect(this.roomAdName, { colors: true })}\n` : ''}`
			+ `${this.roomAdName !== undefined && this.roomAdDescription !== undefined && this.roomAdExpiresInMin !== undefined ? `${indent}  roomAdDescription: ${util.inspect(this.roomAdDescription, { colors: true })}\n` : ''}`
			+ `${this.roomAdName !== undefined && this.roomAdDescription !== undefined && this.roomAdExpiresInMin !== undefined ? `${indent}  roomAdExpiresInMin: ${util.inspect(this.roomAdExpiresInMin, { colors: true })}\n` : ''}`
			+ `${indent}  allInRoomMuted: ${util.inspect(this.allInRoomMuted, { colors: true })}\n`
			+ `${this.officialRoomPicRef !== undefined ? `${indent}  officialRoomPicRef: ${util.inspect(this.officialRoomPicRef, { colors: true })}\n` : ''}`
			+ `${indent}  canMute: ${util.inspect(this.canMute, { colors: true })}\n`
			+ `${indent}}`
	}
}

// §_-KS§
class ModerationSettings {
	/** @type {Number} */
	whoCanMute
	/** @type {Number} */
	whoCanKick
	/** @type {Number} */
	whoCanBan

	/** @param {HPacket} packet */
	constructor(packet) {
		if (!(packet instanceof HPacket)) {
			throw new Error("ModerationSettings.constructor: packet must be an instance of HPacket")
		}

		;[this.whoCanMute, this.whoCanKick, this.whoCanBan] = packet.read('iii')
	}

	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0)
		return `${indent}ModerationSettings {\n`
			+ `${indent}  whoCanMute: ${util.inspect(this.whoCanMute, { colors: true })}\n`
			+ `${indent}  whoCanKick: ${util.inspect(this.whoCanKick, { colors: true })}\n`
			+ `${indent}  whoCanBan: ${util.inspect(this.whoCanBan, { colors: true })}\n`
			+ `${indent}}`
	}
}

// §_-51a§
class ChatSettings {
	/** @type {Number} */
	mode
	/** @type {Number} */
	bubbleWidth
	/** @type {Number} */
	scrollSpeed
	/** @type {Number} */
	fullHearRange
	/** @type {Number} */
	floodSensitivity

	/** @param {HPacket} packet */
	constructor(packet) {
		if (!(packet instanceof HPacket)) {
			throw new Error("ChatSettings.constructor: packet must be an instance of HPacket")
		}

		;[this.mode, this.bubbleWidth, this.scrollSpeed, this.fullHearRange, this.floodSensitivity] = packet.read('iiiii')
	}

	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0)
		return `${indent}ChatSettings {\n`
			+ `${indent}  mode: ${util.inspect(this.mode, { colors: true })}\n`
			+ `${indent}  bubbleWidth: ${util.inspect(this.bubbleWidth, { colors: true })}\n`
			+ `${indent}  scrollSpeed: ${util.inspect(this.scrollSpeed, { colors: true })}\n`
			+ `${indent}  fullHearRange: ${util.inspect(this.fullHearRange, { colors: true })}\n`
			+ `${indent}  floodSensitivity: ${util.inspect(this.floodSensitivity, { colors: true })}\n`
			+ `${indent}}`
	}
}

// _-02K§
export default class GetGuestRoomResult {
	/** @type {Boolean} */
	enterRoom
	/** @type {RoomData} */
	roomData

	/** @type {Boolean} */
	roomForward
	/** @type {Boolean} */
	staffPick
	/** @type {Boolean} */
	isGroupMember

	/** @type {ModerationSettings} */
	moderationSettings
	/** @type {ChatSettings} */
	chatSettings

	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0)
		return `${indent}GetGuestRoomResult {\n`
			+ `${indent}  enterRoom: ${util.inspect(this.enterRoom, { colors: true })}\n`
			+ `${indent}  roomData: ${util.inspect(this.roomData, false, depth + 1)}\n`
			+ `${indent}  roomForward: ${util.inspect(this.roomForward, { colors: true })}\n`
			+ `${indent}  staffPick: ${util.inspect(this.staffPick, { colors: true })}\n`
			+ `${indent}  isGroupMember: ${util.inspect(this.isGroupMember, { colors: true })}\n`
			+ `${indent}  moderationSettings: ${util.inspect(this.moderationSettings, false, depth + 1)}\n`
			+ `${indent}  chatSettings: ${util.inspect(this.chatSettings, false, depth + 1)}\n`
			+ `${indent}}`
	}

	/** @param {HPacket} packet */
	constructor(packet, resetReadIndex = true) {
		if (!(packet instanceof HPacket)) {
			throw new Error("GetGuestRoomResult.constructor: packet must be an instance of HPacket")
		}

		let readIndex
		if (resetReadIndex) {
			readIndex = packet.readIndex;
			packet.resetReadIndex()
		}

		this.enterRoom = packet.readBoolean()
		this.roomData = new RoomData(packet)
		;[this.roomForward, this.staffPick, this.isGroupMember] = packet.read("BBB")
		const allInRoomMuted = packet.readBoolean()
		this.moderationSettings = new ModerationSettings(packet)
		this.roomData.allInRoomMuted = allInRoomMuted
		this.roomData.canMute = packet.readBoolean()
		this.chatSettings = new ChatSettings(packet)

		if (resetReadIndex) {
			packet.readIndex = readIndex
		}
	}

}