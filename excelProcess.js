const teamObject = require('./teamObject')

async function startExclProcess(teamArr, workbook) {

  teamArr.map(team => {
    if (team.length <= 0) {
      return
    }
    let worksheet = workbook.addWorksheet(`${team[0].teamName}`)
    worksheet.properties.defaultRowHeight = 80
    console.log(`--- Writing ${team[0].teamName} ---`)
    worksheet.columns = [
      {header: 'Team Name', key: 'teamName'},
      {header: 'Name', key: 'name'},
      {header: 'Weight', key: 'weight'},
      {header: 'Wins', key: 'wins'},
      {header: 'Losses', key: 'losses'},
      {header: 'Wins Over', key: 'winCol'},
      {header: 'Losses To', key: 'lossCol'},
      {header: 'Link To Profile', key: 'profile'},
    ]

    worksheet.columns.forEach((column, index) => {
      if(index <= 4) {
        column.width = column.header.length < 18 ? 18 : column.header.length
      }else{
        column.width = 45
      }
    })

    worksheet.getRow(1).font = {bold: true}

    team.forEach((e, index) => {
      console.log(`--- Writing ${e.name} ---`)

      worksheet.addRow({
        teamName: e.teamName,
        name: e.name,
        weight: e.weight,
        wins: e.wins,
        losses: e.losses,
        profile: {
          text: 'This Profile',
          hyperlink: `#\'${e.id}'!A1`
        }
      })
      let fixer = e.winCol.map(l => [l.oppName + ' ' + '(' + l.school + ')'])
      worksheet.getCell(`F${index + 2}`).value = fixer.join(` \r\n`)
      let lossFixer = e.lossCol.map(l => [l.oppName + ' ' + '(' + l.school + ')'])

      worksheet.getCell(`G${index + 2}`).value = lossFixer.join(` \r\n`).replace(/,/, '')
      worksheet.eachRow({includeEmpty: false}, function (row, rowNumber) {
        worksheet.getCell(`A${rowNumber}`).border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'none'}
        }

        const insideColumns = ['B', 'C', 'D', 'E']
        insideColumns.forEach((v) => {
          worksheet.getCell(`${v}${rowNumber}`).border = {
            top: {style: 'thin'},
            bottom: {style: 'thin'},
            left: {style: 'none'},
            right: {style: 'none'}
          }
        })

        worksheet.getCell(`F${rowNumber}`).border = {
          top: {style: 'thin'},
          left: {style: 'none'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
        worksheet.getCell(`G${rowNumber}`).border = {
          top: {style: 'thin'},
          left: {style: 'none'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
      })
      let rowIndex = 1;
      for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
        worksheet.getRow(rowIndex).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      }
      writePlayerProfile(e, workbook)
      workbook.xlsx.writeFile('Wrestlers.xlsx')
    })
  })
}

async function writePlayerProfile(e, workbook) {
  let worksheet = workbook.addWorksheet(`${e.id}`)
  worksheet.properties.defaultColWidth = 30
  console.log(`--- Writing ${e.name} Player Profile ---`)
  worksheet.columns = [
    {header: 'Team Name', key: 'teamName'},
    {header: 'Name', key: 'name'},
    {header: 'Weight', key: 'weight'},
    {header: 'Wins', key: 'wins'},
    {header: 'Losses', key: 'losses'},
    {header: 'Wins Over', key: 'winCol'},
    {header: 'Losses To', key: 'lossCol'},
  ]

  worksheet.addRow({
    teamName: e.teamName,
    name: e.name,
    weight: e.weight,
    wins: e.wins,
    losses: e.losses,
  })
  let fixer = e.winCol.map(l => [l.oppName + ' ' + '(' + l.school + ')'])
  worksheet.getCell(`F${2}`).value = fixer.join(` \r\n`)
  let lossFixer = e.lossCol.map(l => [l.oppName + ' ' + '(' + l.school + ')'])

  worksheet.getCell(`G${2}`).value = lossFixer.join(` \r\n`).replace(/,/, '')


}

async function addNavigationSheet(workbook) {
  const navigation = workbook.getWorksheet('Navigation')
  navigation.eachRow({includeEmpty: false}, function (row, rowNumber) {
    navigation.getCell(`A${rowNumber}`).border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'none'}
    }
  })
  navigation.columns = [
    {header: 'Team Name', key: 'teamName'},
  ]
  teamObject.teamsToScrape.forEach((e, index) => {
    navigation.addRow({
      teamName: {
        text: e.name,
        hyperlink: `#\'${e.name}'!A1`
      }
    })
  })
  let rowIndex = 1;
  for (rowIndex; rowIndex <= navigation.rowCount; rowIndex++) {
    navigation.getRow(rowIndex).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  }
}

module.exports = { startExclProcess, addNavigationSheet }