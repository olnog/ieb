class UIRefresh{

    do(){
        $("#marketSize").html(market.cards.length);
        $("#tableauSize").html(config.tableau.cards.length);	
        $("#wipe").prop('disabled', false);	
        $("#winAt").html(AUTO_WIN_AT);
        $("#tableauLabel").removeClass('fs-4');
        $("#tableauLabel").removeClass('text-decoration-underline');	
        $("#audioOn").prop('checked', config.audioOn);	
        if (config.tableau.cards.length >= config.stock.get('tableauLimit')){
            //this is to make it clearer why players can't buy cards when they have the hearts
            $("#tableauLabel").addClass('fs-4');
            $("#tableauLabel").addClass('text-decoration-underline');
        }
        if (config.numOfTurns > 0){
            $(".everythingElse").removeClass('d-none');
        }
        console.log('why wont loops show', config.stock.get('wins'),
            config.stock.get('losses'),
            config.stock.get('loops') )
        if (config.stock.get('wins') > 0 
            || config.stock.get('losses') > 0 
            || config.stock.get('loops') > 0 ){
            $("#stats").removeClass('d-none');
        }
        if (config.stock.get('restarts') > 0){
            $("#restart").removeClass('d-none');
        }
        if (config.stock.get('destroyed') > 0){
            $("#tableauDestroyed").removeClass('d-none');
        }
        
        if (config.stock.get('wipes') < 1 || config.tableau.cards.length < 1){	
            $("#wipe").prop('disabled', true);
        }
        if (config.tableau.cards.length > 0){
            $(".tableau").removeClass('d-none');
        }
        for (let name of config.stock.types){            
            $("#" + name).html(config.stock.get(name));
	    }
        $(".available").html(config.stock.get('available'));
    }
}