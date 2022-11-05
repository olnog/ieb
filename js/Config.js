class Config {
	
	actions = [
		'clickButton', 'increment', 'decrement', 
		'market-buy', 'market-discardCard', 'market-refresh',   
		'market-draw', 'convert', 'wipe', 
		'destroy', 'win'
	];
	cardsChecked = [];	
	checking = null;
	checkingDelay = 250;
	defaultDistributedCardTypes = ['clicks', 'available', 'reloads', 'marketLimit'];
	defaultStock = [
		0, 10, 5, 
		5, TABLEAU_LIMIT, 3, 
		1, 0, 0,
		0, 0,
	];
	distributedCardTypes = null;
	finishCheckingCondition = null;	
	numOfTurns = 0;	
	stock = [];
	tableau = [];	
	types = [
		'clicks', 'available', 'reloads', 		
		'marketLimit', 'tableauLimit', 'initMarket', 
		'wipes', 'destroyed', 'wins', 
		'losses', 'restarts', 
	];	
		
	watDo = {
		captions: [
			'click button', '+',  '-', 
			'buy', 'discard card from market', 'refresh market',  
			'draw a new card into the market', 'convert', 'wipe the tableau', 
			null, 'win the game',
		],
		chances: [
			10, 60, 40, 
			40, 40, 40, 
			5, 10, 10,
			10, 1,
			
		],
		probabilities: [],
		probSum: null,
	}
	
	when = {
		captions: [
			'button is clicked', 'incrementing ', 'decrementing ', 
			'card is bought', 'card is discarded from market', 'market is refreshed', 
			'a new card is drawn to the market', 'converting', 'wiping the tableau',
			'a card is destroyed', 'winning the game',
		],
		chances: [
			1, 3, 3, 
			3, 3, 3, 
			3, 3, 1,
			1, 1,
		],
		probabilities: [],
		probSum: null,
	};
	
	
	constructor(){
		console.log('Integrity check: ', 
			 this.when.captions.length == this.watDo.captions.length, 
			 this.when.chances.length == this.watDo.chances.length, 
			 this.when.captions.length == this.watDo.chances.length,
			this.actions.length == this.when.captions.length);
		let whenSum = 0, doSum = 0;
		for (let i in this.when.chances){
			whenSum += this.when.chances[i];
			doSum += this.watDo.chances[i];
			this.watDo.probabilities[i] = doSum;
			this.when.probabilities[i] = whenSum;
			
		}
		this.when.probSum = whenSum;
		this.watDo.probSum = doSum;
		this.stock = this.defaultStock.slice();
		this.reset();
	}
		
	convert (from, quantity, to){
		if (this.stock[this.types.indexOf(from)] < 1){
			game.destroy('convert', from, to);
			return;
		}
		this.stock[this.types.indexOf(from)]--;
		this.stock[this.types.indexOf(to)] += quantity;
		game.doCheck('convert', from, to);
		
	}
  
	decrement(name, quantity){
		this.stock[this.types.indexOf(name)] -= quantity;
		
		game.doCheck('decrement', name, null);
	}
	
	increment(name, quantity){
		this.stock[this.types.indexOf(name)] += quantity;		
		game.doCheck('increment', name, null);
	}
	
	reset(){
		let saveArr = [], saveThis = ['wins', 'restarts', 'losses'];
		for (let i in saveThis){			
			saveArr[i] = this.stock[this.types.indexOf(saveThis[i])];
		}
		this.numOfTurns = 0;
		this.stock = this.defaultStock.slice();
		this.distributedCardTypes = this.defaultDistributedCardTypes.slice();
		this.resetCardsChecked();
		this.tableau = [];
		market.discardAll(true);		
		for (let i in saveThis){
			this.stock[this.types.indexOf(saveThis[i])] = saveArr[i];		
		}		
	}
	resetCardsChecked(){
		
		this.cardsChecked = [];
	}
  

}