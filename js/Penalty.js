class Penalty {
	when = null;
	watDo = null;
	doResources = [];
	whenResources = [];
	constructor(){
		//lose, decrement, discardCard
		
		this.doResources = this.pickResources(2);
		this.whenResources = this.pickResources(2);
		this.when = this.genWhen();
		this.watDo = this.genWatDo();
	}
	
	checkWhen(when){
		let banned = ['win'];
		if (banned.includes(when)){
			return false;
		}
		if (! market.matchDo(when) && !game.doTheyOwnDo(when)){
			return false;
		}
		if (when == 'decrement' && this.whenResources[0] == 'losses'){
			return false;
		}
		return true;
	}
	
	genWatDo(){
		let available = ['decrement', 'market-discard',  'wipe', 'market-refresh'];
		let watDo = null;
		while (1){
			watDo = config.actions[randNum(0, config.actions.length - 1)];
			if (available.includes(watDo) && watDo != this.when){
				break;
			}
		
		}
		return watDo;
	}
	
	genWhen(){
		
		while (1){
			let when = config.actions[randNum(0, config.actions.length - 1)];
			if (this.checkWhen(when)){
				return when;		
			}
		}
	}
	
	pickResources(numOfResources){
		let banned = ['initMarket', 'destroyed'], picking = true, resources = [];
		while (resources.length < 2){
			let rand = config.types[randNum(1, config.types.length - 1)];
			if (!resources.includes(rand) && !banned.includes(rand)){
				resources.push(rand);
			}
		}
		return resources;
	}
}