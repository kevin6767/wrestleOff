const puppeteer = require('puppeteer')
const p = require('./excelProcess')
const crawler = require('./crawler')
const teamObject = require('./teamObject')

async function main() {
  let teamsArr = []
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
    await dialog.dismiss();
  });

  await page.goto('https://www.trackwrestling.com/seasons/MainFrame.jsp?TIM=1637800694882&twSessionId=swcvsilvlp&loadBalanced=true&pageName=Results.jsp%3FTIM%3D1637800695660%26twSessionId%3Dswcvsilvlp')
  await page.click(`#pageGridFrame > div:nth-child(3) > div > div.publicLogin > a`)
  await page.waitForTimeout(5000)
  let optionValue = await page.$$eval('option', options => options.find(o => o.innerHTML === `Tennessee Secondary School Athletic Association`)?.value)
  await page.select('#gbId', optionValue);

  console.log(`--- Selecting ${optionValue} ---`)
  await page.click(`#gbFrame > div.buttonRow.inputButton > div > input`)
  await page.waitForTimeout(5000)

  for (let i = 0; i < teamObject.teamsToScrape.length; i++) {
    let singleTeamArr = []
    console.log(`--- Navigating to ${teamObject.teamsToScrape[i].name}'s Page ---`)
    await page.goto(`https://www.trackwrestling.com/seasons/MainFrame.jsp?TIM=1637824072444&twSessionId=swcvsilvlp&loadBalanced=true&pageName=TeamRoster.jsp%3FTIM%1637824072444%26twSessionId%3Dswcvsilvlp%26teamId%${teamObject.teamsToScrape[i].id}`)
    await crawler.beginScraping(page, singleTeamArr, teamObject.teamsToScrape[i].id)
    await page.waitForTimeout(10000)
    teamsArr.push(singleTeamArr)

  }
  await console.log(`--- Starting Spreadsheet Process ---`)
  await p.startExclProcess(teamsArr)

}




main().then(r => console.log('done'))
