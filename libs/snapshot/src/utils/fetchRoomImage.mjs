const DEFAULT = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAIAAABJObGsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNkVFQkNGRTZDOUIxMUU0QUFDNEQ0QzdCMTI0MzA5RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNkVFQkNGRjZDOUIxMUU0QUFDNEQ0QzdCMTI0MzA5RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI2RUVCQ0ZDNkM5QjExRTRBQUM0RDRDN0IxMjQzMDlGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI2RUVCQ0ZENkM5QjExRTRBQUM0RDRDN0IxMjQzMDlGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7dqZZwAAAgVJREFUeNrs3E1KA0EQxfEodSsXOYLoMV0ooheYRe5loGEI0aiZdFW96v6/RcgEAj0/aj7yBnL3+fGyIz1yDwGUUEJJoIQSSigJlFBCSaCEEkooCZRQQkmghBJKKAmUUEJJoISyQqziot9e39ubp+dHKG9C3O8fluVwfG2bIqBWDvH0w7YpAmpFEQVBrTSiFKgNgCgCasMgpoPaYIiJoDYkYgqoDYwYDGrDI4aB2iSIAaA2FaIrqE2I6ARq0yJ2B7XJEc9Al+WgNZXlEBUvOxsQ2yAM4G7piMdz09qKX/XF1v4ORbntcD5CbDjBn42w1ERbPOK2/KjWNkVAb53KgB34U0oEVLpFv0onHdQGQBQBtWEQ00FtMMREUNNxdG3RA0DnatFdQS3XMaVFdwK1lGN5J9Cid1+GTYXoCmoTIjqB2rSIl0AVKQsVketS5Vr0iohyU1kaUeWJ48yI3ShB7EOp9oAlBbEP5XrVkwUNQOw8lYKgYYgdKNvKTtsdEdBgxG6XHSnQFMTON0PpoImILrfoKaDpiI4/HMNARRDd6wxXUClEd0onUEHEIMqOoLKIoZQ3goojJlBuAC2BmEb5T9BCiMmUv4PWQpSgvARaC1GI8jtoLUQ5yqKCa/jLJiihhJJACSWUUBIooYSSQAkllFASKKGEkkAJJZRQEiihhJJA6ZkvAQYAmSLU4gMTN8cAAAAASUVORK5CYII='

/**
 * @param {Number} roomId
 * @param {String} [hotelId = "us"]
 */
export default function fetchRoomImage(roomId, hotelId = "us") {
	return fetch(`https://habbo-stories-content.s3.amazonaws.com/navigator-thumbnail/hh${hotelId}/${roomId}.png`)
		.then(async r => {
			const contentType = r.headers.get("content-type").toLowerCase()
			if (!contentType.startsWith("image/")) return DEFAULT

			const b = await r.arrayBuffer()
			return `data:${contentType};base64,${Buffer.from(b).toString("base64")}`;
		})
}
