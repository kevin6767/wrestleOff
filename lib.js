const haveIt = [];

function generateUniqueRandom(maxNr) {
  //Generate random number
  let random = (Math.random() * maxNr).toFixed();

  //Coerce to number by boxing
  random = Number(random);

  if(!haveIt.includes(random)) {
    haveIt.push(random);
    return random;
  } else {
    if(haveIt.length < maxNr) {
      //Recursively generate number
      return  generateUniqueRandom(maxNr);
    } else {
      console.log('No more numbers available.')
      return false;
    }
  }
}


function Wrestler(name, weight, wins, losses, teamName) {
  this.name = name
  this.id = generateUniqueRandom(10000)
  this.weight = weight
  this.wins = wins
  this.losses = losses
  this.teamName = teamName
  this.lossCol = []
  this.winCol = []
  this.eloRating = 1000
}

function Loss(name, oppName, eventName, weight, school, id) {
  this.oppName = oppName
  this.event = eventName
  this.weightAtEvent = weight
  this.loss = 'loss'
  this.school = school
  this.id = id
}

function Win(name, oppName, eventName, weight, school, id) {
  this.oppName = oppName
  this.event = eventName
  this.weightAtEvent = weight
  this.win = 'win'
  this.school = school
  this.id = id

}

function eloProcess(largeArrOfTeams) {
  largeArrOfTeams.forEach((team) => team.map((w, index) => {
    let winColArr = w.winCol.map(winOpp => console.log(winOpp.oppName))
    let lossColArr = w.winCol.map(lossOpp => largeArrOfTeams.forEach(team => team.find(lW => lW.name === lossOpp.name)))
  }))
}

module.exports = { Wrestler, Win, Loss, eloProcess}