class CardCheck{
	watDo(watDoID, when, doResources, whenResources){		
		let banned = ['clickButton', 'market-buy', 'destroy', 'decrement', 
			'market-claim', 'market-discardCard', 'market-refresh', 'wipe'];		
		let poss = config.actions[watDoID];		

		if (poss == 'increment' && doResources[0] == 'available' 
			&& when == 'clickButton'){
			return false;
		}
		if (poss == 'win' && config.numOfTurns <= config.minNumOfTurnsBeforeWin){
			return false;
		}
		if (poss == 'win' && randNum(1, config.tableau.howManyDos(poss, doResources) + 1) == 1 
			&& (when == 'market-buy' || when == 'market-draw' 
			|| when == 'clickButton' || when == 'market-refresh' ||  when == 'increment' 
			|| when == 'destroy' || when == 'market-claim')){
			return false;
		}
		if (when == 'market-refresh' && poss == 'increment' && doResources[0] == 'reloads'){
			return false;
		}
		if (poss == 'increment' && (when == 'clickButton' || when == 'market-refresh' || when == 'market-draw' || when == 'market-buy') 
			&& config.tableau.areTheyIncrementingAlready(when)){
			return false;
		}
		if (when == 'market-refresh' && poss == 'increment' 
			&& doResources[0] == 'available' && randNum(1,4) > 1){
			return false;
		}
		if (market.cards.length > 0 && market.matchDo(poss) == market.cards.length){
			return false;
		}
		if (when == 'market-refresh' && poss == 'clickButton' && randNum(1, 10) > 1){
			return false;
		}
		if (when == 'convert' && poss == 'convert' 
			&& ((whenResources[0] == doResources[0] && whenResources[1] == doResources[1])
			|| (whenResources[0] == doResources[1] && whenResources[1] == doResources[0]))){
			return false;
		}
		return !banned.includes(poss);
	}
	
	when(whenID){
		let banned = ['clickButton','market-discardCard', 'decrement', 'win', 'wipe'];
		let poss = config.actions[whenID];
		if (poss =='market-claim' && config.stock.get('destroyed') < 1){
			return false;
		}
		return !banned.includes(poss);
				
	}

}