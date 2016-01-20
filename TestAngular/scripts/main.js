(function(){
	var app = angular.module('mainApp', []);
	app.controller('searchController',function($controller){
		this.resultList = [];
		this.items = [
			{
				"name":"thing1",
				"type":"type1"
			},
			{
				"name":"thing2",
				"type":"type2"
			},
			{
				"name":"apple",
				"type":"fruit"
			},
			{
				"name":"banana",
				"type":"fruit"
			}

		];
		this.query = "";
		this.search =function(){
			this.resultList=[];
			if(!this.query){
				this.resultList=this.items;
				return;
			}
			for(var i = 0; i<this.items.length; i ++){
				if(this.items[i].name.indexOf(this.query)>-1){
					this.resultList.push(this.items[i]);
				}
				if(this.items[i].type.indexOf(this.query)>-1){
					this.resultList.push(this.items[i]);
				}
			}
			console.log("did search");
			console.log(this.query);
		};
	});
	app.service('billService',function(){
		var bill = [];
		return{
			getBill: function(){
				return bill;
			},
			setBill: function(value){
				bill=value;
			}
		}
	})
	app.controller('billDisplay',function(billService){
		this.billItems=billService.getBill();
		this.refresh = function(){
			this.billItems = billService.getBill();
		}
		this.delete = function(item){
			var index = this.billItems.indexOf(item);
			this.billItems.splice(index,1);
			billService.setBill(this.billItems);
			console.log(this.billItems);
		}
	})

	app.controller('formController', function(billService, $controller){
		this.bill =billService.getBill();
		this.billItem = {};
		var billDisplay = $controller('billDisplay');
		this.addItem = function(){
			var item = this.billItem;
			if (item.totalPrice) {
				item.pricePerItem = item.totalPrice/item.quantity;
			}else{
				item.totalPrice=item.pricePerItem*item.quantity;
			}
			this.bill.push(this.billItem);
			billService.setBill(this.bill);
			this.billItem={};
		}
	});
	app.service('wordService', function(){
		this.words = ["secret", "factual", "dog", "cat", "animals", "java"];
		this.getWord = function(){
			return this.words[Math.floor((Math.random()*this.words.length)+1)];
		}
		this.usedList=[];
		this.setUsedList = function(value){
			this.usedList= value;
		}
		this.getUsedList = function(){
			return this.usedList;
		}
	});
	//hangman view controller
	app.controller('gameController', function(wordService){
		// this.word = "";
		this.secret = "";
		this.usedList = wordService.getUsedList();
		this.usedDisplay= function(){
			if(this.usedList){
				return this.usedList.join();
			}
		}
		this.used = this.usedDisplay();
		this.startGame = function(){
			this.secret = wordService.getWord();
			this.secretDisplay=this.secretConverter();
			wordService.setUsedList(null);
			console.log("the secret is "+this.secret);
			this.used = "";
		}
		this.guess = "";
		this.secretConverter = function(){
			var hidden = "";
			for(var i = 0; i <this.secret.length; i ++){
				hidden+="_";
			}
			return hidden;
		}
		this.hidden="";
		this.secretDisplay = "";
		this.secretDisplayer = function(){
			for(var i = 0 ; i <this.hidden.length; i ++){
				this.secretDisplay="";
				this.secretDisplay+=this.hidden[i];
				if(i!=this.hidden.length-1){
					this.secretDisplay+=" ";
				}
			}
		}
		this.guessWord = function(){
			var indices = [];
			if(this.secret.toUpperCase().indexOf(this.guess.toUpperCase())==-1){
				this.usedList.push(this.guess.toUpperCase());
				this.used=this.usedDisplay();
				console.log("bad guess");
			}else{
				console.log("good guess");
				for(var i = 0; i<this.secret.length; i ++){
					if(this.guess.toUpperCase()===this.secret[i].toUpperCase()){
						this.hidden=this.hidden.substr(0, i) + this.guess.toUpperCase() + this.hidden.substr(i+1);
					}
				}
				console.log(this.hidden);
				this.secretDisplayer();
			}
		}
	});
})();