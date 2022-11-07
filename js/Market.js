class Market {
	cards = null;
	buy(marketID){
		let card = this.cards [marketID];
		if (card.constructor.name == 'Penalty' || card.cost > config.stock[config.types.indexOf('available')] 
			|| config.tableau.length >= config.stock[config.types.indexOf('tableauLimit')]){
			return;
		}					
		config.stock[config.types.indexOf('clicks')] -= card.cost;
		this.claimOrBuy(marketID);		
		
		ui.popPop('clicks');
		game.doCheck('market-buy', null, null);	
	}
	
	claim(marketID){
		let card = this.cards [marketID];
		if (config.stock[config.types.indexOf('destroyed')] < 1){
			return;
		}
		this.claimOrBuy(marketID);
		config.stock[config.types.indexOf('destroyed')] --;
		ui.popPop('destroyed');
		game.doCheck('market-claim', null, null);	
	}
	
	claimOrBuy(marketID){
		let card = this.cards [marketID];
		game.playAudio('market-buy');
		config.tableau.push(card);
		this.cards.splice(marketID, 1);
		if (this.cards.length < 1){
			this.refresh();
		}
		if (config.tableau.length > 0 && !config.distributedCardTypes.includes('tableauLimit')){
			config.distributedCardTypes.push('tableauLimit');
			config.distributedCardTypes.push('wipes');
		}
		if (config.tableau.length / config.stock[config.types.indexOf('tableauLimit')] > .5 
			&& !config.distributedCardTypes.includes('restarts')){
			config.distributedCardTypes.push('restarts');			
		}
		ui.refresh();
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
		ui.popPop();
		
		game.playAudio('market-draw');
		ui.refresh();
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
		let n = 0;
		for (let card of this.cards){
			if (card.constructor.name == 'Penalty'){
				continue;
			}
			if (card.watDo == watDo){
				n++;
			}
		}
		return n;
	}
	
	refresh(clicked){
		if (clicked != null){			
			game.playAudio('market-refresh');
			if (config.stock[config.types.indexOf('reloads')] > 0){
				config.stock[config.types.indexOf('reloads')]--;
				
			} else {
				config.stock[config.types.indexOf('available')]--;				
			}
		}
		this.discardAll();
		let penaltyGenerated = false; //randNum(config.tableau.length, config.stock[config.types.indexOf('tableauLimit')]) == config.tableau.length ;
		if (config.tableau.length < 1){
			penaltyGenerated = false;
		}
		if (penaltyGenerated){
			//this.cards.push(new Penalty);
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
		ui.refresh();
		game.doCheck('market-refresh', null, null);	  
	}
}