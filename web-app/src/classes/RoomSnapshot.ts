import { CollectionReference, DocumentReference } from "firebase/firestore"
import EntryMode from "../enums/EntryMode"

import HabboServer from "../enums/HabboServer"
import ArchiveUser from "./ArchiveUser"
import FloorItem from "./FloorItem"
import HabboUser from "./HabboUser"
import VerifiedRoom from "./VerifiedRoom"
import WallItem from "./WallItem"

export default class RoomSnapshot {
	capturedBy: DocumentReference<ArchiveUser>
	timeCaptured: Date

	roomInfo: {
		hotel: HabboServer,
		name: String,
		owner: HabboUser,
		ref: DocumentReference<VerifiedRoom>
	}

	floorDefinition: String

	floorItemsCount: Number
	wallItemsCount: Number
	floorSizes: {
		flatWidth: Number,
		flatHeight: Number,
		minAltitude: Number,
		maxAltitude: Number,
		diffAltitude: Number,
		numberOfTiles: Number,
	}
	entryPosition: {
		x: Number,
		y: Number,
	}

	category: string
	rating: Number
	hasGroup: Boolean
	entryMode: EntryMode

	floorItems: CollectionReference<FloorItem>
	wallItems: CollectionReference<WallItem>
}
