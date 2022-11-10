class CardCheck{
	pass = 0;
	
	
	watDo(watDoID, when, doResources, whenResources){		
		if (this.pass != 0 && this.pass % 100 == 0){
			console.log(this.pass);
		}
		this.pass ++;
		
		let banned = ['clickButton', 'market-buy', 'destroy', 'decrement', 
			'market-claim', 'market-discardCard', 'market-refresh', 'wipe'];		
		
		let numOfWinsInTableau = config.tableau.howManyDos('win', [null, null]);
		let poss = config.actions[watDoID];		
		if (this.pass > 1000 && !banned.includes(poss)){
			return true;
		}
		if (poss == 'convert' && config.stock.get(doResources[0]) < 1){
			return false;
		}
		if (poss == 'increment' && doResources[0] == 'available' 
			&& when == 'clickButton'){
			return false;
		}
		if (poss == 'win' && config.numOfTurns <= config.minNumOfTurnsBeforeWin){
			return false;
		}

		if (poss == 'win' 
			&& (when == 'market-buy' || when == 'market-draw' 
			|| when == 'clickButton' || when == 'market-refresh' ||  when == 'increment' 
			|| when == 'destroy' || when == 'market-claim')){
			return false;
		}

		if (poss == 'win' && numOfWinsInTableau > 0 
			&& randNum(1, Math.pow(numOfWinsInTableau + 1, 2)) != 1 ){
			return false;
		}
		if (when == 'market-refresh' && poss == 'increment' && doResources[0] == 'reloads'){
			return false;
		}
		if (poss == 'increment' && (when == 'clickButton' || when == 'market-refresh' || when == 'market-draw' || when == 'market-buy') 
			&& config.tableau.areTheyIncrementingAlready(when)){
			return false;
		}
		if (poss == 'increment' && doResources[0]){
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

		return !banned.includes(poss);
	}
	
	when(whenID, whenResources){
		let banned = ['clickButton','market-discardCard', 'decrement', 'win', 'wipe'];
		let poss = config.actions[whenID];
		if (poss =='market-claim' && config.stock.get('destroyed') < 1){
			return false;
		}
		if (poss == 'increment' 
			&& (whenResources[0] == 'destroyed' || whenResources[0] == 'wins' 
			|| whenResources[0] == 'losses' || whenResources[0] == 'loops') ){
			return false;
		}
		return !banned.includes(poss);
				
	}

}