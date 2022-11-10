class UIRefresh{

    do(){
        let losses = config.stock.get('losses');
        let wins = config.stock.get('wins');
        let lossesCent = 0, winsCent = 0;
        if (losses > 0 ){
            winsCent = Math.round(wins / losses * 10) / 10;
        } else if (wins > 0){
            winsCent = 100;
        }
        if (wins > 0 ){
            lossesCent = Math.round(losses / wins * 10) / 10;
        } else if (losses > 0){
            lossesCent = 100;
        }
        $("#lossesCent").html(lossesCent);
        $("#winsCent").html(winsCent);
        $("#marketSize").html(market.cards.length);
        $("#tableauSize").html(config.tableau.cards.length);	
        $("#wipe").prop('disabled', false);	
        $("#winAt").html(config.stock.auto_win_at);
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
        $(".loops").html(config.stock.get('loops'));
    }
}