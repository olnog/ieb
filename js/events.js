$(document).on('click', 'button', function(e){
	config.resetCardsChecked();
});
$(document).on('click', '.buy', function(e){	
	market.buy(e.target.id.split('-')[1], null);	
})

$(document).on('click', '#available', function(e){	
	game.clickButton();
});

$(document).on('click', '#refresh', function(e){
	market.refresh(true);
});

$(document).on('click', '#restart', function(e){
	if (window.confirm('are you sure you want to restart your game?')){
		game.restart(true);
	}
});

$(document).on('click', '#switch', function(e){	
	game.decrement('available', 1);
	config.switchClick();
	
});
$(document).on('click', '#wipe', function(e){		
	if (window.confirm('are you sure you want to wipe your tableau?')){
		game.wipe(true);		
	}
});

$(document).on('click', 'button', function(e){
	config.numOfTurns++;
  ui.refresh()
})
