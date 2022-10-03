import Status from './utils/status.js'
import WebsiteConnection from './services/WebsiteConnection.js'
import GEarthConnection from './services/GEarthConnection.js'



const status = new Status()

status.on("stateChange", () => {
	console.log(status)
})



const webConn = new WebsiteConnection()

webConn.on('connectionChange', state => {
	status.websiteConnected = state
})

webConn.on('init', port => {
	console.log("Website Server initialized at %s", port)
})

webConn.run()



const gEarthConn = new GEarthConnection()

gEarthConn.on('gearthConnection', state => {
	status.gEarthConnected = state
})

gEarthConn.on('habboConnection', state => {
	status.habboConnected = state
})

gEarthConn.on('snapshotReady', roomData => {
	const {
		roomSummary,
		snapshotPacket,
	} = roomData
	webConn.notifyRoom(roomSummary, snapshotPacket)
		.then(() => gEarthConn.roomNotifiedAlert())
		.catch(() => {})
})

gEarthConn.run()
