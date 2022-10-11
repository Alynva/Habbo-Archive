const DEFAULT = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAfCAYAAAD5h919AAAAlklEQVR42u3XUQrAIAgG4O5/g07WbdroocY2zcpfIUgQxh78sEmtEOS4OqmOViznzKYW7RYfQO0QArRFRjAYImEuEBzhsP2hL3agAz1QSqm9rM9mI27VGQuhQXYr2hYq35zE0MPAduUF+R6CtStUd+LRHmNUY9ww/JZPu5Sz/3wm3UCwVWRq/LXIa18sxahEXgCkWwYZN0PBrIIJv0V8AAAAAElFTkSuQmCC'

/**
 * @param {String} userName
 * @param {String} [domain = "www.habbo.com"]
 */
export default function fetchAvatarImage(userName, domain = "www.habbo.com") {
	return fetch(`https://${domain}/habbo-imaging/avatarimage?user=${userName}&headonly=1&size=b&gesture=sml&direction=2&head_direction=2&action=std`)
		.then(async r => {
			const contentType = r.headers.get("content-type").toLowerCase()
			if (!contentType.startsWith("image/")) return DEFAULT

			const b = await r.arrayBuffer()
			return `data:${contentType};base64,${Buffer.from(b).toString("base64")}`;
		})
}
