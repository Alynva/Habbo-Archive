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

webConn.run()



const gEarthConn = new GEarthConnection()

gEarthConn.on('gearthConnection', () => {
	status.gEarthConnected = true
})

gEarthConn.on('habboConnection', () => {
	status.habboConnected = true
})

gEarthConn.run()
