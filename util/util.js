let util = {}

util.toStone = function(num, fixed) {
	if (typeof fixed !== 'number')
		fixed = 1;
	var str = num;
	if (Math.abs(num) >= 100000000) {
		if (Math.abs(num) % 100000000 * Math.pow(10, fixed) <= 0)
			fixed = 0;
		if (fixed === 0) {
			str = Math.floor((num / 100000000)) + '亿';

		} else {
			let val = (num / 100000000).toFixed(fixed)
			let arr = (val + '').split('.')
			let res = arr[1] === '0' ? arr[0] : val
			str = res + '亿';
		}
	} else if (Math.abs(num) >= 10000) {
		if (Math.abs(num) % 10000 * Math.pow(10, fixed) <= 0)
			fixed = 0;
		if (fixed === 0) {
			str = Math.floor((num / 10000)) + '万';
		} else {
			str = (num / 10000).toFixed(fixed) + '万';
		}
	}
	return str;
};

util.toTime = function(time) {
	time = time.split('(')[1].split(')')[0]
	time = Number(time)
	let d = new Date(time)
	let year = d.getFullYear()
	let mouth = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)
	let day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate()
	let houer = d.getHours() > 9 ? d.getHours() : '0' + d.getHours()
	let min = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()
	let seconds = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds()
	return year + '-' +
		mouth + '-' + day + ' ' + houer + ':' + min + ':' + seconds
}

util.plantInfo = [{
	serial: 0,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 1,
}, {
	serial: 1,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 2,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 3,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 4,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 5,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 6,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 7,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 8,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 9,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 10,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 11,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 12,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 13,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 14,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 15,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 16,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 17,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 18,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 19,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 20,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 1,
}, {
	serial: 21,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 1,
}, {
	serial: 22,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 1,
}, {
	serial: 23,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 24,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 25,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 26,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}, {
	serial: 27,
	isPlanted: false,
	seedLevel: 1,
	kindOfSeed: 2,
}]
export default util;
