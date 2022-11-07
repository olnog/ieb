class UI{

  constructor(){
    
  }
  refresh(){
	//console.log('refresh');
	$("#marketSize").html(market.cards.length);
	$("#maxMarket").html(config.stock[config.types.indexOf('marketLimit')]);
	$("#tableauLimit").html(config.stock[config.types.indexOf('tableauLimit')]);	
	$("#tableauSize").html(config.tableau.length);	
	$("#wipe").prop('disabled', false);	
	$("#wipes").html(config.stock[config.types.indexOf('wipes')]);		
	$("#destroyed").html(config.stock[config.types.indexOf('destroyed')]);
	$("#winAt").html(AUTO_WIN_AT);
	$("#tableauLabel").removeClass('fs-4');
	$("#tableauLabel").removeClass('text-decoration-underline');	
	$("#audioOn").prop('checked', config.audioOn);
	$(".clicks").html(config.stock[config.types.indexOf('clicks')]);
	if (config.tableau.length >= config.stock[config.types.indexOf('tableauLimit')]){
		//this is to make it clearer why players can't buy cards when they have the hearts
		$("#tableauLabel").addClass('fs-4');
		$("#tableauLabel").addClass('text-decoration-underline');
	}
	if (config.numOfTurns > 0){
		$(".everythingElse").removeClass('d-none');
	}
	if (config.stock[config.types.indexOf('wins')] > 0 
		|| config.stock[config.types.indexOf('losses')] > 0 ){
		$("#wins").html(config.stock[config.types.indexOf('wins')]);
		$("#losses").html(config.stock[config.types.indexOf('losses')]);		
		$("#stats").removeClass('d-none');
	}
	if (config.stock[config.types.indexOf('restarts')] > 0){
		$("#restart").removeClass('d-none');
	}
	$("#restarts").html(config.stock[config.types.indexOf('restarts')]);
	if (config.stock[config.types.indexOf('destroyed')] > 0){
		$("#tableauDestroyed").removeClass('d-none');
	}
	if (config.stock[config.types.indexOf('wipes')] < 1 || config.tableau.length < 1){	
		$("#wipe").prop('disabled', true);
	}
	if (config.tableau.length > 0){
		$(".tableau").removeClass('d-none');
	}
	for (let stockID in config.types){
		$("#" + config.types[stockID]).html(config.stock[stockID]);
	}	 
	this.displayMarket();
	this.displayHand();
  }
  
	displayHand(){
		let coveredConditions  = [];
		let checkingClass = '', html = '';
		for (let cardID in config.tableau){	
			checkingClass = '';
			if (config.cardsChecked.includes(cardID)){				
				checkingClass = ' checking ';
			}
			let card = config.tableau[cardID];
			if (coveredConditions.includes(card.when)){
				continue;
			}
			html += "<div> When " + config.when.captions[config.actions.indexOf(card.when)] 
			html += this.fetchCardResourceRef(card.when, card.whenResources, card.quantity, 'condition');
			html += ":</div>";
			html += "<div class='ms-3 " + checkingClass + "'>";
			html += this.getAllDoForCondition(card);
			html += "</div>";
			coveredConditions.push(card.when);
		}
		$("#cards").html(html);
	}
	
	displayMarket(){
		let html = "<div class=''>";
		let maxCardsInRow = 3;		
		for (let cardID in market.cards){
			if (market.cards[cardID].constructor.name == 'Card'){
				html += this.fetchMarketCard(cardID);
			} else if (market.cards[cardID].constructor.name == 'Penalty'){
				html += this.fetchPenaltyCard(cardID);
			}
			if ((cardID + 1) % maxCardsInRow == 0){				
				html += "</div><div class=''>";
			}
		}
		html += "</div>";
		$("#market").html(html);	
	}
	
	fetchCardResourceRef(condition, resources, quantity, which, noBuy){
		let noBuyStr = '', relevant = ['increment', 'decrement'], txt = '';		
		if (noBuy){
			noBuyStr = '-noBuy';
		}
		if (which == 'do' && condition == 'convert'){
			txt += " <img src='img2/" + resources[0] + noBuyStr + ".png'> -> " + quantity 
				+ " <img src='img2/" + resources[1] + noBuyStr + ".png'>";
		} else if (which == 'condition' && condition == 'convert'){
			txt += " <img src='img2/" + resources[0] + noBuyStr + ".png'> -> <img src='img2/" 
				+ resources[1] + noBuyStr + ".png'>";
		}
		if (relevant.includes(condition)){						
			if (which == 'do'){
				txt =   "";
			}
			txt += "<img src='img2/" + resources[0]  + noBuyStr + ".png'>";						
		}	
		return txt;
	}
	
	fetchMarketCard(cardID){	
		let card = market.cards[cardID];
		let buyFormControl = '';
		let disabledClass = '', doClass = '', whenClass = '', winClass = '', noBuyClass = '';
		if (config.stock[config.types.indexOf('destroyed')] < 1){
			buyFormControl = ' form-control ';
		}
			
		if (config.stock[config.types.indexOf('clicks')] < card.cost){
			noBuyClass = ' noBuy ';
		}
		if (game.matchWhenInTableau(card.watDo, card.doResources)){
			doClass = ' important ';
		}
		if (card.watDo == 'win'){
			winClass = ' win ';
		}

		if (card.when == 'convert' && game.canTheyConvert(card.whenResources[0], card.whenResources[1])){
			whenClass = ' important ';
		} else if ((card.when == 'increment' || card.when == 'decrement') 
			&& game.canThey(card.when, card.whenResources[0])){
			whenClass = ' important ';
		} else if (card.when != 'increment' && card.when != 'decrement' && card.when != 'convert' 
			&& game.doTheyOwnDo(card.when)){
			whenClass = ' important ';
		}
		let html = "<div class='cardDiv" + noBuyClass + "'>";
		html += "<div class='text-center '><img src='img2/clicks"
		if (noBuyClass != ''){
			html += "-noBuy";
		}
		html += ".png'></div><div><span class='clicks'>" 
		+ config.stock[config.types.indexOf('clicks')] + "</span>/" + card.cost + "</div>";		
		html += "<div class='fw-bold mt-3'>When:</div>"
		html += "<div class='" + whenClass + "'> ";
		if (noBuyClass != ''){
			html += config.when.captions[config.actions.indexOf(card.when)].replace('.png', '-noBuy.png');
		} else {
			html += config.when.captions[config.actions.indexOf(card.when)] ;
		}
		
		
		html += this.fetchCardResourceRef(card.when, card.whenResources, card.quantity, 'condition', noBuyClass != '');
		html += "</div>";
		html += "<div class='fw-bold mt-3'>Do:</div>"
		html += "<div class='" + doClass + " " + winClass + "'>";
		if (noBuyClass != ''){
			html += config.watDo.captions[config.actions.indexOf(card.watDo)].replace('.png', '-noBuy.png');
		} else {
			html += config.watDo.captions[config.actions.indexOf(card.watDo)];
		}
		html += this.fetchCardResourceRef(card.watDo, card.doResources, card.quantity, 'do', noBuyClass != '');
		html += "</div>";	
			
		
		if (config.stock[config.types.indexOf('clicks')] < card.cost 
			|| config.tableau.length >= config.stock[config.types.indexOf('tableauLimit')]){
			disabledClass = ' disabled ';
		}
		html += "<div>"
		if (config.stock[config.types.indexOf('destroyed')] > 0){
			html += "<button id='claim-" + cardID 
				+ "' class='claim btn-lg btn btn-warning'>claim</button>";
		}
		html += "<button id='buy-" + cardID + "' class='buy btn btn-lg btn-success " + buyFormControl + " ' " 
			+ disabledClass + ">buy</button>";
		html += "</div>";		
		html += "</div>";
		return html;
	}
	
	fetchPenaltyCard(cardID){
		let card = market.cards[cardID];
		let html = "<div class='cardDiv p-3 col text-white bg-danger'>";
		html += "<div> When " + config.when.captions[config.actions.indexOf(card.when)] 
		html += this.fetchCardResourceRef(card.when, card.whenResources, card.quantity, 'condition');
		html += ":</div>";
		html += "<div class='ms-3'>" + config.watDo.captions[config.actions.indexOf(card.watDo)] 
		html += this.fetchCardResourceRef(card.watDo, card.doResources, card.quantity, 'do');
		html += "</div>";
		html += "</div>";
		return html;
		
	}
	
	getAllDoForCondition(ogCard){
		let html = '';
		for (let cardID in config.tableau){
			let card = config.tableau[cardID], winClass = '';			
			if (card.when != ogCard.when || 
				((card.when == 'increment' || card.when == 'decrement') 
				&& card.whenResources[0] != ogCard.whenResources[0]) 
				|| (card.when == 'convert'  
				&& card.whenResources[0] != ogCard.whenResources[0] && card.whenResources[1] != ogCard.whenResources[1])){
				continue;
			}
			if (card.watDo == 'win'){
				winClass = ' win ';
			}
			html += "<div class='" + winClass + "' >" + config.watDo.captions[config.actions.indexOf(card.watDo)] 
				+ " " + this.fetchCardResourceRef(card.watDo, card.doResources, card.quantity, 'do') + "</div>";
			
		}
		return html;
	}
	
	popPop(id){
		$("#" + id).addClass('checking');
		setTimeout(function(){
			$("#" + id).removeClass('checking');
		}, config.checkingDelay);
	}
	popClass(className){
		console.log(className);
		$("." + className).addClass('checking');
		setTimeout(function(){
			$("." + className).removeClass('checking');
		}, config.checkingDelay);
	}
}
