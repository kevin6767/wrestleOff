
function Wrestler(name, weight, wins, losses, teamName) {
  this.name = name
  this.weight = weight
  this.wins = wins
  this.losses = losses
  this.teamName = teamName
  this.lossCol = []
  this.winCol = []
}

function Loss(name, oppName, eventName, weight, school) {
  this.oppName = oppName
  this.event = eventName
  this.weightAtEvent = weight
  this.loss = 'loss'
  this.school = school
}

function Win(name, oppName, eventName, weight, school) {
  this.oppName = oppName
  this.event = eventName
  this.weightAtEvent = weight
  this.win = 'win'
  this.school = school
}

module.exports = { Wrestler, Win, Loss}