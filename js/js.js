const TABLEAU_LIMIT = 5;
console.log('market');
market = new Market();
console.log('config');
config = new Config();

console.log('game');
game = new Game()
console.log('ui');
ui = new UI()
market.refresh();
function randNum(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}