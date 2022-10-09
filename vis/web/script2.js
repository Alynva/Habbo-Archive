const furniImages = {
	_default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAiAgMAAACo64hvAAAADFBMVEUAAAAiIiJmZmYAAACsDRZYAAAAAXRSTlMAQObYZgAAAJJJREFUeF5VkLENwkAMRb3BTcMo7xCI1kKIFAzAGmno0zECRZbICFcwQJoTBbKxFPyrpy9b8rNYPhIp+zmo11dUE9dfuQJ3rwB8sgPYZFEs51l2eLhJCxrkHfT869rBYRxkqSNw5CQLnkQNLky+AfVBEGTKuyiZmlPe2C4tQCh1UDNycQ31FXVz8zTH/KH42vbJL1U7ZSky7tx+AAAAAElFTkSuQmCC',

}
const roomImages = {
	_default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAIAAABJObGsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNkVFQkNGRTZDOUIxMUU0QUFDNEQ0QzdCMTI0MzA5RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNkVFQkNGRjZDOUIxMUU0QUFDNEQ0QzdCMTI0MzA5RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI2RUVCQ0ZDNkM5QjExRTRBQUM0RDRDN0IxMjQzMDlGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI2RUVCQ0ZENkM5QjExRTRBQUM0RDRDN0IxMjQzMDlGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7dqZZwAAAgVJREFUeNrs3E1KA0EQxfEodSsXOYLoMV0ooheYRe5loGEI0aiZdFW96v6/RcgEAj0/aj7yBnL3+fGyIz1yDwGUUEJJoIQSSigJlFBCSaCEEkooCZRQQkmghBJKKAmUUEJJoISyQqziot9e39ubp+dHKG9C3O8fluVwfG2bIqBWDvH0w7YpAmpFEQVBrTSiFKgNgCgCasMgpoPaYIiJoDYkYgqoDYwYDGrDI4aB2iSIAaA2FaIrqE2I6ARq0yJ2B7XJEc9Al+WgNZXlEBUvOxsQ2yAM4G7piMdz09qKX/XF1v4ORbntcD5CbDjBn42w1ERbPOK2/KjWNkVAb53KgB34U0oEVLpFv0onHdQGQBQBtWEQ00FtMMREUNNxdG3RA0DnatFdQS3XMaVFdwK1lGN5J9Cid1+GTYXoCmoTIjqB2rSIl0AVKQsVketS5Vr0iohyU1kaUeWJ48yI3ShB7EOp9oAlBbEP5XrVkwUNQOw8lYKgYYgdKNvKTtsdEdBgxG6XHSnQFMTON0PpoImILrfoKaDpiI4/HMNARRDd6wxXUClEd0onUEHEIMqOoLKIoZQ3goojJlBuAC2BmEb5T9BCiMmUv4PWQpSgvARaC1GI8jtoLUQ5yqKCa/jLJiihhJJACSWUUBIooYSSQAkllFASKKGEkkAJJZRQEiihhJJA6ZkvAQYAmSLU4gMTN8cAAAAASUVORK5CYII=',
}
const userImages = {
	_default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAfCAYAAAD5h919AAAAlklEQVR42u3XUQrAIAgG4O5/g07WbdroocY2zcpfIUgQxh78sEmtEOS4OqmOViznzKYW7RYfQO0QArRFRjAYImEuEBzhsP2hL3agAz1QSqm9rM9mI27VGQuhQXYr2hYq35zE0MPAduUF+R6CtStUd+LRHmNUY9ww/JZPu5Sz/3wm3UCwVWRq/LXIa18sxahEXgCkWwYZN0PBrIIJv0V8AAAAAElFTkSuQmCC',
}

function generateData() {

	return []
}

function generateNodes(data) {
	const rooms = new Map()
	const owners = new Map()
	const nodes = []
	const nodesRooms = []
	const nodesOwners = []
	for (const object of data) {
		if (!rooms.get(object.roomId)) {
			rooms.set(object.roomId, true)
			nodesRooms.push({
				data: {
					id: 'room_'+object.roomId,
					type: 'room',
					roomId: object.roomId,
					roomImage: object.roomImage,
					parent: 'room_parent_'+object.roomId,
				}
			}, {
				data: {
					id: 'room_parent_'+object.roomId,
					type: 'room_parent',
					parent: 'owner_parent_' + object.roomOwnerId,
				}
			})
		}

		nodes.push({
			data: {
				id: object.id,
				type: 'furni',
				name: object.name,
				roomId: object.roomId,
				ownerId: object.furniOwnerId,
				parent: 'room_parent_'+object.roomId,
			}
		})

		if (!owners.get(object.furniOwnerId)) {
			owners.set(object.furniOwnerId, true)
			nodesOwners.push({
				data: {
					id: 'owner_' +object.furniOwnerId,
					type: 'owner',
					// roomId: object.roomId,
					ownerId: object.furniOwnerId,
					ownerImage: object.furniOwnerImage,
					parent: 'owner_parent_'+object.furniOwnerId,
				}
			}, {
				data: {
					id: 'owner_parent_'+object.furniOwnerId,
					type: 'owner_parent',
				}
			})
		}
		if (!owners.get(object.roomOwnerId)) {
			owners.set(object.roomOwnerId, true)
			nodesOwners.push({
				data: {
					id: 'owner_' +object.roomOwnerId,
					type: 'owner',
					// roomId: object.roomId,
					ownerId: object.roomOwnerId,
					ownerImage: object.roomOwnerImage,
					parent: 'owner_parent_'+object.roomOwnerId,
				}
			}, {
				data: {
					id: 'owner_parent_'+object.roomOwnerId,
					type: 'owner_parent',
				}
			})
		}
	}
	nodes.push(...nodesRooms, ...nodesOwners)

	return nodes
}

function generateTeleportEdges(nodes) {
	const edges = []
	nodes.forEach(node => {
		if (node.destination) {
			edges.push({
				from: node.id,
				to: node.destination,
				arrows: { to: true },
			})
		}
	})
	return edges
}
function generateRoomEdges(nodes) {
	const edges = []
	const furnis = new Map()
	const rooms = new Map()
	nodes.forEach(node => {
		if (node.data.type == 'furni') {
			if (!furnis.get(node.data.roomId)) {
				furnis.set(node.data.roomId, [node])
			} else {
				furnis.get(node.data.roomId).push(node)
			}
		}
	})
	nodes.forEach(node => {
		if (node.data.type === 'room') {
			rooms.set(node, furnis.get(node.data.roomId))
		}
	})
	for (const [roomNode, furnis] of rooms) {
		furnis.forEach(node => {
			edges.push({
				data: {
					id: node.data.id + "<->" + roomNode.data.id,
					source: node.data.id,
					target: roomNode.data.id,
					// length: 1,
					// color: 'green',
					// hidden: true,
				}
			})
		})
	}
	return edges
}
function generateOwnerEdges(nodes) {
	const edges = []
	const rooms = new Map()
	const owners = new Map()
	nodes.forEach(node => {
		if (node.data.type == 'furni') {
			if (!rooms.get(node.data.ownerId)) {
				rooms.set(node.data.ownerId, [node])
			} else {
				rooms.get(node.data.ownerId).push(node)
			}
		}
	})
	nodes.forEach(node => {
		if (node.data.type === 'owner') {
			owners.set(node, rooms.get(node.data.ownerId))
		}
	})
	for (const [ownerNode, rooms] of owners) {
		rooms.forEach(node => {
			edges.push({
				data: {
					id: node.data.id+"<->"+ownerNode.data.id,
					source: node.data.id,
					target: ownerNode.data.id,
					// length: 100,
					// color: 'red',
					// hidden: true,
				}
			})
		})
	}
	return edges
}
function generateStyle(nodes, stylesheet) {
	const furnis = new Map()
	const rooms = new Map()
	const owners = new Map()
	for (const node of nodes) {
		if (node.data.type === 'furni' && node.data.name) {
			furnis.set(node.data.name, true)
		} else if (node.data.type === 'room') {
			rooms.set(node.data.id, node.data.roomImage)
		} else if (node.data.type === 'owner') {
			owners.set(node.data.id, node.data.ownerImage)
		}
	}
	for (const [name] of furnis) {
		stylesheet.selector(`[name = "${name}"]`)
			.css({
				'background-image': `/icons/${name}_icon_a.png`
			})
	}
	for (const [id, url] of rooms) {
		stylesheet.selector(`#${id}`)
			.css({ 'background-image': url })
	}
	for (const [id, url] of owners) {
		stylesheet.selector(`#${id}`)
			.css({ 'background-image': url })
	}
	return stylesheet
}

const nodes = generateNodes(generateData())
var cy = cytoscape({
	container: document.getElementById('cy'),
	elements: {
		nodes,
		edges: [
			// ...generateRoomEdges(nodes),
			...generateOwnerEdges(nodes),
		]
	},
	style: generateStyle(nodes, cytoscape.stylesheet()
		.selector(':parent')
			.css({
				'background-opacity': 0.333,
			})
		.selector('node')
			.css({
				// 'height': 80,
				// 'width': 80,
				'background-fit': 'contain',
				'background-color': '#EEE',
				'background-clip': 'none',
				'background-image-containment': 'over',
				'background-image-smoothing': 'no'
				// 'border-width': 3,
				// 'border-opacity': 0.5
			})),
	layout: {
		name: 'fcose'
	}


});