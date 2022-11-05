

$(document).on('click', 'button', function(e){
	config.resetCardsChecked();
});

$(document).on('click', '#audioOn', function(e){
	config.audioOn = $("#audioOn").prop('checked');
});


$(document).on('click', '.buy', function(e){	
	market.buy(e.target.id.split('-')[1], null);	
})

$(document).on('click', '#clickButton', function(e){	
	game.clickButton();
});

$(document).on('click', '.show', function(e){	
	$(".windows").addClass('d-none');
	$("#" + e.target.id.split('-')[1]).removeClass('d-none');
});

$(document).on('click', '#refresh', function(e){
	market.refresh(true);
});

$(document).on('click', '#restart', function(e){
	if (window.confirm('are you sure you want to restart your game?')){
		game.restart(true);
	}
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
