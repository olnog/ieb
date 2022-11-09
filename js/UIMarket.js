class UIMarket {
    fetch(cardID){	
		let card = market.cards[cardID];		
		let buyFormControl = '';
		let disabledClass = '', doClass = '', whenClass = '', winClass = '', noBuyClass = '';
		if (config.stock.get('destroyed') < 1){
			buyFormControl = ' form-control ';
		}
		
		if (config.stock.get('available') < card.cost){
			noBuyClass = ' noBuy ';
		}
		if (config.tableau.matchWhen(card.watDo, card.doResources)){
			doClass = ' important ';
		}
		if (card.watDo == 'win'){
			winClass = ' win ';
		}

		if (card.when == 'convert' && config.tableau.canTheyConvert(card.whenResources[0], card.whenResources[1])){
			whenClass = ' important ';
		} else if ((card.when == 'increment' || card.when == 'decrement') 
			&& config.tableau.canThey(card.when, card.whenResources[0])){
			whenClass = ' important ';
		} else if (card.when != 'increment' && card.when != 'decrement' && card.when != 'convert' 
			&& config.tableau.doTheyOwnDo(card.when)){
			whenClass = ' important ';
		}
		let html = "<div class='cardDiv" + noBuyClass + "'>";
		html += "<div class='text-center '><img src='img2/available"
		if (noBuyClass != ''){
			html += "-noBuy";
		}
		html += ".png'></div><div><span class='available'>" 
		+ config.stock.get('available') + "</span>/" + card.cost + "</div>";		
		html += "<div class='fw-bold mt-3'>When:</div>"
		html += "<div class='" + whenClass + "'> ";
		if (noBuyClass != ''){
			html += config.when.captions[config.actions.indexOf(card.when)].replace('.png', '-noBuy.png');
		} else {
			html += config.when.captions[config.actions.indexOf(card.when)] ;
		}
		
		
		html += ui.fetchCardResourceRef(card.when, card.whenResources, card.quantity, 'condition', noBuyClass != '');
		html += "</div>";
		html += "<div class='fw-bold mt-3'>Do:</div>"
		html += "<div class='" + doClass + " " + winClass + "'>";
		if (noBuyClass != ''){
			html += config.watDo.captions[config.actions.indexOf(card.watDo)].replace('.png', '-noBuy.png');
		} else {
			html += config.watDo.captions[config.actions.indexOf(card.watDo)];
		}
		html += ui.fetchCardResourceRef(card.watDo, card.doResources, card.quantity, 'do', noBuyClass != '');
		html += "</div>";	
			
		
		if (config.stock.get('available') < card.cost 
			//|| config.tableau.length >= config.stock.get('tableauLimit')
			){
			disabledClass = ' disabled ';
		}
		html += "<div>"
		if (config.stock.get('destroyed') > 0){
			html += "<button id='claim-" + cardID 
				+ "' class='claim btn-lg btn btn-warning'>claim</button>";
		}
		html += "<button id='buy-" + cardID + "' class='buy btn btn-lg btn-success " + buyFormControl + " ' " 
			+ disabledClass + ">buy</button>";
		html += "</div>";		
		html += "</div>";
		return html;
	}
}