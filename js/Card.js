class Card{	
	when = null;
	cost = null;
	doResources = [];
	quantity = null;
	watDo = null;
	whenResources = [];
	
	constructor (){
		let max 
			= Math.round((config.stock[config.types.indexOf('clicks')]  
			+ (config.stock[config.types.indexOf('available')] - 4) 
			+ config.tableau.length) / 3);
		this.cost = randNum(1, max);		
		if (this.cost < 1){
			this.cost = 1;
		}
		
		this.whenResources = this.pickResources(2);
		
		this.doResources = this.genDoResources();		
		
		this.genWhenAndWatDo();		
		
		this.quantity = randNum(2, 4);
	}
	
	
	checkDo(watDoID, when, pass){
		
		let banned = ['market-buy', 'destroy', 'decrement', 
			'market-claim', 'market-discardCard', 'market-refresh', 'wipe'];
		
		let poss = config.actions[watDoID];		
		//console.log('checkDo', poss, when, config.numOfTurns, pass);
		/*
		if (poss == 'convert' && config.numOfTurns < 1){
			return false;
		}
		if ((poss == 'win' || poss == 'clickButton') && config.tableau.length <= 5){
			return false;
		}
		*/
		if (poss == 'increment' && this.doResources[0] == 'available' 
			&& when == 'clickButton'){
			return false;
		}
		if (poss == 'win' && (when == 'market-buy' || when == 'market-draw' 
			|| when == 'clickButton' || when == 'market-refresh' ||  when == 'increment')){
			return false;
		}
		if (when == 'market-refresh' && poss == 'increment' && this.doResources[0] == 'reloads'){
			return false;
		}
		if (when == 'market-refresh' && poss == 'increment' 
			&& this.doResources[0] == 'available' && randNum(1,4) > 1){
			return false;
		}
		if (market.cards.length > 0 && market.matchDo(poss) == market.cards.length){
			return false;
		}
		if (when == 'market-refresh' && poss == 'clickButton' && randNum(1, 10) > 1){
			return false;
		}
		/*
		if (poss == 'market-refresh' && config.tableau.length < 1){
			return false;
		}
		if (poss == 'increment' && game.canThey('increment', this.doResources[0])){
			return false;
		}
		if (poss == 'increment' && this.doResources[0] == 'reloads' && when == 'market-refresh'){
			return false;
		}

		if (poss == 'increment' && (this.doResources[0] == 'wins')){
			return false;
		}
		if (poss == 'increment' && this.doResources[0] == 'available' 
			&& (when == 'clickButton' || when == 'market-refresh' || when == 'market-draw')){
			return false;
		}
		
		if (poss == 'convert' && this.doResources[0] == 'available'){
			return false;
		}		
		if (poss == 'convert' && this.doResources[1] != 'available' 
			&& (!game.canThey('increment', this.doResources[0]) 
			|| config.stock[config.types.indexOf(this.doResources[0])] < 1)){
				console.log('this one');
			return false;
		}
		if (market.cards.length - market.howManyPenaltyCards() > 0 && market.doAllCardsHaveThisDo(poss)){			
			this.doResources = this.genDoResources(); // game will freeze up occassionally otherwise
			return false;
		}
		*/
		return !banned.includes(poss);
		//return true;
	}
	
	checkWhen(whenID, pass){
		let always = ['clickButton', 'market-draw', 'market-refresh', 'card-buy'];
		let banned = ['market-discardCard', 'decrement', 'win', 'wipe'];
		let poss = config.actions[whenID];
		if (poss =='market-claim' && config.stock[config.types.indexOf('destroyed')] < 1){
			return false;
		}
		/*
		if (poss == 'convert' && !game.canTheyConvert(this.whenResources[0], this.whenResources[1])){
			return false;
		}
		if ((poss == 'increment' || poss == 'decrement') && !game.canThey(poss, this.whenResources[0])){
			return false;
		}
		if (poss == 'destroy' && config.stock[config.types.indexOf('destroyed')] < 1){
			return false;
		}
		*/
		return !banned.includes(poss);
				
	}
	
	genDoResources(){		
		while (true){
			let randArr = this.pickResources(2);
			if (randArr != this.whenResources){
				return randArr;					
			}
		}
	}
	
	genWatDo(when, pass){
		let actionID = null;
		while (actionID == null){
			let rand = randNum(1, config.watDo.probSum);		
			/*
			let poss = config.actions[rand];
			if (when != poss && this.checkDo(rand, when, pass)){				
				actionID = rand;			
			}						
			*/			
			for (let i in config.watDo.probabilities){
				let probability = config.watDo.probabilities[i];								
				let poss = config.actions[i];				
				//console.log('watDo: ' + poss);
				if (rand > probability){					
					continue;
				}
				if ((i == 0 || rand > config.watDo.probabilities[i - 1]) 
					&& when != poss && this.checkDo(i, when, pass)){				
					actionID = i;
					break;
				}								
			}			
		}
		return config.actions[actionID];		
	}
	
	genWhen(pass){
		let actionID = null;				
		while (actionID == null){
			
			let rand = randNum(1, config.when.probSum);		
			/*
			let rand = randNum(1, config.actions.length - 1);		
			let poss = config.actions[rand];
			if (this.checkWhen(rand, pass)){				
				actionID = rand;			
			}			
			*/			
			for (let i in config.when.probabilities){
				let probability = config.when.probabilities[i];								
				let poss = config.actions[i];
				//console.log('when: ' + poss);
				if (rand > probability){				
					continue;
				}				
				if ((i == 0 || rand > config.watDo.probabilities[i - 1]) 
					&& this.checkWhen(i, pass)){				
					actionID = i;
					break;
				}								
			}
			
		}		
		return config.actions[actionID];
	}
	
	genWhenAndWatDo(){
		let picking = true, watDo = null, when = null;
		let pass = 0;
		while(picking){
			picking = false;
			pass++;
			when = this.genWhen(pass);	
			watDo = this.genWatDo(when, pass);
			
			if (watDo == when){
				picking = true;
				continue;
			}
			for (let card of market.cards){
				if (watDo == card.watDo && when == card.when){
					picking = true;
				}
			}
			for (let card of config.tableau){
				if (watDo == card.watDo && when == card.when){
					picking = true;
				}
			}
		}
		this.watDo = watDo;
		this.when = when;
		
	}
	
	pickResources(numOfResources){
		let picking = true;
		let resources = []
		for (let i = 0; i < numOfResources; i ++){
			picking = true;
			while (picking){
				let randType = randNum(0, config.distributedCardTypes.length -1);				
				if (!resources.includes(config.distributedCardTypes[randType])){
					resources.push(config.distributedCardTypes[randType]);
					picking = false;
				}
			}
		}
		return resources;
	}
}