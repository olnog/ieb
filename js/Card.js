class Card{	
	gen = new CardGen();
	cost = null;
	doResources = [];
	quantity = null;
	watDo = null;
	when = null;
	whenResources = [];
	
	constructor (){
		let max 
			= ((config.stock.get('available') - 4) 
			+ config.tableau.cards.length) / 3;
		
		this.cost = randNum(1, max);		
		if (this.cost < 1){
			this.cost = 1;
		}		
		this.whenResources = this.gen.resources(2);		
		this.doResources = this.gen.doResources(this.whenResources);		
		this.when = this.gen.when(this.whenResources);
		this.watDo = this.gen.watDo(this.when, this.doResources, this.whenResources);	
		this.quantity = randNum(2, config.maxConvert);

		if (this.when == 'increment'){
			this.whenResources[1] = null;
		} else if (this.when != 'convert'){
			this.whenResources[0] = null;
			this.whenResources[1] = null;
		}
		if (this.watDo == 'increment'){
			this.doResources[1] = null;
		} else if (this.watDo != 'convert'){
			this.doResources[0] = null;
			this.doResources[1] = null;
		}
		if (this.watDo == 'convert' && this.doResources[0] == 'wins'){
			this.quantity *= randNum(2, 3);
		}


/*
		if (market.cards.length == 0){
			this.cost = 1;
			this.when = 'market-refresh';
			this.watDo = 'increment';
			this.doResources[0] = 'reloads';
			this.doResources[1] = null;
			this.whenResources = [null, null];
		} else if (market.cards.length == 1){
			this.cost = 1;
			this.watDo = 'market-refresh';
			this.when = 'increment';
			this.doResources = [null, null];
			this.whenResources[0] = 'reloads';
			this.whenResources[1] = null;
		} 
*/	
	}
		

	

}