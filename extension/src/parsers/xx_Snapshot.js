import util from "node:util"

import { HPacket, HWallItem } from "gnode-api"
import GetGuestRoomResult from "./in_GetGuestRoomResult.js"
import { HFloorItem } from "./in_Objects.js"

export default class Snapshot {
	/** @type {import("../composers/SnapshotComposer").SnapshotSummary} */
	summary
	/** @type {GetGuestRoomResult} */
	in_GetGuestRoomResult
	/** @type {HFloorItem[]} */
	in_Objects
	/** @type {HWallItem[]} */
	in_Items

	/** @param {HPacket} packet */
	constructor(packet, resetReadIndex = true) {
		if (!(packet instanceof HPacket)) {
			throw new Error("Snapshot.constructor: packet must be an instance of HPacket");
		}

		let readIndex
		if (resetReadIndex) {
			readIndex = packet.readIndex;
			packet.resetReadIndex()
		}

		let [
			timestamp, host,
			visitorId, visitorName, visitorFigureString,
			roomId, roomName, roomHasGroup,
			ownerId, ownerName, ownerFigureString,
		] = packet.read('lSiSSiSBiSS');
		
		this.summary = {
			timestamp,
			host,
			visitor: {
				id: visitorId,
				name: visitorName,
				figureString: visitorFigureString,
			},
			room: {
				id: roomId,
				name: roomName,
				hasGroup: roomHasGroup,
			},
			owner: {
				id: ownerId,
				name: ownerName,
				figureString: ownerFigureString,
			},
		}

		this.in_GetGuestRoomResult = new GetGuestRoomResult(packet, false)
		this.in_Objects = HFloorItem.parse(packet, false)
		this.in_Items = HWallItem.parse(packet)

		if (resetReadIndex) {
			packet.readIndex = readIndex
		}
	}
}
