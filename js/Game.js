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
			if (config.cardsChecked.includes(cardID) || card.when != which 
				|| ((card.when == 'increment' || card.when == 'decrement') 
				&& card.whenResources[0] != resourceType) 
				|| (card.when == 'convert'  
				&& card.whenResources[0] != resourceType && card.whenResources[1] != resourceTo)){
				continue;
			
			}
			console.log('check -> do: ' + card.watDo);
			checking = true;
			config.cardsChecked.push(cardID);			
			this.doFromCheckCondition(card);
			if (config.cardsChecked.length == config.tableau.length){
				config.resetCardsChecked();
			}
			
		}
		if (checking){
			config.finishCheckingCondition = setTimeout(function(){
				ui.refresh();				
			}, config.checkingDelay);
		}
		
	}
	
	checkEnd(){
		if(config.stock[config.types.indexOf('available')] < 1 
			//there could be a potential for the game to continue IF AND ONLY IF there is a way to increment market limit in their tableau.
			|| config.stock[config.types.indexOf('marketLimit')] < 1		
			|| config.stock[config.types.indexOf('tableauLimit')] < 1){
		  this.lose();
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
				console.log(where, name, resources, "THEY GOT IT");
				return true;
			}
		}
	}
	
	clickButton(){
	  config.decrement('available', 1);	  
	  config.increment('clicks', 1);
	  game.doCheck('clickButton', null, null);
	}
		

		
	canThey(what, resourceName){
		//increment or decrement
		for (let card of config.tableau){
			if (card.watDo == what && card.doResources[0]){
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
			if (from == null && to == card.doResources[1]){
				return true;
			} else if (from == card.doResources[0] && to == card.doResources[1]){
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
		if (card.watDo == 'decrement' || card.watDo == 'increment'){					
			config[card.watDo](card.doResources[0], 1 ) //changed this from card.quantity to 1 because it seems OP other wise
		} else if (card.watDo == 'convert'){				
			config[card.watDo](card.doResources[0], card.quantity, card.doResources[1]);
		} else if (card.watDo.split('-')[0] == 'market'){					
			market[card.watDo.split('-')[1]]();
		} else {
			this[card.watDo]();				
		}

	}
	
	doTheyOwnDo(possiblity){
		for (let card of config.tableau){
			if (card.watDo == card.watDo){
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
			config.stock[config.types.indexOf('destroyed')]++;
			game.doCheck('destroy', null, null);			
		}
	}
	
	lose(){
		alert('You lose!!! try again.');
		config.stock[config.types.indexOf('losses')]++;
		if (!config.distributedCardTypes.indexOf('losses')){
			config.distributedCardTypes.push('losses');
		}
		this.restart();
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
	}
	
	win(){
		alert("You won! Congrats!");
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
		config.tableau = [];

		config.increment('available', config.tableau.length);
		if (clicked != null){			
			config.decrement('wipes', 1);
		}
		
	}
  
}
