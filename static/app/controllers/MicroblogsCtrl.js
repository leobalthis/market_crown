App.controller ('MicroblogsCtrl',['$scope', '$http', 'MicroblogsService', 'GeneralDataService', 'UserDetailsService', function ($scope, $http, MicroblogsService, GeneralDataService,UserDetailsService){
	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;
	console.log('currentUser',currentUsername);

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
		{name: 'Default', symbol: 'default'},
		{name: 'Only Me', symbol: 'only-me'},
		{name: 'Sectors', symbol: 'sectors'},
		{name: 'Symbols', symbol: 'symbols'}
	];
	$scope.microblogs.filter = $scope.microblogs.filters[0];

	$scope.microblogs.filterMarket = $scope.microblogs.new.markets[0];


	$scope.getDefaultMicroblogs = function(user, market, query_type) {
		MicroblogsService.getDefaultMicroblogsService(user, market, query_type)
			.then(function(data) {
				console.log("Service Microblogs", data);
				$scope.microblogs.data = data.results;



			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error', error);
			});
	};
	$scope.getDefaultMicroblogs(currentUsername, "us", "default");

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
				$scope.getReplies($scope.microblogs.clickedMicroblogElement.theme_id);
				$scope.microblogs.clickedMicroblogElement.replies += 1;


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

}]);