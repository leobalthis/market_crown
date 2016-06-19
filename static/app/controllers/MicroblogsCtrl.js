App.controller ('MicroblogsCtrl',['$scope', '$http', 'MicroblogsService', 'GeneralDataService', 'UserDetailsService', '$location', function ($scope, $http, MicroblogsService, GeneralDataService,UserDetailsService,$location){
	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;
	console.log('currentUser',currentUsername);
	var periodicalReqiestInterval;
	var periodicalRequestParams;

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

	$scope.microblogs.filterMarket = $scope.microblogs.new.markets[0];


	$scope.getDefaultMicroblogs = function(user) {
		MicroblogsService.getMicroblogsService({user:user, market:"us", query_type:"default"})
			.then(function(data) {
				console.log("Service Microblogs", data);

				$scope.microblogs.data = data.results;
				$scope.microblogs.tstamp = data.tstamp;
				startPeriodicalRequests();
				processMessages($scope.microblogs.data);
				MicroblogsService.getRepliesCount($scope.microblogs.data);
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error', error);
			});
	};
	$scope.getDefaultMicroblogs(currentUsername);


	$scope.getMicroblogs = function(market, querytype){
		MicroblogsService.getMicroblogsService({user:currentUsername,market:market,query_type:querytype})
			.then(function(data){
				console.log("Service Microblogs2", data);
				startPeriodicalRequests();
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error2', error);
			});
	};

	$scope.submitFilters = function(){
		var q = _.pick($scope.microblogs.filter,['query_type','market','sector','symbol']);
		q.market = $scope.microblogs.filterMarket.symbol;
		q.user = currentUsername;
		console.log('_', q);
		$scope.getMicroblogs(q);
		startPeriodicalRequests();

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


		console.log('DPR',$scope.microblogs,periodicalRequestParams);
		MicroblogsService.getPushMessages(periodicalRequestParams.query_type,periodicalRequestParams.market,periodicalRequestParams.tstamp,periodicalRequestParams.microblogs).then(function(res){
			console.log('PM<<, ',res);
			if(res.results && !_.isEmpty(res.results)){
				$scope.microblogs.data = _.union($scope.microblogs.data,res.results);
			};
			$scope.microblogs.tstamp = res.tstamp;

		});

	};

	function startPeriodicalRequests(){
		periodicalRequestParams = {
			tstamp:$scope.microblogs.tstamp,
			query_type:$scope.microblogs.filter.query_type,
			market:$scope.microblogs.new.market.symbol,
			microblogs: _.cloneDeep($scope.microblogs)
		};
		if(periodicalReqiestInterval){
			clearInterval(periodicalReqiestInterval)
		}
		periodicalReqiestInterval = setInterval(doPeriodicalRequest,3000)
	}

	$scope.$on('$destroy',function(){
		if(periodicalReqiestInterval){
			clearInterval(periodicalReqiestInterval)
		}
	})
}]);