const puppeteer = require('puppeteer')
require('cheerio')
async function main(){
  const oppTeamIds = [
    {
      name: 'Fairview',
      id: '3D1163172138'
    },
    {
      name: 'Harpeth',
      id: '3D1163191138'
    }

  ]
  let teamsArr = []
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();
  });
  await page.goto('https://www.trackwrestling.com/seasons/MainFrame.jsp?TIM=1637800694882&twSessionId=swcvsilvlp&loadBalanced=true&pageName=Results.jsp%3FTIM%3D1637800695660%26twSessionId%3Dswcvsilvlp')
  await page.click(`#pageGridFrame > div:nth-child(3) > div > div.publicLogin > a`)
  await page.waitForTimeout(5000)
  let optionValue = await page.$$eval('option', options => options.find(o => o.innerHTML === `Tennessee Secondary School Athletic Association`)?.value)
  await page.select('#gbId', optionValue);
  await page.click(`#gbFrame > div.buttonRow.inputButton > div > input`)
  await page.waitForTimeout(5000)
  for (let i = 0; i < oppTeamIds.length; i++) {
    let singleTeamArr = []
    await page.goto(`https://www.trackwrestling.com/seasons/MainFrame.jsp?TIM=1637824072444&twSessionId=swcvsilvlp&loadBalanced=true&pageName=TeamRoster.jsp%3FTIM%3D1637824091238%26twSessionId%3Dswcvsilvlp%26teamId%${oppTeamIds[i].id}`)
    beginScraping(page, singleTeamArr)
    await page.waitForTimeout(10000)
    teamsArr.push(singleTeamArr)
    console.log('firing')

  }
  console.log(teamsArr)

}

async function beginScraping(page, holderArr) {
  await page.waitForTimeout(5000)
  const frame = await page.frames().find(m => m.name() === 'PageFrame')
  const table = await frame.$('#pageGridFrame > table')
  const count = await table.$$eval('#pageGridFrame > table > tbody > tr', el => el.length )
  let teamName = await frame.$eval(`#pageHeaderFrame`, element => element.textContent)
  for (let i = 3; i < count; i++) {
    let name = await table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`, el => el.textContent)
    let weight = await Number(table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${i}) > td:nth-child(3)`, el => el.textContent))
    let record = await table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${i}) > td:nth-child(7)`, el => el.textContent)
    let recordSanitized = record.split('-')
    let wins = recordSanitized[0]
    let losses = recordSanitized[1]
    holderArr.push(new Wrestler(name,weight, wins, losses, teamName))

  }

  return



}

function Wrestler(name, weight, wins, losses, teamName) {
  this.name = name
  this.weight = weight
  this.wins = wins
  this.losses = losses
  this.teamName = teamName
}

main().then(r => console.log('done'))
