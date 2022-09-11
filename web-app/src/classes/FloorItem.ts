import ItemFacing from "../enums/ItemFacing";
import HabboUser from "./HabboUser";
import RoomPoint from "./RoomPoint";

export default class FloorItem {
	owner: HabboUser
	id: Number
	spriteId: Number

	position: RoomPoint
	sizeZ: Number
	facing: ItemFacing

	state: string
}
