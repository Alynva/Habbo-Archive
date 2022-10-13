import { _10to32, _32to10 } from "./switchBases.mjs"

export const EPOCH = (new Date(2022, 9, 1, 9, 16, 0, 0)).getTime()

export const HOSTS = {
	'game-us.habbo.com': 1,
	'game-br.habbo.com': 2,
}

const SIZES = [10, 1, 7, 7, 7]

/** @param {String} sf */
export const splitSnowflake = sf => SIZES
	.map((p => l => +_32to10(sf.slice(p, p += l)))(0))

/** @param {Number[]} data */
export const joinSnowflake = data => SIZES
	.reduce((p, c, i) => p + _10to32('' + data[i]).padStart(c, "0"), "")
