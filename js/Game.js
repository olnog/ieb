class Game{	
	checkCondition(when, resources){
		console.log('checkCondition', when, resources);
		if (config.loops != 0 && config.loops % 3 == 0){
			
			//console.log(config.loops);
			let goingDown = this.checkLoop();
			if (!goingDown){
				this.infiniteLoop();
			}
		}
		let matchingWhens = [];
		this.checkEnd();
		if (config.tableau.matchWhen(when, resources)){
			matchingWhens = config.tableau.fetchMatchingWhens(when, resources);
		}
		
		if (matchingWhens.length < 1){
			config.checked = [];
			config.loopCheck = config.stock.quant.slice();
			config.loops = 0;
			return;
		}		
		config.loops++;
		this.doTheMatchingWhens(matchingWhens);							
	}
	
	checkEnd(){
		let noZero = ['available', 'marketInit', 'tableauLimit'];
		//there could be a potential for the game to continue IF AND ONLY IF there is a way to increment market limit in their tableau.
		for (let typeName of noZero){
			if(config.stock.get(typeName) <  1){
				this.lose(typeName);
			}
		}				
		if(config.stock.get('available') > AUTO_WIN_AT){
			this.win('available', null);
		}
	}
	checkLoop(){
		let goingDown = false;
		for (let i in config.stock.quant){
			let quant = config.stock.quant[i];
			if (quant < config.loopCheck[i] && quant - config.loopCheck[i] <= -2){
				goingDown = true;
			}
		}
		return goingDown; //goingDown;
	}
		
	doCheck(condition, name, to){
		config.checking = setTimeout(function(){			
			game.checkCondition(condition, [name, to]);
		}, config.checkingDelay)
	}
	
	doFromCheckCondition(card){
		if (card.watDo == 'decrement' || card.watDo == 'increment'){					
			config.stock[card.watDo](card.doResources[0], 1 ) //changed this from card.quantity to 1 because it seems OP other wise
		} else if (card.watDo == 'clickButton'){				
			config[card.watDo]();
		} else if (card.watDo == 'convert'){				
			config.stock[card.watDo](card.doResources[0], card.quantity, card.doResources[1]);
		} else if (card.watDo == 'win'){	
			this[card.watDo]('when', card.when);
		} else if (card.watDo.split('-')[0] == 'market'){					
			market[card.watDo.split('-')[1]]();
		} else {
			this[card.watDo]();				
		}
	}

	doTheMatchingWhens(matchingWhens){
		for (let cardID of matchingWhens){
			let card = config.tableau.cards[cardID];
			//console.log('doTheMatchingWhens', card.watDo);
			config.checked.push(cardID);
			this.doFromCheckCondition(card);
		}
	}


	infiniteLoop(){
		alert("You created an infinite loop! You are a genius!");
		config.stock.set('loops', config.stock.get('loops') + 1);
		console.log ("You have " + config.stock.get('loops') + " loops." );

		if (!config.stock.distributed.includes('loops')){
			config.stock.distributed.push('loops');
		}
		this.restart();
	}

	lose(why){
		config.playAudio('loss')
		alert('You lost because you ran out of ' + why + ". How many losses can you get?");		
		config.stock.set('losses', config.stock.get('losses') + 1);
		if (!config.stock.distributed.includes('losses')){
			config.stock.distributed.push('losses');
		}
		this.restart();		
	}
	
	restart(clicked){
		if (clicked != null 
			&& config.stock.get('restarts') < 1){
			return;
		}
		if (clicked != null){
			config.stock.set('restarts', config.stock.get('restarts') - 1);						
		}
		config.reset();
		market.refresh();
		ui.refresh();
	}
	
	win(why, whenIs){
		config.playAudio('win');
		let reasons = { increment: 'incremented', claim: 'was claimed', convert: 'converted', destroy: 'got destroyed'};
		if (why == 'available'){
			alert("You won because you increased available past " + AUTO_WIN_AT + ". How many wins can you get?");
		} else if (why == 'when'){
			alert("You won because the right card in your tableau " + reasons[whenIs] + ". How many wins can you get?");			
		}		
		config.stock.set('wins', config.stock.get('wins') + 1);
		if (!config.stock.distributed.includes('wins')){
			config.stock.distributed.push('wins');
		}		
		this.restart();
	}  
}
