

$(document).on('mouseover', 'button', function(e){
	let triggerArr = ['clickButton', 'refresh', 'restart', 'wipe'];
	if (triggerArr.includes(e.currentTarget.id)){
		ui.changeButton(e.currentTarget.id, true);
	}
	
});
$(document).on('mouseleave', 'button', function(e){
	let triggerArr = ['clickButton', 'refresh', 'restart', 'wipe'];
	if (triggerArr.includes(e.currentTarget.id)){
		ui.changeButton(e.currentTarget.id, false);
	}
	
});
$(document).on('click', 'button', function(e){
	config.numOfTurns++;
	
});

$(document).on('click', '#audioOn', function(e){
	config.audioOn = $("#audioOn").prop('checked');
});

$(document).on('click', '.back', function(e){	
	$(".windows").addClass('d-none');
	$("#game").removeClass('d-none');
});

$(document).on('click', '.buy', function(e){	
	market.buy(e.target.id.split('-')[1], null);	
})

$(document).on('click', '.claim', function(e){	
	market.claim(e.target.id.split('-')[1], null);	
})

$(document).on('click', '#clickButton', function(e){	
	config.clickButton();
});

$(document).on('click', '.keep', function(e){	
	config.tableau.keep(e.target.id.split('-')[1])
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
		config.wipe(true);		
	}
});

$(document).on('click', 'button', function(e){

})
