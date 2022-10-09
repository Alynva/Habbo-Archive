/**
 * @param {String} [domain = "www.habbo.com"]
 */
export default function fetchFurniData(domain = "www.habbo.com") {
	return fetch(`https://${domain}/gamedata/furnidata_json/1`)
		.then(r => r.json())
		.then(data => {
			const {
				roomitemtypes: { furnitype: roomitemtypes },
				wallitemtypes: { furnitype: wallitemtypes },
			} = data

			/** @type {Map<number, FurniType>} */
			const floorFurni = roomitemtypes
				.reduce((prev, cur) => prev.set(cur.id, cur), new Map())
			/** @type {Map<number, FurniType>} */
			const wallFurni = wallitemtypes
				.reduce((prev, cur) => prev.set(cur.id, cur), new Map())

			return { floorFurni, wallFurni }
		})
}
