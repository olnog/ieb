class CardGen {
    check = new CardCheck();
    numOfResources = 2;

    doResources(whenResources){		
		while (true){
			let randArr = this.resources();
			if (randArr[0] != whenResources [0] && randArr[1] != whenResources [1]){
				return randArr;					
			}
		}
	}
	
	watDo(when, doResources, whenResources){
		let actionID = null;
		while (actionID == null){
			let rand = randNum(1, config.watDo.probSum);			
			for (let i in config.watDo.probabilities){
				let probability = config.watDo.probabilities[i];								
				let poss = config.actions[i];				
				if (rand > probability){					
					continue;
				}
				if ((i == 0 || rand > config.watDo.probabilities[i - 1]) 
					&& (when != poss || (when == poss && when == 'convert')) && this.check.watDo(i, when, doResources, whenResources)){				
					actionID = i;
					break;
				}								
			}			
		}
		return config.actions[actionID];		
	}
	
	when(){
		let actionID = null;				
		while (actionID == null){		
			let rand = randNum(1, config.when.probSum);				
			for (let i in config.when.probabilities){
				let probability = config.when.probabilities[i];								
				let poss = config.actions[i];
				if (rand > probability){				
					continue;
				}				
				if ((i == 0 || rand > config.watDo.probabilities[i - 1]) 
					&& this.check.when(i)){				
					actionID = i;
					break;
				}								
			}
			
		}		
		return config.actions[actionID];
	}	

    resources(){		
		let resources = []
		for (let i = 0; i < this.numOfResources; i ++){			
			while (true){
				let randType = randNum(0, config.stock.distributed.length -1);				
				if (!resources.includes(config.stock.distributed[randType])){
					resources.push(config.stock.distributed[randType]);
					break;
				}
			}
		}
		return resources;
	}

}