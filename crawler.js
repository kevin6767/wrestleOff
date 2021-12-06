const lib = require('./lib')

async function beginScraping(page, holderArr, teamId) {
  await page.waitForTimeout(5000)
  const frame = await page.frames().find(m => m.name() === 'PageFrame')
  const table = await frame.$('#pageGridFrame > table')
  const count = await table.$$eval('#pageGridFrame > table > tbody > tr', el => el.length)
  let teamName = await frame.$eval(`#pageHeaderFrame`, element => element.textContent)

  console.log(`--- Scraping ${teamName} ---`)

  for (let i = 3; i < 4; i++) {
    let name = await table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`, el => el.textContent)
    let weight = await table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`, el => el.textContent)
    let record = await table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${i}) > td:nth-child(7)`, el => el.textContent)
    let recordSanitized = record.split('-')
    let wins = recordSanitized[0]
    let losses = recordSanitized[1]
    holderArr.push(new lib.Wrestler(name, weight, wins, losses, teamName))

  }
  await scrapeWinsAndLosses(page, holderArr, teamId, count)

}



async function cleaningSummary(summary, wrestlerName, event, weightAtEvent, profile) {
  let summaryBreakUp = summary.split(' ')
  let over = summaryBreakUp.indexOf('over')
  let regexFix = /(?:.*?\s+-\s+)?([^()]+)\s+\(([^()]+)\)\s+over\s+(.*)\s+\((?![^()]*\d[-:]\d[^()]*\))([^()]*)\)/.exec(summary)
  if (over < 0) {
    return profile.winCol.push({
      oppName: 'Received Bye',
      school: '(Bye)'
    })
  } else {
    let winner = regexFix[1].trim()
    let winnerSchool = regexFix[2].trim()
    let loser = regexFix[3].trim()
    let loserSchool = regexFix[4].trim()

    if (winner === wrestlerName) {
      return profile.winCol.push(new lib.Win(wrestlerName, loser, event, weightAtEvent, loserSchool))
    } else if (loser === wrestlerName) {
      return profile.lossCol.push(new lib.Loss(wrestlerName, winner, event, weightAtEvent, winnerSchool))
    }
  }
}

async function scrapeWinsAndLosses(page, holderArr, teamId, count) {
  console.log(`--- Navigating to Schedule ---`)

  await page.waitForTimeout(2000)
  const frame = await page.frames().find(m => m.name() === 'PageFrame')
  await frame.click(`#moreLinks`)

  await page.waitForTimeout(2000)
  await frame.click(`#moreTopLinksFrame > ul > li:nth-child(3) > a`)

  console.log(`--- Scraping Wrestlers Matches ---`)
  await page.waitForTimeout(5000)

  for (let i = 0; i < holderArr.length; i++) {
    let [optElementHandle] = await frame.$x(`//select[@id="wrestler"]//option[contains(text() , "${holderArr[i].name}")]`)
    const text = await optElementHandle.getProperty('value')
    const value = await text.jsonValue()

    await frame.select('#wrestler', value)
    await page.waitForTimeout(3000)
    console.log(`--- Scraping ${holderArr[i].name}'s Matches`)
    let table = await frame.$(`#pageGridFrame > table`)
    const count = await table.$$eval('#pageGridFrame > table > tbody > tr', el => el.length)

    for (let j = 4; j < count + 1; j++) {
      if (await table.$(`#pageGridFrame > table > tbody > tr.noRecords`)) {
        continue
      }
      let event = await table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${j}) > td:nth-child(3)`, el => el.textContent)
      let weightAtEvent = await table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${j}) > td:nth-child(4)`, el => el.textContent)
      let summary = await table.$eval(`#pageGridFrame > table > tbody > tr:nth-child(${j}) > td:nth-child(5)`, el => el.textContent)


      await cleaningSummary(summary, holderArr[i].name, event, weightAtEvent, holderArr[i])
    }

  }
}

module.exports = { beginScraping }