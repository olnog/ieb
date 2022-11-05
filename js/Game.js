class Game{
	constructor(){

	}	
	checkCondition(which, resourceType, resourceTo){
		this.checkEnd();
		if (config.tableau.length > 0){
			//console.log('check', which, resourceType, resourceTo);
		}
		let checking = false;
		for (let cardID in config.tableau){
			let card = config.tableau[cardID];
			//got an error message when I won. not sure if its because of the win or because there was another do attached to the when
			//console.log(config.cardsChecked.includes(cardID), card.when != which, card.when, which );
			if (config.cardsChecked.includes(cardID) || card.when != which){				
				continue;			
			}
			if (resourceType == null 
				|| (resourceType == card.whenResources[0] && resourceTo == null) 
				|| (resourceType == card.whenResources[0] && resourceTo == card.whenResources[1])){
				console.log('check -> do: ' + card.watDo, which, resourceType, resourceTo);
				console.log(card);
				checking = true;
				config.cardsChecked.push(cardID);				
				this.doFromCheckCondition(card);
				
				if (config.cardsChecked.length == config.tableau.length){
					config.resetCardsChecked();
				}
			}
			
		}
		console.log(checking);
		if (checking){
			config.finishCheckingCondition = setTimeout(function(){
				console.log('refresh');
				ui.refresh();				
			}, config.checkingDelay);
		}
		
	}
	
	checkEnd(){
		let noZero = ['available', 'marketLimit', 'tableauLimit'];
		//there could be a potential for the game to continue IF AND ONLY IF there is a way to increment market limit in their tableau.
		for (let typeName of noZero){
			if(config.stock[config.types.indexOf(typeName)] < 1){
				this.lose(typeName);
			}
		}
				
		if(config.stock[config.types.indexOf('available')] > AUTO_WIN_AT){
			this.win('available', null);
		}
	}
	
	checkFor(where, name, resources){
		let nameCheck = true;		
		let resourceNames = { watDo: 'doResources', when: 'whenResources' };
		let resourceName = resourceNames[where];
		for (let card of market.cards){
			
			if (card.constructor.name == 'Penalty' || card[where] != name){
				continue;
			}
			nameCheck = true;
			if (card[resourceName][0] === resources[0] && (name == 'increment' || name == 'decrement')){
				return true;
			}
		}
	}
	
	clickButton(){	  
	  config.stock[config.types.indexOf('available')]--;
	  config.stock[config.types.indexOf('clicks')]++;
	  this.checkEnd();
	  ui.refresh();
	  ui.popPop('clicks');	  
	  this.playAudio('clickButton')
	  game.doCheck('clickButton', null, null);
	}
		

		
	canThey(what, resourceName){
		//increment or decrement
		for (let card of config.tableau){
			if (card.watDo == what && card.doResources[0] == resourceName){
				return true;
			}
		}
		return false;
	}
	canTheyConvert(from, to){
		let alreadyHaveIt = this.doTheyOwnDo('convert');
		if (!alreadyHaveIt){
			return false;
		}
		for (let card of config.tableau){
			if (card.watDo != 'convert'){
				continue;
			}
			if (from == card.doResources[0] && to == card.doResources[1]){
				return true;
			}
			
		}
		return false;
	}
	
	doCheck(condition, name, to){
		config.checking = setTimeout(function(){
			game.checkCondition(condition, name, to);
			market.checkPenalties(condition, name, to);
		}, config.checkingDelay)
	}
	
	doFromCheckCondition(card){
		console.log('doingFromCheckCondition', card.watDo, card);
		if (card.watDo == 'decrement' || card.watDo == 'increment'){					
			config[card.watDo](card.doResources[0], 1 ) //changed this from card.quantity to 1 because it seems OP other wise
		} else if (card.watDo == 'convert'){				
			config[card.watDo](card.doResources[0], card.quantity, card.doResources[1]);
		} else if (card.watDo == 'win'){	
			this[card.watDo]('when', card.when);
		} else if (card.watDo.split('-')[0] == 'market'){					
			market[card.watDo.split('-')[1]]();
		} else {
			this[card.watDo]();				
		}

	}
	
	doTheyOwnDo(poss){
		for (let card of config.tableau){
			if (poss == card.watDo){
				return true;
			}
		}
		return false;
	}
	
	destroy(doName, from, to){
		let n = 0;
		for (let i in config.tableau){
			let card = config.tableau[i];			
			if (card.watDo != doName){
				continue;
			}
			if ((from == null && to == null) 
				|| (from == null && to == card.doResources[1])
				|| (from == card.doResources[0] && to == card.doResources[1])){
				config.tableau.splice(i, 1);				
				n++;
			}			
		}
		if (n > 0 && !config.distributedCardTypes.includes('destroyed')){
			config.distributedCardTypes.push('destroyed');
		}
		if (n > 0){
			config.audio['destroy'].play();
			config.stock[config.types.indexOf('destroyed')]++;
			game.doCheck('destroy', null, null);			
		}
	}
	
	lose(why){
		this.playAudio('loss')
		alert('You lost because you ran out of ' + why + ". How many losses can you get?");
		config.stock[config.types.indexOf('losses')]++;
		
		if (!config.distributedCardTypes.indexOf('losses')){
			config.distributedCardTypes.push('losses');
		}
		this.restart();
		
	}
	
	matchWhenInTableau(actionName, resources){
		for (let card of config.tableau){
			if(card.when != actionName){
				continue;
			}
			if ((actionName == 'increment' || actionName == 'decrement')
				&& card.whenResources[0] != resources[0]){
				continue;
			}
			if (actionName == 'convert'
				&& (card.whenResources[0] != resources[0] 
				|| card.whenResources[1] != resources[1])){				
				continue;
			}
			return true;
		}
		return false;		
	}
	
	playAudio(filename){
		if (!config.audioOn){
			return;
		}
		config.audio[filename].play();
	}
	
	
	restart(clicked){
		if (clicked != null 
			&& config.stock[config.types.indexOf('restarts')] < 1){
			return;
		}
		if (clicked != null){
			config.stock[config.types.indexOf('restarts')]--;
			
		}
		config.reset();
		market.refresh();
		ui.refresh();
	}
	
	win(why, whenIs){
		this.playAudio('win');
		let reasons = { increment: 'incremented', convert: 'converted', destroyed: 'destroyed a card'};
		if (why == 'available'){
			alert("You won because you increased available past " + AUTO_WIN_AT + ". How many wins can you get?");
		} else if (why == 'when'){
			alert("You won because the right card in your tableau " + reasons[whenIs] + ". How many wins can you get?");			
		}
		config.stock[config.types.indexOf('wins')]++;
		if (!config.distributedCardTypes.indexOf('wins')){
			config.distributedCardTypes.push('wins');
		}
		
		
		this.restart();
	}
	
	wipe(clicked){
		if (clicked != null && (config.stock[config.types.indexOf('wipes')] < 1 || config.tableau.length < 1)){
			return;
		}		
		config.increment('available', config.tableau.length);
		config.tableau = [];
		if (clicked != null){			
			config.decrement('wipes', 1);
		}
		
	}
  
}
