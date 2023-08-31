import { createReadStream } from 'fs'
import { PNG } from 'pngjs'

// Read PNG file
createReadStream('vortex-logo.png')
	.pipe(
		new PNG({
			filterType: 4,
		}),
	)
	.on('parsed', function () {
		// Create 2D array
		const width = this.width
		const height = this.height
		// const pixelData2D = new Array(height)
		// 	.fill(null)
		// 	.map(() => new Array(width).fill(null))
		const rowWeights: number[] = new Array(height).fill(null)

		for (let y = 0; y < height; y++) {
			let rowWeight = 0
			for (let x = 0; x < width; x++) {
				const idx = (width * y + x) << 2
				const red = this.data[idx]
				const green = this.data[idx + 1]
				const blue = this.data[idx + 2]
				rowWeight += (red + green + blue) / 3
			}
			rowWeights[y] = rowWeight / width / 255
		}

		console.dir(rowWeights)

		let topCursor = 0
		let bottomCursor = height - 1
		let topWeight = 0
		let bottomWeight = 0
		let topTotal = 0
		let bottomTotal = 0

		while (topCursor < bottomCursor) {
			if (topWeight > bottomWeight) {
				bottomTotal += rowWeights[bottomCursor]
				bottomWeight = bottomTotal / (height - bottomCursor--)
			} else {
				topTotal += rowWeights[topCursor]
				topWeight = topTotal / ++topCursor
			}
		}

		console.log('topWeight:', topWeight)
		console.log('bottomWeight:', bottomWeight)
		console.log('newCenter:', topCursor)
	})
