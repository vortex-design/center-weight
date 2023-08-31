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

				// Read RGBA values
				const red = this.data[idx]
				const green = this.data[idx + 1]
				const blue = this.data[idx + 2]

				rowWeight += (red + green + blue) / 3
				// const alpha = this.data[idx + 3]

				// pixelData2D[y][x] = { red, green, blue, alpha }
			}
			rowWeights[y] = rowWeight / width / 255
		}

		console.dir(rowWeights)
	})
