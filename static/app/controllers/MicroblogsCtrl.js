App.controller ('MicroblogsCtrl',['$scope', '$http', 'MicroblogsService', 'GeneralDataService', 'UserDetailsService', '$location','APIService', 'Notification', function ($scope, $http, MicroblogsService, GeneralDataService,UserDetailsService,$location,API,Notification){
	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;
	console.log('currentUser',currentUsername);
	var periodicalReqiestInterval;
	var periodicalRequestParams;

	var maxMessagesInit = 9;
	var messagesMoreStep = 9;
	$scope.maxMessages = maxMessagesInit;
	$scope.microblogs = {};
	$scope.microblogs.formFocused = false;

	$scope.microblogs.new = {};
	$scope.microblogs.new.markets = [
		{name: 'US Market', symbol: 'us', flag: 'us-flag.png'},
		{name: 'CA Market', symbol: 'ca', flag: 'ca-flag.png'},
		{name: 'UK Market', symbol: 'uk', flag: 'uk-flag.png'},
		{name: 'DE Market', symbol: 'de', flag: 'de-flag.png'},
		{name: 'HK Market', symbol: 'hk', flag: 'hk-flag.png'}
	];
	$scope.microblogs.new.market= $scope.microblogs.new.markets[0];

	$scope.microblogs.filter = {};
	$scope.microblogs.filters = [
		{name: 'Default', query_type: 'default'},
		{name: 'Only Me', query_type: 'only-me'},
		{name: 'Sectors', query_type: 'sectors'},
		{name: 'Symbols', query_type: 'symbols'}
	];
	$scope.microblogs.filter = $scope.microblogs.filters[0];
	$scope.sectors = ["utilities", "services", "industrial goods", "consumer goods", "conglomerates", "financial", "healthcare", "basic materials", "technology"];
	$scope.microblogs.filterMarket = $scope.microblogs.new.markets[0];

	$scope.showMoreMessages = function(){
		$scope.maxMessages+=messagesMoreStep;
	};




	//watching for market changes
	$scope.$watch(function(){
		return $scope.microblogs.filterMarket
	}, function(){
		console.log('$scope.$scope.microblogs.filterMarket',$scope.microblogs.filterMarket);
		stock_info_market = $scope.microblogs.filterMarket.symbol;
		$scope.liveSearchSymbol("/personal/getsymbols/"+stock_info_market);
		//if (stock_info_market == 'us') {
		//
		//	//stock_info_market = "us";
		//	stock_info_symbol = "googl";
		//	stock_info_symbol_rss = "googl";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol;
		//	$scope.liveSearchSymbol("/personal/getsymbols/us");
		//}
		//
		//else if (stock_info_market == 'to') {
		//
		//	//stock_info_market = "to";
		//	stock_info_symbol = "pow";
		//	stock_info_symbol_rss = "pow.to";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".to";
		//	$scope.liveSearchSymbol("/personal/getsymbols/to");
		//}
		//
		//else if (stock_info_market == 'l') {
		//	//stock_info_market = "l";
		//	stock_info_symbol = "rr";
		//	stock_info_symbol_rss = "rr.l";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".l";
		//	$scope.liveSearchSymbol("/personal/getsymbols/uk");
		//
		//}
		//
		//else if (stock_info_market == 'hk') {
		//	//stock_info_market = "hk";
		//	stock_info_symbol = "0168";
		//	stock_info_symbol_rss = "0168.kh";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".hk";
		//	$scope.liveSearchSymbol("/personal/getsymbols/hk");
		//}
		//
		//else if (stock_info_market == 'de') {
		//	//stock_info_market = "de";
		//	stock_info_symbol = "cbk";
		//	stock_info_symbol_rss = "cbk.de";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".de";
		//	$scope.liveSearchSymbol("/personal/getsymbols/de");
		//}
		//
		//else {
		//	console.log("Market Selection Error");
		//}

		//$scope.getData();
		//$scope.updateChart();
		//console.log("Radio Model is " + $scope.marketSelectionSwitcher);
	});


	//live search
	$scope.liveSearchSymbol = function(apiUrl) {
		API.getHttp(apiUrl)
			.then(function (data) {
				$scope.selected = undefined;
				$scope.symbols = data;
			},function(response) {
				console.error('Gists error', response.status, response.data);
			});

	};







	$scope.getDefaultMicroblogs = function(user) {
		MicroblogsService.getMicroblogsService({user:user, market:"us", query_type:"default"})
			.then(function(data) {
				console.log("Service Microblogs", data);

				$scope.microblogs.data = data.results;
				$scope.microblogs.tstamp = data.tstamp;
				startPeriodicalRequests();
				processMessages($scope.microblogs.data);
				MicroblogsService.getRepliesCount($scope.microblogs.data);
				sortMessages();
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error', error);
			});
	};
	$scope.getDefaultMicroblogs(currentUsername);


	$scope.getMicroblogs = function(data){
		MicroblogsService.getMicroblogsService(data)
			.then(function(data){
				console.log("Service Microblogs2", data);
				$scope.maxMessages = maxMessagesInit;
				//startPeriodicalRequests();
				$scope.microblogs.data = data.results;
				sortMessages();
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error2', error);
			});
	};

	$scope.formatLabel = function(model){
		console.log('!!!!',$scope.symbols,model);
		var res  = _.find($scope.symbols,{symbol:model})
		if(res){
			return res.name;
		}

		//for (var i=0; i< $scope.symbols.length; i++) {
		//	if (model === $scope.options[i].value) {
		//		return $scope.options[i].text;
		//	}
		//}
	};

	$scope.submitFilters = function(){
		var q = _.pick($scope.microblogs.filter,['query_type','market','sector','symbol']);
		q.market = $scope.microblogs.filterMarket.symbol;
		q.user = currentUsername;
		if(q.symbol){q.symbols = [q.symbol]};
		if(q.sector){q.sectors = q.sector};

		if(!checkSumbitFilters(q)){
			Notification.error('Some fields required are empty');
			return;
		}


		startPeriodicalRequests();// IT SAVES PERIODICAL REQUEST PARAMS


		console.log('_', q);

		$scope.getMicroblogs(q);
		//startPeriodicalRequests();
		//$scope.maxMessages = maxMessagesInit;
		//sortMessages();
		$scope.microblogs.filter.sector=null;
		$scope.microblogs.filter.symbol=null;
	};

	$scope.createTopic = function() {
		MicroblogsService.createTopic(currentUsername, $scope.microblogs.new.message, $scope.microblogs.new.market.symbol)
			.then(function(data) {
				// promise fulfilled
				$scope.microblogs.new.response = data;
				$scope.microblogs.new.message = "";
				$scope.microblogs.formFocused = false;
				console.log("Service New Topic Response",  $scope.microblogs.data);
				$scope.getDefaultMicroblogs(currentUsername, "us", "default");


			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service New Topic Error', error);
			});
	};

	$scope.getReplies = function(theme_id) {
		MicroblogsService.getRepliesService(currentUsername, "us", theme_id)
			.then(function(data) {
				// promise fulfilled
				$scope.microblogs.replies = data.results;
				console.log("Service Microblogs Replies",  $scope.microblogs.data);


			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error', error);
			});
	};

	$scope.sendReply = function(theme_id) {
		MicroblogsService.sendReplyService(currentUsername, theme_id, $scope.microblogs.replyData)
			.then(function(data) {
				// promise fulfilled
				console.log("Service Microblogs Send Reply",  $scope.microblogs.data);
				$scope.microblogs.replyData = "";
				//$scope.getReplies($scope.microblogs.clickedMicroblogElement.theme_id);
				//$scope.microblogs.clickedMicroblogElement.replies += 1;


			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Microblogs Send Reply Error', error);
			});
	};

	$scope.getClickedMicroblogElement = function(element) {
		$scope.microblogs.replies = "";
		console.log(element);
		$scope.microblogs.clickedMicroblogElement = element;
		$scope.getReplies(element.theme_id);
	};

	$scope.dismissCreateMicroblogForm = function() {
		$scope.microblogs.formFocused = false;
		$scope.microblogs.new.message = "";
	};

	$scope.dismissReplyForm = function() {
		$scope.microblogs.clickedMicroblogElement = null;
	};

	$scope.getSymbols = function(market) {
		GeneralDataService.getSymbols(market)
			.then(function(data) {
				// promise fulfilled
				console.log("Service GET SYMBOLS",  $scope.microblogs.data);
				$scope.microblogs.symbols = data;


			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service SYMBOLS Error', error);
			});
	};
	$scope.getSymbols($scope.microblogs.filterMarket);

	$scope.microblogs.filter.sector = [];
	$scope.microblogs.filter.sectors = ["utilities", "services", "industrial goods", "consumer goods", "conglomerates", "financial", "healthcare", "basic materials", "technology"];


	$scope.gotoProfile = function(username){
		$location.path('/user/'+username);
		//"#/user/{{reply.user}}"
	}


	function processMessages(messages){
		_.each(messages,processMessage);
	}

	var reBold = /([\$\#\@]\S+)/ig;
	var reLink = /((?:http:\/\/\S+\.\S+)|(?:w{3}\S+\.\S+)|(?:\S+\.(?:ru|com|net|png|jpg|jpeg|bmp)))/ig;
	function processMessage(message){
		message.message =  String(message.message).replace(reBold,"<strong>$1</strong>");
		message.message =  String(message.message).replace(reLink,"<a href='$1' target='_blank'>$1</a>");
	}

	function doPeriodicalRequest(){
		console.log('DPR',periodicalRequestParams);
		MicroblogsService.getPushMessages(periodicalRequestParams.query_type,periodicalRequestParams.market,periodicalRequestParams.tstamp,periodicalRequestParams).then(function(res){
			console.log('PM<<, ',res);
			if(res.results && !_.isEmpty(res.results)){
				$scope.microblogs.data = _.union($scope.microblogs.data,res.results);
				sortMessages()
			};
			$scope.microblogs.tstamp = res.tstamp;

		});

	};

	function startPeriodicalRequests(){
		periodicalRequestParams = {
			tstamp:$scope.microblogs.tstamp,
			query_type:$scope.microblogs.filter.query_type,
			market:$scope.microblogs.new.market.symbol,
			sector:$scope.microblogs.filter.sector,
			symbol:$scope.microblogs.filter.symbol,
			username:currentUsername,
			microblogs: _.cloneDeep($scope.microblogs)
		};
		if(periodicalReqiestInterval){
			clearInterval(periodicalReqiestInterval)
		}
		periodicalReqiestInterval = setInterval(doPeriodicalRequest,3000)
	}


	function sortMessages(){
		$scope.microblogs.data = _.sortBy($scope.microblogs.data,function(item){
			return -item.activity_timestamp;
		})
	}

	function checkSumbitFilters(q){
		if(q.query_type=='sectors' && (!q.sectors || _.isEmpty(q.sectors)) ){
			return false;
		}else if (q.query_type=='symbols' && (!q.symbols || _.isEmpty(q.symbols)) ){
			return false;
		}else{
			return true;
		}
	}

	$scope.$on('$destroy',function(){
		if(periodicalReqiestInterval){
			clearInterval(periodicalReqiestInterval)
		}
	})
}]);