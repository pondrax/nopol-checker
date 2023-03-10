import Tesseract from 'tesseract.js';
import fs from 'fs'

export async function checkNopol(nopol: string): Promise<string> {
  async function saveImage(url: RequestInfo | URL, cookie: string) {
    // console.log(url)
    const req = await fetch(url, {
      headers: {
        cookie
      }
    });
    const buffer = await req.arrayBuffer();
    // fs.writeFileSync('./image.png', Buffer.from(buffer));
    return Buffer.from(buffer)
  }

  async function getCaptcha() {
    const req = await fetch(`https://info.dipendajatim.go.id/logic_pkb.php?act=captcha`);
    const imgUrl = 'https://info.dipendajatim.go.id' + (await req.text()).match(/src="([^"]*)"/)![1];
    const cookie = req.headers.get('set-cookie') || '';
    const buffer = await saveImage(imgUrl, cookie);
    return {cookie,buffer};
  }

  async function recognize(buffer:any) {
    const res = await Tesseract.recognize(
      buffer,
      // 'image.png',
      'eng',{
        // workerPath: 'https://unpkg.com/tesseract.js@v4.0.2/dist/worker.min.js',
        // langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        corePath: './tesseract-core.wasm.js',
      }
    );
    return String(res.data.text).replace('\n', '');
  }

  async function check(props: { cookie: string; nopol: string; code: string; }) {
    console.log('Checking', props);
    const req = await fetch("https://info.dipendajatim.go.id/logic_pkb.php?act=cek", {
      "headers": {
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "cookie": props.cookie,
        "Referer": "https://info.dipendajatim.go.id/index.php?page=info_pkb",
        "Referrer-Policy": "same-origin",
      },
      "body": `nopol=${props.nopol}&code=${props.code}`,
      "method": "POST"
    });
    return await req.text();
  }
  const {cookie,buffer} = await getCaptcha() || '';
  const code = await recognize(buffer);
  // const nopol = 'w 3240 lc';
  const result = JSON.parse(await check({ cookie, nopol, code }));
  if (result.msg) {
    return checkNopol(nopol);
  }
  return result.html;
}

// const result = await checkNopol('W 3240 LC')
// console.log(result)