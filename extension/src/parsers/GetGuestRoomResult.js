import util from "node:util";
import { HPacket } from "gnode-api";

export default class GetGuestRoomResult {
	enterRoom
	flatId;
	roomName;
	ownerId;
	ownerName;
	doorMode;
	userCount;
	maxUserCount;
	description;
	tradeMode;
	score;
	ranking;
	categoryId;
	tags;

	officialRoomPicRef;

	groupId;
	groupName;
	groupBadgeCode;

	roomAdName;
	roomAdDescription;
	roomAdExpiresInMin;

	showOwner;
	allowPets;
	displayRoomEntryAd;

	roomForward
	staffPick
	isGroupMember
	allInRoomMuted
	whoCanMute
	whoCanKick
	whoCanBan
	canMute
	chatMode
	chatBubbleWidth
	chatScrollSpeed
	chatFullHearRange
	chatfloodSensitivity

	[util.inspect.custom](depth) {
		const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
		return `${indent}HNavigatorRoom {\n`
			+ `${indent}  enterRoom: ${util.inspect(this.enterRoom, { colors: true })}\n`
			+ `${indent}  flatId: ${util.inspect(this.flatId, { colors: true })}\n`
			+ `${indent}  roomName: ${util.inspect(this.roomName, { colors: true })}\n`
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
			+ `${indent}  tags: ${util.inspect(this.tags, { colors: true })}\n`
			+ `${this.officialRoomPicRef !== undefined ? `${indent}  officialRoomPicRef: ${util.inspect(this.officialRoomPicRef, { colors: true })}\n` : ''}`
			+ `${this.groupId !== undefined && this.groupName !== undefined && this.groupBadgeCode !== undefined ? `${indent}  groupId: ${util.inspect(this.groupId, { colors: true })}\n` : ''}`
			+ `${this.groupId !== undefined && this.groupName !== undefined && this.groupBadgeCode !== undefined ? `${indent}  groupName: ${util.inspect(this.groupName, { colors: true })}\n` : ''}`
			+ `${this.groupId !== undefined && this.groupName !== undefined && this.groupBadgeCode !== undefined ? `${indent}  groupBadgeCode: ${util.inspect(this.groupBadgeCode, { colors: true })}\n` : ''}`
			+ `${this.roomAdName !== undefined && this.roomAdDescription !== undefined && this.roomAdExpiresInMin !== undefined ? `${indent}  roomAdName: ${util.inspect(this.roomAdName, { colors: true })}\n` : ''}`
			+ `${this.roomAdName !== undefined && this.roomAdDescription !== undefined && this.roomAdExpiresInMin !== undefined ? `${indent}  roomAdDescription: ${util.inspect(this.roomAdDescription, { colors: true })}\n` : ''}`
			+ `${this.roomAdName !== undefined && this.roomAdDescription !== undefined && this.roomAdExpiresInMin !== undefined ? `${indent}  roomAdExpiresInMin: ${util.inspect(this.roomAdExpiresInMin, { colors: true })}\n` : ''}`
			+ `${indent}  showOwner: ${util.inspect(this.showOwner, { colors: true })}\n`
			+ `${indent}  allowPets: ${util.inspect(this.allowPets, { colors: true })}\n`
			+ `${indent}  displayRoomEntryAd: ${util.inspect(this.displayRoomEntryAd, { colors: true })}\n`
			+ `${indent}  roomForward: ${util.inspect(this.roomForward, { colors: true })}\n`
			+ `${indent}  staffPick: ${util.inspect(this.staffPick, { colors: true })}\n`
			+ `${indent}  isGroupMember: ${util.inspect(this.isGroupMember, { colors: true })}\n`
			+ `${indent}  allInRoomMuted: ${util.inspect(this.allInRoomMuted, { colors: true })}\n`
			+ `${indent}  whoCanMute: ${util.inspect(this.whoCanMute, { colors: true })}\n`
			+ `${indent}  whoCanKick: ${util.inspect(this.whoCanKick, { colors: true })}\n`
			+ `${indent}  whoCanBan: ${util.inspect(this.whoCanBan, { colors: true })}\n`
			+ `${indent}  canMute: ${util.inspect(this.canMute, { colors: true })}\n`
			+ `${indent}  chatMode: ${util.inspect(this.chatMode, { colors: true })}\n`
			+ `${indent}  chatBubbleWidth: ${util.inspect(this.chatBubbleWidth, { colors: true })}\n`
			+ `${indent}  chatScrollSpeed: ${util.inspect(this.chatScrollSpeed, { colors: true })}\n`
			+ `${indent}  chatFullHearRange: ${util.inspect(this.chatFullHearRange, { colors: true })}\n`
			+ `${indent}  chatfloodSensitivity: ${util.inspect(this.chatfloodSensitivity, { colors: true })}\n`
			+ `${indent}}`;
	}

	/** @param {HPacket} packet */
	constructor(packet) {
		if (!(packet instanceof HPacket)) {
			throw new Error("GetGuestRoomResult.constructor: packet must be an instance of HPacket");
		}

		[this.enterRoom, this.flatId, this.roomName, this.ownerId, this.ownerName, this.doorMode, this.userCount,
		this.maxUserCount, this.description, this.tradeMode, this.score, this.ranking, this.categoryId]
			= packet.read('biSiSiiiSiiii');

		this.tags = packet.read('S'.repeat(packet.readInteger()));

		let multiUse = packet.readInteger();

		if ((multiUse & 1) > 0)
			this.officialRoomPicRef = packet.readString();

		if ((multiUse & 2) > 0) {
			this.groupId = packet.readInteger();
			this.groupName = packet.readString();
			this.groupBadgeCode = packet.readString();
		}

		if ((multiUse & 4) > 0) {
			this.roomAdName = packet.readString();
			this.roomAdDescription = packet.readString();
			this.roomAdExpiresInMin = packet.readInteger();
		}

		this.showOwner = (multiUse & 8) > 0;
		this.allowPets = (multiUse & 16) > 0;
		this.displayRoomEntryAd = (multiUse & 32) > 0;

		[this.roomForward, this.staffPick, this.isGroupMember, this.allInRoomMuted, this.whoCanMute,
			this.whoCanKick, this.whoCanBan, this.canMute, this.chatMode, this.chatBubbleWidth,
			this.chatScrollSpeed, this.chatFullHearRange, this.chatfloodSensitivity]
			= packet.read('bbbbiiibiiiii')
	}

}