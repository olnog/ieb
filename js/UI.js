class UI{
	animating = null;
	animatingDelay = 10;
	animateBGDelay = null;
	animateBGDown = true;
	bgColor = null;
	bgColorChange = 4369;
	bgGoal = 16729344;
	bgRed = 16711680;
	defaultAnimateBGDelay = 50;
	defaultBGStart = 16777215;
	defaultVelocity = 1;
	leftVelocity = null;
	market = new UIMarket();
	movingLeft = true;
	rateOfChange = 1.05;
	refreshChange = new UIRefresh();

	constructor(){
		this.animateBGDelay = this.defaultAnimateBGDelay;
		this.bgColor = this.defaultBGStart;
		this.leftVelocity = this.defaultVelocity;
	}

  refresh(){
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
  
	animateBG(){	
		if (ui.animateBGDown && ui.bgColor > ui.bgGoal){			
			ui.bgColor -= ui.bgColorChange;
			ui.animateBGDelay *= .97;
		}
		if (ui.animateBGDown && ui.bgColor <= ui.bgGoal){			
			ui.animateBGDown = false;
			ui.animateBGDelay = ui.defaultAnimateBGDelay;
		}
		if (!ui.animateBGDown && ui.bgColor < ui.defaultBGStart) {			
			ui.bgColor += ui.bgColorChange;
			ui.animateBGDelay *= .80;						
		}
		if (!ui.animateBGDown && ui.bgColor >= ui.defaultBGStart) {
			$("body").css('background-color', "#ffffff");
			ui.animateBGDelay = ui.defaultAnimateBGDelay;
			ui.bgColor = ui.defaultBGStart;	
			return;
		}
		$("body").css('background-color', "#" + ui.bgColor.toString(16))
		setTimeout(ui.animateBG, ui.animateBGDelay);

		
	}

	animateMarket(){
		$("#market").addClass('d-none');
		$("#market").css('position', 'absolute');
		$("#oldMarket").html($("#market").html());		
		$("#oldMarket").removeClass('d-none');
		$("#refresh").prop('disabled', true);
		this.animating = setInterval(this.animatingMarket, this.animatingDelay);
	}

	animatingMarket(){
		let cssPX = Number($("#oldMarket").css('left').substring(0, $("#oldMarket").css('left').length - 2));
		if (!ui.movingLeft){
			cssPX = Number($("#market").css('left').substring(0, $("#market").css('left').length - 2));
		}
		if (ui.movingLeft){					
			$("#oldMarket").css('left', (cssPX - ui.leftVelocity) + 'px');
			ui.leftVelocity *= 1.2;
		}
		if (!ui.movingLeft){
			$("#market").css('left', (cssPX + ui.leftVelocity) + 'px');
			ui.leftVelocity *= 1.1;
		}
		if (ui.movingLeft && -cssPX > window.innerWidth * 2 ){
			$("#market").css('left', -window.innerWidth);
			$("#oldMarket").css('left', '0px');			
			$("#oldMarket").addClass('d-none');
			ui.leftVelocity = ui.defaultVelocity;
			ui.movingLeft = false;
			$("#market").removeClass('d-none');
			$("#oldMarket").html('');
		}
		if (!ui.movingLeft && cssPX > 0){
			$("#market").css('left', 0);
			$("#market").css('position', 'relative');
			clearInterval(ui.animating);
			ui.animating = null;
			$(".cardDiv").addClass('shake');
			setTimeout(function(){
				$(".cardDiv").removeClass('shake');
				$("#refresh").prop('disabled', false);
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
	
	displayLoops(){
		$(".windows").addClass('d-none');
		$("#loopMenu").removeClass('d-none');
		let html = '';

		for (let cardID in config.tableau.cards){
			let card = config.tableau.cards[cardID];
			html += "<div class='cardDiv p-3 mb-5'>";
			html += "<div class='fw-bold'>When:</div>";
			html += "<div class='text-center'>" + config.when.captions[config.actions.indexOf(card.when)] 
			html += this.fetchCardResourceRef(card.when, card.whenResources, card.quantity, 'condition', false);
			html += "</div>";
			html += "<div class='fw-bold'>Do:</div>";
			html += "<div class='text-center'>" + config.watDo.captions[config.actions.indexOf(card.watDo)] 
			html += ui.fetchCardResourceRef(card.watDo, card.doResources, card.quantity, 'do', false);
			html += "</div>";
			html += "<button id='keep-" + cardID + "' class='btn btn-success btn-lg p-3 form-control keep'>Keep</button>"
			html += "</div>";
		}
		$("#whichCardsToKeep").html(html);
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
