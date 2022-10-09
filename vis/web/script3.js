const furniImages = {
	_default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAiAgMAAACo64hvAAAADFBMVEUAAAAiIiJmZmYAAACsDRZYAAAAAXRSTlMAQObYZgAAAJJJREFUeF5VkLENwkAMRb3BTcMo7xCI1kKIFAzAGmno0zECRZbICFcwQJoTBbKxFPyrpy9b8rNYPhIp+zmo11dUE9dfuQJ3rwB8sgPYZFEs51l2eLhJCxrkHfT869rBYRxkqSNw5CQLnkQNLky+AfVBEGTKuyiZmlPe2C4tQCh1UDNycQ31FXVz8zTH/KH42vbJL1U7ZSky7tx+AAAAAElFTkSuQmCC',
	teleport_door: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAfCAYAAADupU20AAAAAklEQVR4nGKkkSsAAAGESURBVGNgwAT/oZgowIRNMM9ekmiDsBrgE6rPcHZFHEkGIYP/OQ5S/6P1Bf4DDQFjEB+XQYw4DIBz3r//xlBU6Qdmz5+xh2HKgWcoegkagGxQfKoFmL1pzSW4QSy4/KGiJ8Rw59I7OF9QkAusEWaQhDAXQ83aO9gDEdkQkAZkADLILWcHw4u3EHG8BqB7AWQgOiDagM/f/8JdRZYBvJzMqBr//yfPBTAgJsKN2wBQFCHHADYXwAB6NP5fsW4Lg46ODoOOmgJDDgMk1LG5AAawuuDKlSsYYnJSvBiuwuYCxoggH3DoTMjTwaoBXQyrC2BJGVtCQgdDOCGR7QKiDAAlU2ITEl4XgAwhKyFNOvgcQ4zYhARORNdyJRi0JkOKLPTiDd0QFnSNYOde/ghn4zII2YD/yBphAMYmZBDIAEatyS/gLgBpfHaVhUFK+w9WgxgY/gGzO6YXGCG2QAw66cCJYgvYQAaIQeYHvqPIYasXQABs0HpRXrhLkDSi6MFlAIpB+NQCAOO2vFaVQL5dAAAAAElFTkSuQmCC',
	
}
const roomImages = {
	_default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAIAAABJObGsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNkVFQkNGRTZDOUIxMUU0QUFDNEQ0QzdCMTI0MzA5RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNkVFQkNGRjZDOUIxMUU0QUFDNEQ0QzdCMTI0MzA5RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI2RUVCQ0ZDNkM5QjExRTRBQUM0RDRDN0IxMjQzMDlGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI2RUVCQ0ZENkM5QjExRTRBQUM0RDRDN0IxMjQzMDlGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7dqZZwAAAgVJREFUeNrs3E1KA0EQxfEodSsXOYLoMV0ooheYRe5loGEI0aiZdFW96v6/RcgEAj0/aj7yBnL3+fGyIz1yDwGUUEJJoIQSSigJlFBCSaCEEkooCZRQQkmghBJKKAmUUEJJoISyQqziot9e39ubp+dHKG9C3O8fluVwfG2bIqBWDvH0w7YpAmpFEQVBrTSiFKgNgCgCasMgpoPaYIiJoDYkYgqoDYwYDGrDI4aB2iSIAaA2FaIrqE2I6ARq0yJ2B7XJEc9Al+WgNZXlEBUvOxsQ2yAM4G7piMdz09qKX/XF1v4ORbntcD5CbDjBn42w1ERbPOK2/KjWNkVAb53KgB34U0oEVLpFv0onHdQGQBQBtWEQ00FtMMREUNNxdG3RA0DnatFdQS3XMaVFdwK1lGN5J9Cid1+GTYXoCmoTIjqB2rSIl0AVKQsVketS5Vr0iohyU1kaUeWJ48yI3ShB7EOp9oAlBbEP5XrVkwUNQOw8lYKgYYgdKNvKTtsdEdBgxG6XHSnQFMTON0PpoImILrfoKaDpiI4/HMNARRDd6wxXUClEd0onUEHEIMqOoLKIoZQ3goojJlBuAC2BmEb5T9BCiMmUv4PWQpSgvARaC1GI8jtoLUQ5yqKCa/jLJiihhJJACSWUUBIooYSSQAkllFASKKGEkkAJJZRQEiihhJJA6ZkvAQYAmSLU4gMTN8cAAAAASUVORK5CYII=',
}
const userImages = {
	_default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAfCAYAAAD5h919AAAAlklEQVR42u3XUQrAIAgG4O5/g07WbdroocY2zcpfIUgQxh78sEmtEOS4OqmOViznzKYW7RYfQO0QArRFRjAYImEuEBzhsP2hL3agAz1QSqm9rM9mI27VGQuhQXYr2hYq35zE0MPAduUF+R6CtStUd+LRHmNUY9ww/JZPu5Sz/3wm3UCwVWRq/LXIa18sxahEXgCkWwYZN0PBrIIJv0V8AAAAAElFTkSuQmCC',
}

function getRandomRoomImage() {
	const hhId = 'hhbr'
	const roomId = 150133481
	return `https://habbo-stories-content.s3.amazonaws.com/navigator-thumbnail/${hhId}/${roomId}.png`
}

function getRandomOwnerImage() {
	const hotelDomain = 'com.br'
	const userName = 'WillianCesar.'
	return `https://www.habbo.${hotelDomain}/habbo-imaging/avatarimage?user=${userName}&headonly=1&size=b&gesture=sml&direction=2&head_direction=2&action=std`
}

function generateData() {
	return []
}

function generateNodes(data) {
	const rooms = new Map()
	const owners = new Map()
	const hosts = new Map()
	const nodes = []
	const nodesHosts = []
	const nodesRooms = []
	const nodesOwners = []
	let i = 0
	for (const object of data) {
		let pos

		if (!hosts.get(object.host)) {
			hosts.set(object.host, true)
			nodesHosts.push({
				// id: '_' +i++,
				id: object.host + '_host',
				type: 'host',
				x: 0,
				y: 0,
				fixed: true,
				label: object.host,
				size: 150,
				mass: 500,
				host: object.host,
			})
		}

		if (!rooms.get(object.roomId)) {
			const max = 3000
			const min = -3000
			pos = owners.get(object.roomOwnerId) || {
				x: Math.random() * (max - min) + min,
				y: Math.random() * (max - min) + min,
			}
			rooms.set(object.roomId, pos)
			nodesRooms.push({
				// id: '_' +i++,
				id: object.host + '_room_' + object.roomId,
				type: 'room',
				x: pos.x,
				y: pos.y,
				// label: 'room '+room,
				image: object.roomImage,
				brokenImage: roomImages._default,
				shape: 'image',
				// shape: 'square',
				// color: '#00cb82',
				opacity: .6,
				size: 50,
				mass: 100,
				host: object.host,
				roomId: object.roomId,
				roomOwnerId: object.roomOwnerId,
			})
		}

		nodes.push({
			// id: '_' +i++,
			id: object.host + '_furni_' + object.furniId+(object.bc ? '_'+object.roomId : ''),
			furniId: object.furniId,
			type: 'furni',
			x: rooms.get(object.roomId).x,
			y: rooms.get(object.roomId).y,
			// label: object.name,
			image: `/icons/${object.name}_icon_a.png`,//object.image,
			brokenImage: furniImages._default,
			shape: 'image',
			// shape: 'dot',
			// color: 'grey',
			opacity: .3,
			destination: object.destination,
			size: 10,
			host: object.host,
			roomId: object.roomId,
			furniOwnerId: object.furniOwnerId,
		})

		if (!owners.get(object.furniOwnerId)) {
			owners.set(object.furniOwnerId, rooms.get(object.roomId))
			nodesOwners.push({
				// id: '_'+i++,
				id: object.host + '_owner_' + object.furniOwnerId,
				type: 'owner',
				x: rooms.get(object.roomId).x,
				y: rooms.get(object.roomId).y,
				// label: 'owner '+owner,
				image: object.furniOwnerImage,
				brokenImage: userImages._broken,
				shape: 'image',
				// shape: 'hexagon',
				// color: '#8800cb',
				opacity: .8,
				size: 100,
				host: 'a',
				mass: 10,
				// roomId: object.roomId,
				furniOwnerId: object.furniOwnerId,
			})
		}
	}
	nodes.push(...nodesHosts, ...nodesRooms, ...nodesOwners)

	return nodes
}

function generateHostEdges(nodes) {
	const edges = []
	nodes.forEach(node => {
		if (node.host && node.type === 'room') {
			edges.push({
				from: node.id,
				to: node.host + '_host',
				length: 1000,
				hidden: true,
				// arrows: { to: true },
				// color: 'red',
				// physics: false,
			})
		}
	})
	return edges
}

function generateTeleportEdges(nodes) {
	const edges = []
	nodes.forEach(node => {
		if (node.destination) {
			edges.push({
				from: node.id,
				to: node.host + '_furni_' + node.destination,
				arrows: { to: true },
				color: 'red',
				physics: false,
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
		if (node.type == 'furni') {
			if (!furnis.get(node.roomId)) {
				furnis.set(node.roomId, [node])
			} else {
				furnis.get(node.roomId).push(node)
			}
		}
	})
	nodes.forEach(node => {
		if (node.type === 'room') {
			rooms.set(node, furnis.get(node.roomId))
		}
	})
	for (const [roomNode, furnis] of rooms) {
		furnis.forEach(node => {
			edges.push({
				from: node.id,
				to: roomNode.id,
				length: 1,
				color: 'green',
				hidden: true,
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
		if (node.type == 'furni') {
			if (!rooms.get(node.furniOwnerId)) {
				rooms.set(node.furniOwnerId, [node])
			} else {
				rooms.get(node.furniOwnerId).push(node)
			}
		}
	})
	nodes.forEach(node => {
		if (node.type === 'owner') {
			owners.set(node, rooms.get(node.furniOwnerId))
		}
	})
	for (const [ownerNode, rooms] of owners) {
		rooms.forEach(node => {
			edges.push({
				from: node.id,
				to: ownerNode.id,
				// arrows: { to: true },
				length: 100,
				// physics: false,
				color: 'red',
				hidden: true,
			})
		})
	}
	return edges
}

// VISUALIZAÇÃO DO GRAFO
let network
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
const sourceNodes = generateNodes(generateData()
	)//.filter(x => x.furniOwnerId === 80327583 || x.roomId === 151062352 || x.roomId === 151142101 || x.roomId === 151166342))
nodes.add([
	...sourceNodes,
]);
edges.add([
	...generateHostEdges(nodes),
	...generateTeleportEdges(nodes),
	...generateRoomEdges(nodes),
	...generateOwnerEdges(nodes),
]);


var container = document.body;

var data = {
	nodes: nodes,
	edges: edges
};
var options = {
	nodes: {
		color: {
			hover: {
				background: 'rgba(0,0,0,0.5)'
			},
		},
		brokenImage: roomImages._default,
		shapeProperties: {
			// useBorderWithImage: true,
			// useImageSize: true,
		}
	},
	edges: {
		smooth: false,
		width: 0.15,
	},
	layout: {
		// improvedLayout: false,
	},
	physics: {
		enabled: true,
		stabilization: false,
		timestep: 0.2,
		barnesHut: {
			damping: 1,
			avoidOverlap: 0,
			centralGravity: 5,
		},
	},
	interaction: {
		hideEdgesOnDrag: true,
		hover: true,
	},
}

function run() {
	console.time("visNetwork")
	network = new vis.Network(container, data, options);
	network.on("doubleClick", () => {
		network.fit();
	});


	network.on("stabilizationProgress", function (params) {
		var maxWidth = 496;
		var minWidth = 20;
		var widthFactor = params.iterations / params.total;
		var width = Math.max(minWidth, maxWidth * widthFactor);

		console.timeLog('visNetwork', Math.round(widthFactor * 100) + "%")
	});
	network.once("stabilizationIterationsDone", function () {
		console.timeEnd('visNetwork')
		console.log('done!')
	});
	network.on("selectNode", function (params) {
		const node = network.body.data.nodes._data[params.nodes[0]]
		console.log(node)
		if (params.nodes.length == 1) {
			if (network.isCluster(params.nodes[0]) == true) {
				network.openCluster(params.nodes[0]);
			} else if (node.type === 'room') {
				clusterByProperty('roomId', node => node.type === 'room', node.roomId)
			}
		}
	});
	function clusterByProperty(prop, mainNode, specificValue = null) {
		network.stopSimulation()
		const values = new Map()
		nodes.forEach(node => {
			if (!node[prop]) return
			if (specificValue && node[prop] !== specificValue) return

			let lastSize = (values.get(node[prop])?.size || 1)
			const value = {
				node: mainNode(node) ? node : (values.get(node[prop])?.node || node),
				size: lastSize + (mainNode(node) ? node.size : .1),
			}

			values.set(node[prop], value)
		})
		for (const [value, {node, size}] of values) {
			var clusterOptionsByData = {
				joinCondition: function (childOptions) {
					return childOptions[prop] == value;
				},
				clusterNodeProperties: {
					...node,
					id: node.id + "_cluster",
					size,
					mass: size * .3,
					x: undefined,
					y: undefined,
					label: false,
				},
			};
			network.cluster(clusterOptionsByData);
			network.stopSimulation()
		}
		network.startSimulation()
	}
	// clusterByProperty('roomId', node => node.type === 'room')
	network.startSimulation()
}
console.log('ready')