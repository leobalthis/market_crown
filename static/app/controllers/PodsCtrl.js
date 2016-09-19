App.controller ('PodsCtrl', ['$scope','APIService','UserDetailsService',function ($scope, API,UserDetailsService){

	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;

	var market = "us";

	$scope.podMarket = {};
	$scope.podMarkets = [
		{name: 'US Market', symbol: 'us', flag: 'us-flag.png'},
		{name: 'CA Market', symbol: 'ca', flag: 'ca-flag.png'},
		{name: 'UK Market', symbol: 'uk', flag: 'uk-flag.png'},
		{name: 'DE Market', symbol: 'de', flag: 'de-flag.png'},
		{name: 'HK Market', symbol: 'hk', flag: 'hk-flag.png'}
	];
	//assigning default value
	$scope.podMarket.selected = $scope.podMarkets[0];
}
]);