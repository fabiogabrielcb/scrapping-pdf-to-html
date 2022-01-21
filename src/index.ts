import puppeteer from "puppeteer"
import path from "path"
import download from "download"

const filePath = path.relative(
	process.cwd(),
	path.join(__dirname, "../test.pdf")
)

async function run() {
	const browser = await puppeteer.launch({
		headless: false,
		slowMo: 50,
	})

	// page in browser
	const page = await browser.newPage()

	await page.goto("https://www.sodapdf.com/pt/pdf-in-html/", {
		waitUntil: "networkidle2",
	})

	const elementHandle = await page.$("input[type=file]")
	await elementHandle?.uploadFile(filePath)

	await page.waitForSelector("a.btn.btn-secondary.btn-icon", { timeout: 0 })

	const fileURL = await page.$eval("a.btn.btn-secondary.btn-icon", (el) =>
		el.getAttribute("href")
	)
	const filePathToSave = `${__dirname}/files`

	await download(fileURL!, filePathToSave)
	console.log("Download Completed")

	return await browser.close()
}

run()
