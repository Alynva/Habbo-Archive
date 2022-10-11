import fs from 'node:fs'
import { HPacket } from 'gnode-api'
import Snapshot from 'habbo-archive-snapshot'

const furniData = await fetch(`https://www.habbo.com.br/gamedata/furnidata_json/1`)
	.then(r => r.json())
	.then(data => {
		const {
			roomitemtypes: { furnitype: roomitemtypes },
			wallitemtypes: { furnitype: wallitemtypes },
		} = data

		/** @type {Array} */
		let floor = roomitemtypes

		let floorFurni = floor
			.map(x => ({
				id: x.id,
				classname: x.classname,
				revision: x.revision,
				category: x.category,
				furniline: x.furniline,
				name: x.name,
				description: x.description,
				customparams: x.customparams,
				specialtype: x.specialtype,
			}))
			.reduce((prev, cur) => prev.set(cur.id, cur), new Map())

		return { floorFurni }
	})

const snapshotsNames = fs.readdirSync('../../snapshots/v'+Snapshot.version)
	.filter(n => n.endsWith(".json"))

const snapshots = new Map()

for (const snapshotName of snapshotsNames) {
	const snapshotString = fs.readFileSync('../../snapshots/v'+Snapshot.version+'/' + snapshotName, 'utf-8')
	const snapshot = JSON.parse(snapshotString)
	if (!snapshot?.summary?.room?.id) continue

	snapshots.set(snapshot.summary.room.id, snapshot)
}
const furniImages = {
	_default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAYAAABiFp9rAAAAAklEQVR4nGKkkSsAAADbSURBVO3WgQ2DIBAFUGgcA/fQdRwMBnEA3QP2oL2rl1gjcIfYpEl/ggRBXkxAUUqeuBVRtBBQ3nts9H0vmoMz6AM4hgvmOrOAFDy7KQK44L5xCSiBujWQAh9wiVG8WtmhuRFa11UZY7C0Cs3nnMN2Rx2AQYZhwDqEUA1ACKB0x4G1YApIQlKwBBShEsgF2FAK5AJiiAJvNM+z9LH38v5G/tCPQOM43gZM04Q1LG+9YfiZXZalKUDz7/dRE/AIUM42bBWYAnKQCCwBNcGD4+uXH621dIi879dcCzwBGfFx0TdzzSwAAAAASUVORK5CYII=',
	teleport_door: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAfCAYAAADupU20AAAAAklEQVR4nGKkkSsAAAGESURBVGNgwAT/oZgowIRNMM9ekmiDsBrgE6rPcHZFHEkGIYP/OQ5S/6P1Bf4DDQFjEB+XQYw4DIBz3r//xlBU6Qdmz5+xh2HKgWcoegkagGxQfKoFmL1pzSW4QSy4/KGiJ8Rw59I7OF9QkAusEWaQhDAXQ83aO9gDEdkQkAZkADLILWcHw4u3EHG8BqB7AWQgOiDagM/f/8JdRZYBvJzMqBr//yfPBTAgJsKN2wBQFCHHADYXwAB6NP5fsW4Lg46ODoOOmgJDDgMk1LG5AAawuuDKlSsYYnJSvBiuwuYCxoggH3DoTMjTwaoBXQyrC2BJGVtCQgdDOCGR7QKiDAAlU2ITEl4XgAwhKyFNOvgcQ4zYhARORNdyJRi0JkOKLPTiDd0QFnSNYOde/ghn4zII2YD/yBphAMYmZBDIAEatyS/gLgBpfHaVhUFK+w9WgxgY/gGzO6YXGCG2QAw66cCJYgvYQAaIQeYHvqPIYasXQABs0HpRXrhLkDSi6MFlAIpB+NQCAOO2vFaVQL5dAAAAAElFTkSuQmCC',

}
let result = []
// let found = false
for (const [roomId, snapshot] of snapshots) {
	const { _, data } = snapshot
	const bytes = new Uint8Array(data)
	const snapshotPacket = new HPacket(bytes)
	const { summary, data: snapshotData } = Snapshot.parse(snapshotPacket)

	for (const furni of snapshotData.in_Objects) {

		const typeId = furni.typeId
		const classname = furniData.floorFurni.get(typeId).classname
		const destination = furniData.floorFurni.get(typeId).category === 'teleport' ? furni.extra : undefined
		result.push({
			// id: `floor_${furni.id}`,
			// TODO: deal with duplicated furni (yes, it exists) in a better way
			furniId: result.find(x => x.furniId === furni.id) ? furni.id * -1 - roomId : furni.id,
			destination: destination,
			name: classname,
			bc: furni.id >= 2147418112,
			image: furniImages[furni] || furniImages._default,
			host: summary.host,
			roomId: roomId,
			roomImage: `https://habbo-stories-content.s3.amazonaws.com/navigator-thumbnail/hhbr/${roomId}.png`,
			roomOwnerId: snapshotData.in_GetGuestRoomResult.roomData.ownerId,
			roomOwnerImage: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${snapshotData.in_GetGuestRoomResult.roomData.ownerName}&headonly=1&size=b&gesture=sml&direction=2&head_direction=2&action=std`,
			furniOwnerId: furni.ownerId,
			furniOwnerImage: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${furni.ownerName}&headonly=1&size=b&gesture=sml&direction=2&head_direction=2&action=std`,
		})
	}

	// break
}
// console.log(JSON.stringify(result))
fs.writeFileSync('./graph.json', JSON.stringify(result, null, 1))