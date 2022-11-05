class Market {
	cards = null;
	buy(marketID){
		let card = this.cards [marketID];
		if (card.constructor.name == 'Penalty' || card.cost > config.stock[0] 
			|| config.tableau.length >= config.stock[config.types.indexOf('tableauLimit')]){
			return;
		}
		config.stock[config.types.indexOf('clicks')] -= card.cost;
		config.tableau.push(card);
		this.cards.splice(marketID, 1);
		if (this.cards.length < 1){
			this.refresh();
		}
		if (game.doTheyOwnDo('market-draw') && !config.distributedCardTypes.includes('marketLimit')){
			//config.distributedCardTypes.push('marketLimit');
			//config.distributedCardTypes.push('initMarket');
		}
		if (config.tableau.length > 0 && !config.distributedCardTypes.includes('tableauLimit')){
			config.distributedCardTypes.push('tableauLimit');
			config.distributedCardTypes.push('wipes');
		}
		if (config.tableau.length / config.stock[config.types.indexOf('tableauLimit')] > .5 
			&& !config.distributedCardTypes.includes('restarts')){
			config.distributedCardTypes.push('restarts');			
		}
		game.doCheck('market-buy', null, null);	
	}
	
	checkPenalties(when, from, to){
		
		let howManyPenalties = this.howManyPenaltyCards();
		if (howManyPenalties < 1){
			return;			
		}
		console.log('checkPenalties', when, from, to);
		for (let i = 0; i < this.cards.length; i++){			
			let card = this.cards[i];
			if (card.constructor.name != 'Penalty' || when != card.when){
				continue;
			}
			if (from == null 
			|| (from == card.whenResources[0] && to == null) 
			|| (from == card.whenResources[0] && to == card.whenResources[1])){
				console.log('Doing penalty!', card);
				game.doFromCheckCondition(card);
			}
		}
		
	}
	
	discardCard(){
		this.cards.shift();
		if (this.cards.length == 0){
			this.refresh();
		}
		game.doCheck('market-discardCard', null, null);
	}
	
	discardAll(reset){
		this.cards = [];
		if (reset == null){
			game.doCheck('market-discardAll', null, null);
		}
	}
	
	doAllCardsHaveThisDo(possibility){		
		for (let card of this.cards){
			if (card.constructor.name == 'Penalty'){
				continue;
			}
			if (card.watDo != possibility){
				return false;
			}
		}
		return true;
	}
	
	draw(){		
		if (this.cards.length >= config.stock[config.types.indexOf('marketLimit')]){
			return;
		}
		this.cards.push(new Card());
		game.doCheck('market-draw', null, null);
	}
	
	howManyPenaltyCards(){
		let n = 0;
		for (let card of this.cards){
			if (card.constructor.name == 'Penalty'){			
				n++;
			}
		}
		return n;
	}
	
	matchDo(watDo){
		for (let card of this.cards){
			if (card.constructor.name == 'Penalty'){
				continue;
			}
			if (card.watDo == watDo){
				return true;
			}
		}
		return false;
	}
	
	refresh(clicked){
		if (clicked != null){
			if (config.stock[config.types.indexOf('reloads')] > 0){
				config.decrement('reloads', 1);
			} else {
				config.decrement('available', 1);
			}
		}
		this.discardAll();
		let penaltyGenerated = randNum(config.tableau.length, config.stock[config.types.indexOf('tableauLimit')]) == config.tableau.length ;
		if (config.tableau.length < 1){
			penaltyGenerated = false;
		}
		if (penaltyGenerated){
			this.cards.push(new Penalty);
		}
		let numOfCards = config.stock[config.types.indexOf('initMarket')];
		if (config.stock[config.types.indexOf('initMarket')] > config.stock[config.types.indexOf('marketLimit')]){
			numOfCards = config.stock[config.types.indexOf('marketLimit')];
		}
		for (let i = this.cards.length; i < numOfCards; i++){		  			
			while (true){				
				let possCard = new Card();
				//if (!this.matchDo(possCard.watDo)){
					this.cards.push(possCard);
					break;
				//}
			}
		}
		game.doCheck('market-refresh', null, null);	  
	}
}