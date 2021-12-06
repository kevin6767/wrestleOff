
function Wrestler(name, weight, wins, losses, teamName) {
  this.name = name
  this.id = Math.floor(Math.random() * 10000)
  this.weight = weight
  this.wins = wins
  this.losses = losses
  this.teamName = teamName
  this.lossCol = []
  this.winCol = []
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

module.exports = { Wrestler, Win, Loss}