class Config {
	
	actions = [
		'clickButton', 'increment', 'decrement', 
		'market-buy', 'market-discardCard', 'market-refresh',   
		'market-draw', 'convert', 'wipe', 
		'destroy', 'win', 'market-claim',
	];
	audio = [];
	audioOn = false;
	audioFiles = ['clickButton', 'increment', 'decrement', 
		'market-buy', 
		'market-refresh',   
		'market-draw', 'convert', 
		'destroy', 'win',  'loss'];
	cardsChecked = [];	
	checking = null;
	checkingDelay = 400;
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
			"click the <img src='img2/available.png' > button", '+',  '-', 
			'buy', 'discard card from market', 'refresh market',  
			'draw a new card into the market', '', 'wipe the tableau', 
			null, 'win the game', null,
		],
		chances: [
			5, 10, 10, 
			10, 10, 10, 
			10, 10, 10,
			10, 10, 10,
			
		],
		probabilities: [],
		probSum: null,
	}
	
	when = {
		captions: [
			"the <img src='img2/available.png' > button is clicked", '+', '-', 
			'a card is bought', 'a card is discarded from market', "the <img src='img2/reloads.png' > button is clicked", 
			'a new card is drawn to the market', '', 'wiping the tableau',
			'a card in the tableau is destroyed', 'winning the game', 'claiming a card in the market',
		],
		chances: [
			10, 10, 10, 
			10, 10, 10, 
			10, 10, 10,
			5, 10, 10,
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
		for (let filename of this.audioFiles){
			this.audio[filename] = new Audio('mp3/' + filename + '.mp3');
			//this.audio[filename].play();
			//console.log('playing filename:' + filename, this.audio[filename]);
		}
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
		game.playAudio('convert');
		ui.refresh();
		game.doCheck('convert', from, to);
		
	}
  
	decrement(name, quantity){
		this.stock[this.types.indexOf(name)] -= quantity;		
		game.playAudio('decrement');
		game.doCheck('decrement', name, null);
	}
	
	increment(name, quantity){
		let idArr = { available: 'clickButtonDiv', 
			marketLimit: 'maxMarket', reloads: 'reloadDiv',
			tableauLimit: 'tableauLimit' }
			
		
		this.stock[this.types.indexOf(name)] += quantity;				
		game.playAudio('increment');
		ui.refresh();
		ui.popPop(idArr[name]);
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