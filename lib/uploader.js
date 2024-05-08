
let axios = require('axios')
let BodyForm = require('form-data')
let { fromBuffer } = require('file-type')
let fetch = require('node-fetch')
let fs = require('fs')
let cheerio = require('cheerio')
const { FormData, Blob, fileFromPath } = require('formdata-node');
const { JSDOM } = require('jsdom')


function TelegraPh (Path) {
	return new Promise (async (resolve, reject) => {
		if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
		try {
			const form = new BodyForm();
			form.append("file", fs.createReadStream(Path))
			const data = await  axios({
				url: "https://telegra.ph/upload",
				method: "POST",
				headers: {
					...form.getHeaders()
				},
				data: form
			})
			return resolve("https://telegra.ph" + data.data[0].src)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

async function UploadFileUgu (input) {
	return new Promise (async (resolve, reject) => {
			const form = new BodyForm();
			form.append("files[]", fs.createReadStream(input))
			await axios({
				url: "https://uguu.se/upload.php",
				method: "POST",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
					...form.getHeaders()
				},
				data: form
			}).then((data) => {
				resolve(data.data.files[0])
			}).catch((err) => reject(err))
	})
}
/*
function webp2mp4File(path) {
	return new Promise((resolve, reject) => {
		 const form = new BodyForm()
		 form.append('new-image-url', '')
		 form.append('new-image', fs.createReadStream(path))
		 axios({
			  method: 'post',
			  url: 'https://s6.ezgif.com/webp-to-mp4',
			  data: form,
			  headers: {
				   'Content-Type': `multipart/form-data; boundary=${form._boundary}`
			  }
		 }).then(({ data }) => {
			  const bodyFormThen = new BodyForm()
			  const $ = cheerio.load(data)
			  const file = $('input[name="file"]').attr('value')
			  bodyFormThen.append('file', file)
			  bodyFormThen.append('convert', "Convert WebP to MP4!")
			  axios({
				   method: 'post',
				   url: 'https://ezgif.com/webp-to-mp4/' + file,
				   data: bodyFormThen,
				   headers: {
						'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
				   }
			  }).then(({ data }) => {
				   const $ = cheerio.load(data)
				   const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
				   resolve({
						status: true,
						message: "Xeorz",
						result: result
				   })
			  }).catch(reject)
		 }).catch(reject)
	})
}
*/
async function webp2mp4File(data) {
	try {
		let inPath = `./${randomBytes(3).toString('hex')}.gif`
		const input = fs.existsSync(data) ? data : save(data, inPath)
		const output = `./${randomBytes(3).toString('hex')}.mp4`
		const file = await new Promise((resolve) => {
			ffmpeg(input).outputOptions(["-pix_fmt yuv420p", "-c:v libx264", "-movflags +faststart", "-filter:v crop='floor(in_w/2)*2:floor(in_h/2)*2'", ]).toFormat('mp4').noAudio().save(output).on('exit', () => resolve(output))
		})
		let result = await fs.promises.readFile(file)
		return result
	} catch (error) {
		console.log(error);
	}
}
/*
async function webp2mp4File(path) {
    return new Promise(async (resolve, reject) => {
        try {
            // Read file from the path
            const fileBlob = await fileFromPath(path);

            const form = new FormData();
            form.set('new-image-url', '');
            form.set('new-image', fileBlob);

            const formHeaders = form.getHeaders();

            axios.post('https://s6.ezgif.com/webp-to-mp4', form, {
                headers: formHeaders,
            })
            .then(response => {
                const $ = cheerio.load(response.data);
                const file = $('input[name="file"]').val();
                if (!file) {
                    reject(new Error('Could not find the file parameter. The site might have changed.'));
                    return;
                }

                const conversionForm = new FormData();
                conversionForm.set('file', file);
                conversionForm.set('convert', 'Convert WebP to MP4!');

                axios.post(`https://ezgif.com/webp-to-mp4/${file}`, conversionForm, {
                    headers: conversionForm.getHeaders(),
                })
                .then(conversionResponse => {
                    const $$ = cheerio.load(conversionResponse.data);
                    const resultUrl = $$('div#output > p.outfile > video > source').attr('src');
                    if (!resultUrl) {
                        reject(new Error('Could not find the conversion result. The site might have changed.'));
                        return;
                    }
                    resolve({
                        status: true,
                        message: 'Conversion successful',
                        result: 'https:' + resultUrl,
                    });
                })
                .catch(error => reject(error));
            })
            .catch(error => reject(error));
        } catch (error) {
            reject(error);
        }
    });
}
*/
async function floNime(medianya, options = {}) {
const { ext } = await fromBuffer(medianya) || options.ext
        var form = new BodyForm()
        form.append('file', medianya, 'tmp.'+ext)
        let jsonnya = await fetch('https://flonime.my.id/upload', {
                method: 'POST',
                body: form
        })
        .then((response) => response.json())
        return jsonnya
}
/*
async function webp2mp4(source) {
  let form = new FormData()
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
  const blob = !isUrl && new Blob([source.toArrayBuffer()])
  form.append('new-image-url', isUrl ? blob : '')
  form.append('new-image', isUrl ? '' : blob, 'image.webp')
  let res = await fetch('https://s6.ezgif.com/webp-to-mp4', {
    method: 'POST',
    body: form
  })
  let html = await res.text()
  let { document } = new JSDOM(html).window
  let form2 = new FormData()
  let obj = {}
  for (let input of document.querySelectorAll('form input[name]')) {
    obj[input.name] = input.value
    form2.append(input.name, input.value)
  }
  let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
    method: 'POST',
    body: form2
  })
  let html2 = await res2.text()
  let { document: document2 } = new JSDOM(html2).window
  return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString()
}
*/
async function webp2png(source) {
  let form = new FormData()
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
  const blob = !isUrl && new Blob([source.toArrayBuffer()])
  form.append('new-image-url', isUrl ? blob : '')
  form.append('new-image', isUrl ? '' : blob, 'image.webp')
  let res = await fetch('https://s6.ezgif.com/webp-to-png', {
    method: 'POST',
    body: form
  })
  let html = await res.text()
  let { document } = new JSDOM(html).window
  let form2 = new FormData()
  let obj = {}
  for (let input of document.querySelectorAll('form input[name]')) {
    obj[input.name] = input.value
    form2.append(input.name, input.value)
  }
  let res2 = await fetch('https://ezgif.com/webp-to-png/' + obj.file, {
    method: 'POST',
    body: form2
  })
  let html2 = await res2.text()
  let { document: document2 } = new JSDOM(html2).window
  return new URL(document2.querySelector('div#output > p.outfile > img').src, res2.url).toString()
}


module.exports = { TelegraPh, UploadFileUgu, webp2mp4File, floNime, webp2png, webp2mp4}
