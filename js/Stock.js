class Stock {
	auto_win_at = 20;

    defaultDistributed = ['available', 'reloads'];

    defaultQuant = [
		0, Math.round(this.auto_win_at / 2), 5, 
		0, TABLEAU_LIMIT, 3, 
		1, 0, 0,
		0, 0, 0,
	];    
    distributed = [];
    quant = [];
    types = [
		'clicks', 'available', 'reloads', 		
		'marketLimit', 'tableauLimit', 'marketInit', 
		'wipes', 'destroyed', 'wins', 
		'losses', 'restarts', 'loops',
	];	
        constructor(){
			this.quant = this.defaultQuant.slice();
        	this.distributed = this.defaultDistributed.slice();
		}

    convert (from, quantity, to){
		if (this.get(from) < 1){
			config.tableau.destroy('convert', from, to);
			return;
		}				
		this.set(from, this.get(from) - 1);
		this.set(to, this.get(to) + quantity);
		config.playAudio('convert');
		ui.refresh();
		game.doCheck('convert', from, to);
		
	}
  
	decrement(name, quantity){
		this.set(name, this.get(name) - quantity);		
		config.playAudio('decrement');
		game.doCheck('decrement', name, null);
	}
	
    get(typeName){
        return  this.quant[this.types.indexOf(typeName)];
    }

	increment(name, quantity){
		let idArr = { available: 'clickButtonDiv', 
			marketInit: 'marketInit', reloads: 'reloadDiv',
			tableauLimit: 'tableauLimit' }
			
		this.set(name, this.get(name) + quantity);
		
		config.playAudio('increment');
		ui.refresh();
		ui.popPop(idArr[name]);
		game.doCheck('increment', name, null);
		
	}

    reset(){
        let saveArr = [], saveThis = ['wins', 'restarts', 'losses', 'loops'];
		for (let i in saveThis){			
			saveArr[i] = this.get(saveThis[i]);
		}
        this.quant = this.defaultQuant.slice();
        //this.distributed = this.defaultDistributed.slice(); is this okay?
		for (let i in saveThis){
			this.set(saveThis[i], saveArr[i]);		
		}	
    }

    set(typeName, quantity){
        this.quant[this.types.indexOf(typeName)] = quantity;
    }
}