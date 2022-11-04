const TABLEAU_LIMIT = 6;
console.log('market');
market = new Market();
console.log('config');
config = new Config();

console.log('game');
game = new Game()
console.log('ui');
ui = new UI()
market.refresh();

ui.refresh()
function randNum(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}