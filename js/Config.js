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
	checked = [];
	checking = null;
	checkingDelay = 400;
	finishCheckingCondition = null;	
	history = {
		watDo: [],
		when: [],
		
	}
	historySize = 10;
	loopCheck = null;
	loops = 0;
	numOfTurns = 0;	
	stock = new Stock();		
	tableau = new Tableau();	
		
	watDo = {
		captions: [
			"click the <img src='img2/clicks.png' > button", '+',  '-', 
			'buy', 'discard card from market', 'refresh market',  
			'draw a new card into the market', 'convert ', 'wipe the tableau', 
			null, 'win the game', null,
		],
		chances: [
			5, 10, 10, 
			10, 10, 10, 
			1, 10, 10,
			10, 5, 10,
			
		],
		probabilities: [],
		probSum: null,
	}
	
	when = {
		captions: [
			"the <img src='img2/clicks.png' > button is clicked", '+', '-', 
			'a card is bought', 'a card is discarded from market', "the <img src='img2/reloads.png' > button is clicked", 
			'a new card is drawn to the market', 'converting ', 'wiping the tableau',
			"a card in the tableau is destroyed <span data-text='A card in your tableau is destroyed when it tries to convert but there are no resources left to covert from' class='poop'>[ ? ]</span>", 
			'winning the game', 'claiming a card in the market',
		],
		chances: [
			10, 10, 10, 
			10, 10, 10, 
			5, 10, 10,
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
		
		this.reset();
	}
			
	clickButton(){	  
		this.stock.set('available', this.stock.get('available') - 1);
		this.stock.set('clicks', this.stock.get('clicks') + 1);		
		ui.refresh();
		ui.popPop('available');
		ui.popClass('clicks');	  
		this.playAudio('clickButton')
		game.doCheck('clickButton', null, null);
	  }

	  playAudio(filename){
		if (!this.audioOn){
			return;
		}
		this.audio[filename].play();
	}

	reset(){		
		this.numOfTurns = 0;
		this.tableau.cards = [];
		market.discardAll(true);		
		this.stock.reset();
		this.loopCheck = this.stock.quant.slice();
		this.loops = 0;
	}

	wipe(clicked){
		if (clicked != null && (this.stock.get('wipes') < 1 || this.tableau.cards.length < 1)){
			return;
		}		
		this.stock.increment('available', this.tableau.cards.length);
		this.tableau.cards = [];
		if (clicked != null){			
			this.stock.decrement('wipes', 1);
		}
		ui.refresh();
	}

}