import { CollectionReference, DocumentReference } from "firebase/firestore"
import EntryMode from "../enums/EntryMode"
import HabboUser from "./HabboUser"
import RoomSnapshot from "./RoomSnapshot"

export default class VerifiedRoom {
	uid: String

	owner: HabboUser
	name: String
	description: String

	category: string
	rating: Number
	hasGroup: Boolean
	entryMode: EntryMode

	lastSnapshot: {
		ref: DocumentReference,
		timeCaptured: Date,
	}

	snapshots: CollectionReference<RoomSnapshot>
}