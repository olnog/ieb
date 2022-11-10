class Market {
	cards = null;
	buy(marketID){
		let card = this.cards [marketID];		
		if (card.cost > config.stock.get('available')
			|| config.tableau.length >= config.stock.get('tableauLimit')){
			return;
		}					
		config.stock.set('available', config.stock.get('available') - card.cost);		
		this.claimOrBuy(marketID);				
		ui.popPop('available');
		game.doCheck('market-buy', null, null);	
	}
	
	claim(marketID){
		let card = this.cards [marketID];
		if (config.stock.get('destroyed') < 1
			|| config.tableau.length >= config.stock.get('tableauLimit') ){
			return;
		}
		this.claimOrBuy(marketID);
		config.stock.set('destroyed', config.stock.get('destroyed') - 1);				
		ui.refresh();
		ui.popPop('destroyed');
		game.doCheck('market-claim', null, null);	
	}
	
	claimOrBuy(marketID){
		let card = this.cards [marketID];
		let destroyed = false;
		config.playAudio('market-buy');
		config.tableau.cards.push(card);
		this.cards.splice(marketID, 1);
		if (this.cards.length < 1){
			this.refresh();
		}
		if (config.tableau.cards.length > 0 && !config.stock.distributed.includes('tableauLimit')){
			config.stock.distributed.push('tableauLimit');
			config.stock.distributed.push('wipes');
			config.stock.distributed.push('restarts');			
		}
		if (config.tableau.cards.length > config.stock.get('tableauLimit')){
			config.tableau.destroyAll();
			destroyed = true;
		}
		ui.refresh();
		if (destroyed){
			ui.animateBG();
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
		if (reset != null){ //this is fucking up my loop count
			//game.doCheck('market-discardAll', null, null);
		}
	}
	
	doAllCardsHaveThisDo(possibility){		
		for (let card of this.cards){
			if (card.watDo != possibility){
				return false;
			}
		}
		return true;
	}
	
	draw(){	
		if (this.cards.length >= config.stock.get('marketLimit')){
			//return;
		}
		ui.popPop();		
		config.playAudio('market-draw');
		
		this.cards.push(this.fetchNew());
		ui.refresh();
		game.doCheck('market-draw', null, null);
	}

	fetchNew(){				
		//console.log('fetchNew');
		let bad = true, poss = null;
		config.passes = 0;
		while(bad){
			bad = false;	
			poss = new Card();
			for (let i in config.history.when){
				if (poss.when + '-' + String(poss.whenResources[0]) + '-' + String(poss.whenResources[1]) 
					== config.history.when[i] 
					&& poss.watDo + '-' + String(poss.doResources[0]) + '-' + String(poss.doResources[1]) 
					== config.history.watDo[i]){
					bad = true;
				} 
			}
			for (let card of config.tableau.cards){
				if(poss.watDo == card.watDo && poss.when == card.when 
					&& poss.whenResources[0] == card.whenResources[0] && poss.whenResources[1] == card.whenResources[1]
					&& poss.doResources[0] == card.doResources[0] && poss.doResources[1] == card.doResources[1]){
					bad = true;
				}
			}
			config.passes++;
			if (config.passes > 100){ // fuck it, it can't be that bad, can it?
				bad = false;
			}
		}
		config.history.when.push(poss.when + '-' + String(poss.whenResources[0]) + '-' + String(poss.whenResources[1]));
		config.history.watDo.push(poss.watDo + '-' + String(poss.doResources[0]) + '-' + String(poss.doResources[1]));
		if (config.history.when.length >= config.historySize){
			config.history.when.pop();
			config.history.watDo.pop();
		}
		return poss;

	}

	matchDo(watDo){
		let n = 0;
		for (let card of this.cards){
			if (card.watDo == watDo){
				n++;
			}
		}
		return n;
	}
	
	refresh(clicked){
		if (clicked != null){			
			config.playAudio('market-refresh');
			if (config.stock.get('reloads') > 0){
				config.stock.set('reloads', config.stock.get('reloads') - 1);
				
			} else {
				config.stock.set('available', config.stock.get('available') - 1);				
			}
			ui.animateMarket();

		}
		

		this.discardAll();		
		let numOfCards = config.stock.get('marketInit');
		if (config.tableau.savedCard != null){
			this.cards.push(config.tableau.savedCard);
			config.tableau.savedCard = null;
			console.log(this.cards);
		}
		
		for (let i = this.cards.length; i < numOfCards; i++){		  			
			this.cards.push(this.fetchNew());					
		}
		ui.refresh();
		game.doCheck('market-refresh', null, null);	  
	}
}