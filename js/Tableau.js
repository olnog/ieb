class Tableau {
    cards = [];

	areTheyIncrementingAlready(when){
		for (let card of this.cards){
			if (card.watDo != 'increment'){
				continue;
			}
			if (card.when == when){
				return true;
			}
		}
		return false;
	}

    canThey(what, resourceName){
		//increment or decrement
		for (let card of this.cards){
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
		for (let card of this.cards){
			if (card.watDo != 'convert'){
				continue;
			}
			if (from == card.doResources[0] && to == card.doResources[1]){
				return true;
			}
			
		}
		return false;
	}

    destroy(doName, from, to){
		let n = 0;
		for (let cardID in this.cards){
			let card = this.cards[cardID];			
			if (card.watDo != doName){
				continue;
			}
			if (from == card.doResources[0] && to == card.doResources[1]){
				this.cards.splice(cardID, 1);				
				n++;
			}			
		}
		if (n > 0 && !config.stock.distributed.includes('destroyed')){
			config.stock.distributed.push('destroyed');
		}
		if (n > 0){			
			config.playAudio('destroy');
			config.stock.set('destroyed', config.stock.get('destroyed') + 1);
			ui.refresh()
			game.doCheck('destroy', null, null);			
		}
	}

    doTheyOwnDo(poss){
		for (let card of this.cards){
			if (poss == card.watDo){
				return true;
			}
		}
		return false;
	}

	fetchMatchingWhens(when, resources){
		let matchingWhens = [];
		for (let cardID in this.cards){			
			let card = this.cards[cardID];			
			if (card.when != when){				
				continue;			
			}			
			if (resources[0] == card.whenResources[0] 
				&& resources[1] == card.whenResources[1]){
				matchingWhens.push(cardID);
			}
		}
		return matchingWhens;
	}

	howManyDos(watDo, resources){
		let n = 0;
		for (let card of this.cards){
			if (card.watDo == watDo && card.doResources[0] == resources[0] && card.doResources[1] == resources[1]){
				n++;
			}
		}
		return n;
	}

    matchWhen(actionName, resources){
			for (let card of this.cards){			
			if(card.when != actionName){
				continue;
			}			
			if (card.whenResources[0] == resources[0] 
				&& card.whenResources[1] == resources[1]){				
				return true;
			}
		}
		return false;		
	}
}