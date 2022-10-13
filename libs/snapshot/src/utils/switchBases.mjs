function base(source, from, to, mapping) {
	let result = [0];
	for (let j = 0; j < source.length; j++) {
		let carry = mapping.indexOf(source[j]);
		for (let i = 0; carry || i < result.length; i++) {
			let next = (result[i] || 0) * from + carry;
			result[i] = next % to;
			carry = Math.floor(next / to);
		}
	}
	let string = "";
	for (let j = result.length; j-- > 0;)
		string += mapping[result[j]];
	return string;
}

export const _32to10 = x => base(x, 32, 10, '0123456789abcdefghijklmnopqrstuv')
export const _10to32 = x => base(x, 10, 32, '0123456789abcdefghijklmnopqrstuv')
