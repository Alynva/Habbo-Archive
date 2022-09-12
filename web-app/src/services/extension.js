document.querySelector("form#wsConnection").addEventListener('submit', onWsConnectionSubmit)
document.querySelector("button#wsDisconnect").addEventListener('click', disconnect)

/** @param {SubmitEvent} evt */
function onWsConnectionSubmit(evt) {
	evt.preventDefault()

	const data = new FormData(evt.target)
	const port = data.get("port")

	connect(port != "" ? Number(port) : undefined)

	evt.target.reset()
}

/** @type {WebSocket} */
let socket

function connect(port = 7247) {
	console.log({port})
	if (Number.isNaN(port)) return

	disconnect()

	socket = new WebSocket('ws://localhost:' + port)

	socket.addEventListener('open', () => {
		document.querySelector("#status").innerText = "Connected"
		socket.send('Hello Server!')
	})

	socket.addEventListener("close", () => {
		document.querySelector("#status").innerText = "Disconnected"
	})

	socket.addEventListener('message', event => {
		onMessage(event.data)
	})
}

function disconnect() {
	if (socket instanceof WebSocket) socket.close()
}

function onMessage(message) {
	document.querySelector("#status").innerText += '\n' + message

}