const SEQ = ' \'"“”‘’¹²³!#$&%()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuüvwxyz{|}~½¼¡«»×'.split('')

export function flip(targetClassName) {

	const flaps = []

	let idx = .5

	document.querySelectorAll(targetClassName).forEach(parent => {

		const lines = parent.innerText.trimEnd().split('\n').map(line => line.trimEnd().replaceAll('\t', ''))

		parent.innerHTML = ''

		if (parent.dataset.offset) {
			idx = parseInt(parent.dataset.offset)
		}

		lines.forEach(line => {

			const el = append(parent, 'SPAN')
			// el.dataset.paused = "false"
			el.dataset.paused = "true"
			new IntersectionObserver(function (entries) {
				if (entries[0].isIntersecting === true) {
					el.dataset.paused = "false"
				}
			}, { threshold: [0] }).observe(el)

			const f = new Flap(el, SEQ)

			f.setTarget(line)
			f.update()
			f.heat(idx++ * .1, 1)
			f.targetEl.addEventListener('mouseenter', e => {
				f.shuffle()
			})
			// if (e.dataset.immediate) {
			// 	f.immediate()
			// }
			flaps.push(f)
		})
	})


	let frame = 0
	requestAnimationFrame(loop)

	document.querySelectorAll('.flap').forEach(e => {
		e.classList.remove('hidden')
	})

	function loop(t) {
		requestAnimationFrame(loop)

		//if (frame++ % 2 == 0) {
		for (const f of flaps) {
			f.flap()
			f.update()
		}
		//
	}
}

class Flap {
	constructor(el, sequence) {
		this.targetEl = el
		this.sequence = sequence
		this.target = []
		this.state = []
		this.delay = []
	}
	setTarget(str) {
		// adjust state lengh
		// while(this.state.length > 0 && this.state[this.state.length-1] == 0) {
		// 	this.state.pop()
		// 	this.delay.pop()
		// }
		const s = str.split('')
		// const len = Math.max(s.length, this.state.length)
		const len = s.length

		s.forEach((e, i) => {
			const idx = this.sequence.indexOf(e)
			if (idx == -1) {
				// console.warn("Not in sequence: " + e)
				this.sequence.push(e)
				this.target[i] = this.sequence.length - 1
			} else {
				this.target[i] = idx
			}
		})

		this.state = Array(len).fill(0)
		this.delay = Array(len).fill(0)

		// while(this.state.length < this.target.length) {
		// 	this.state.push(0)
		// 	this.delay.push(0)
		// }
	}
	immediate() {
		for (let i = 0; i < this.state.length; i++) {
			this.state[i] = this.target[i]
		}
		this.delay.fill(0)
	}
	shuffle() {
		const offs = Math.floor(Math.random() * 10) + 15
		for (let i = 0; i < this.state.length; i++) {
			this.state[i] = (this.state[i] + this.sequence.length - offs) % this.sequence.length
			this.delay[i] = Math.floor(Math.random() * 30)
		}
	}
	heat(offs, mul) {
		for (let i = 0; i < this.delay.length; i++) {
			this.delay[i] = offs + i * mul
		}
	}

	flap() {
		if (this.targetEl.dataset.paused == "false") {
			this.state.forEach((e, idx) => {
				if (this.delay[idx] > 0) {
					this.delay[idx]--
				} else {
					if (this.state[idx] != this.target[idx]) this.state[idx] = (this.state[idx] + 1) % this.sequence.length
				}
			})
		}
	}

	update() {
		let out = this.state.reduce((a, b, idx) => {
			let c = this.sequence[this.state[idx]]
			if (c == '>') c = '&gt;'
			else if (c == '<') c = '&lt;'
			return a + c
		}, '')


		if (this.targetEl.innerHTML != out) {
			this.targetEl.innerHTML = out
		}
	}
}

function append(parent, nodeType, attr) {
	const n = document.createElement(nodeType)
	for (const a in attr) {
		n[a] = attr[a]
	}
	parent.appendChild(n)
	return n

}