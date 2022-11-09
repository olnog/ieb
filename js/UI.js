class UI{
	animating = null;
	animatingDelay = 10;

	defaultVelocity = 50;
	leftVelocity = null;
	market = new UIMarket();
	movingLeft = true;
	rateOfChange = 1.05;
	refreshChange = new UIRefresh();

	constructor(){
		this.leftVelocity = this.defaultVelocity;
	}

  refresh(){
	//console.log('ui.refresh');
	this.refreshChange.do();
	this.displayMarket();
	this.displayHand();
  }
  
	changeButton(id, add){
		
		let filename = $("#" + id + "Img").prop('src');
		let newImgAddStr = '-black.png';
		let newImg = filename.replace('.png', newImgAddStr);		
		

		if ((add && filename.substring(filename.length - newImgAddStr.length) == newImgAddStr) 
		|| (!add && filename.substring(filename.length - newImgAddStr.length) != newImgAddStr)){
			return;
		}
		if (add){
			$("#" + id + "Img").prop('src', newImg);		
			return;
		}		
		$("#" + id + "Img").prop('src', filename.replace(newImgAddStr, '.png'));
	}
  
	animateMarket(){
		$("#market").addClass('d-none');
		$("#oldMarket").html($("#market").html());
		$("#market").css('opacity', 0);		
		$("#refresh").prop('disabled', true);
		this.animating = setInterval(this.animatingMarket, this.animatingDelay);
	}

	animatingMarket(){
		//too busy
		if (ui.movingLeft){
			let cssPX = Number($("#oldMarket").css('left').substring(0, $("#oldMarket").css('left').length - 2));		
			$("#oldMarket").css('left', (cssPX - ui.leftVelocity) + 'px');
			ui.leftVelocity *= ui.rateOfChange;
		}
		if (ui.movingLeft && ui.leftVelocity > window.innerWidth ){
			$("#oldMarket").css('left',0);
			ui.leftVelocity = ui.defaultVelocity;
			ui.movingLeft = false;
			$("#market").removeClass('d-none');
			$("#oldMarket").html('');
		}
		if (!ui.movingLeft && $("#market").css('opacity') < 1){
			$("#market").css('opacity', Number($("#market").css('opacity')) + .10);
			return;
		}
		if (!ui.movingLeft){
			clearInterval(ui.animating);
			ui.animating = null;
			$(".cardDiv").addClass('shake');
			setTimeout(function(){
				$(".cardDiv").removeClass('shake');

			}, 200);
			ui.movingLeft = true;
			$("#refresh").prop('disabled', false);
		}
	}

	displayHand(){
		let coveredConditions  = [];
		let  html = '';
		for (let cardID in config.tableau.cards){				
			let card = config.tableau.cards[cardID];
			let identifier = card.when + "-" + String(card.whenResources[0]) + "-" + String(card.whenResources[1]);
			if (coveredConditions.includes(identifier)){
				continue;
			}
			html += "<div> When " + config.when.captions[config.actions.indexOf(card.when)] 
			html += this.fetchCardResourceRef(card.when, card.whenResources, card.quantity, 'condition');
			html += ":</div>";
			html += "<div class='ms-3'>";
			html += this.getAllDoForCondition(card);
			html += "</div>";
			coveredConditions.push(identifier);
		}
		$("#cards").html(html);
	}
	
	displayMarket(){
		let html = "<div class=''>";
		let maxCardsInRow = 3;		
		for (let cardID in market.cards){			
			html += this.market.fetch(cardID);			
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
	
	getAllDoForCondition(ogCard){
		let html = '';
		for (let cardID in config.tableau.cards){
			let card = config.tableau.cards[cardID], winClass = '';		
			let checkingClass = '';
			if (card.when != ogCard.when){
				
				continue;
			}
			if (card.watDo == 'win'){
				winClass = ' win ';
			}
			if (config.checked.includes(cardID)){
				checkingClass = ' checking ';
			}
			if (card.whenResources[0] == ogCard.whenResources[0] && card.whenResources[1] == ogCard.whenResources[1]){
				html += "<div id='tableauDo-" + cardID + "-" + card.when + "' class='" + winClass + checkingClass + "' >" + config.watDo.captions[config.actions.indexOf(card.watDo)] 
					+ " " + this.fetchCardResourceRef(card.watDo, card.doResources, card.quantity, 'do') + "</div>";
			}
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
		$("." + className).addClass('checking');
		setTimeout(function(){
			$("." + className).removeClass('checking');
		}, config.checkingDelay);
	}
}
