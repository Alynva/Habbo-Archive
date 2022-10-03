import { Extension, HDirection, HEntity, HEntityUpdate, HFriend, HInventoryItem, HMessage, HNavigatorSearchResult, HPacket, HRoomResult } from "gnode-api";
import { PacketInfoManager } from "gnode-api/lib/services/packetinfo/packetinfomanager"
import { HFrontPageItem } from "gnode-api/lib/extension/parsers/catalog/hfrontpageitem";
import { HOffer } from "gnode-api/lib/extension/parsers/catalog/hoffer";

import HChat from "./in_Chat";
import GetGuestRoomResult from "./in_GetGuestRoomResult";

/**
 * @typedef ParsersDict
 * @type {{ [packetName: String]: (packet: HPacket) => any }}
 */

/** @type {{[direction: number]: ParsersDict}} */
const PARSERS = {
	[HDirection.TOCLIENT]: {
		"GetGuestRoomResult": p => new GetGuestRoomResult(p),
		"Chat": p => new HChat(p),
		"?": p => new HRoomResult(p),
		"Users": HEntity.parse,
		"?": p => new HFrontPageItem(p),
		"?": p => new HOffer(p),
		"NavigatorSearchResultBlocks": p => new HNavigatorSearchResult(p),
		"UserUpdate": HEntityUpdate.parse,
		"FurniList": HInventoryItem.parse,
		"FurniListAddOrUpdate": p => new HInventoryItem(p),
		"FriendListUpdate": HFriend.parseFromUpdate,
	},
	[HDirection.TOSERVER]: {
	}
}

/** @param {Extension} ext */
export default function AutoParser(ext) {
	/** @type {PacketInfoManager} */
	let packetInfoManager

	/** @param {HMessage} hMessage */
	return function parse(hMessage) {
		const direction = hMessage.getDestination()
		const packet = hMessage.getPacket()

		if (!packetInfoManager) {
			packetInfoManager = ext.getPacketInfoManager()

			if (!packetInfoManager) throw new Error('Packet Info Manager unavailable!')
		}

		const packetInfos = packetInfoManager.getAllPacketInfoFromHeaderId(direction, packet.headerId())

		const packetName = packetInfos
			.filter((x, i, a) => i.name !== null && i === a.indexOf(x))
			.map(i => `${i.name}`)[0]

		const parser = PARSERS[direction][packetName]

		if (!parser) throw new Error(`Unknown parser for packet: ${packetName}`)

		return parser(packet)
	}
}
