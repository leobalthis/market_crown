App.controller ('ForecastsCtrl', function ($scope, $http){

	var today = Date.parse('today').toString('MM/dd/yy');
	var yesterday = Date.parse('yesterday').toString('MM/dd/yy');
	var lastMonday = Date.parse('last monday').toString('MM/dd/yy');
	var lastWeekMonday = Date.monday().addDays(-7).toString('MM/dd/yy');
	var lastWeekFriday = Date.friday().addDays(-7).toString('MM/dd/yy');
	var lastWeekSunday = Date.sunday().addDays(-7).toString('MM/dd/yy');

	var last7Days = Date.today().addDays(-7).toString('MM/dd/yy');
	var last14Days =  Date.today().addDays(-14).toString('MM/dd/yy');
	var last30Days =  Date.today().addDays(-30).toString('MM/dd/yy');
	var firstDayOfCurrentMonth = Date.today().moveToFirstDayOfMonth().toString('M/dd/yy');
	var firstDayOfLastMonth = Date.parse('- 1months').moveToFirstDayOfMonth().toString('MM/dd/yy');
	var lastDayOfLastMonth = Date.parse('- 1months').moveToLastDayOfMonth().toString('MM/dd/yy');
	var yearFromNow = Date.today().addYears(1).toString('MM/dd/yy');
	console.log("Years from now " + yearFromNow);

	var currentUser = "jeangrey";
	$scope.currentUser = currentUser;
	$scope.forecastDateStart = last7Days;
	$scope.forecastDateEnd = today;
	var forecastId;
	var clickedUser;
	var finalUserResult = $scope.resultsFollowing;
	var market = "us";
	var symbols = "all";
	var correct = "all";
	var movement = "all";
	var timeofday =  "all";
	var percentage = "all";
	var mcapcategory = "all";
	var sectors = "all";
	var dateStart = last7Days;
	var dateEnd = today;



	var groupsLoaded = false;
	$scope.showGroups = false;
	$scope.showCustom = false;



	//initial forecasts default call function
	$scope.getForecasts = function () {

		var request = {
			method: 'POST',
			url: 'https://marketcrown.com/api/v1/personal/masterquery/us/jeangrey',

			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				"user": "all",
				"symbol":"all",
				"movement":"all",
				"timeofday":"all",
				"percentage":"all",
				"mcapcategory":"all",
				"sector":"all",
				"correct": "pending",
				"startdate" :"09/15/15",
				"enddate": "01/17/25"
			}
		};


		$http(request)
			.success(function(data){
				console.log(data);
				$scope.forecastsData = data;
				console.log(dateStart);
			})

			.error(function(){
				console.log("initial forecast unsuccessfull")
			});
	};


	//forecast status selection
	$scope.forecastStatus = "pending";
	$scope.forecastStatusVisibility = "pending";

	//forecast market selection
	$scope.forecastMarket = {};
	$scope.forecastMarkets = [
		{name: 'US Market', symbol: 'us', flag: 'us-flag.png'},
		{name: 'CA Market', symbol: 'ca', flag: 'ca-flag.png'},
		{name: 'UK Market', symbol: 'uk', flag: 'uk-flag.png'},
		{name: 'DE Market', symbol: 'de', flag: 'de-flag.png'},
		{name: 'HK Market', symbol: 'hk', flag: 'hk-flag.png'}
	];
	//assigning default value
	$scope.forecastMarket.selected = $scope.forecastMarkets[0];

	$scope.changeMarket = function() {
		market = $scope.forecastMarket.selected.symbol;
		$scope.liveSearchSymbol();
		console.log(market);
	};

	//users selection
	$scope.forecastUserResult = {};
	$scope.forecastUserResults = [
		{name: 'All', call: 'all'},
		{name: 'Users I follow', call: 'following'},
		{name: 'Only me', call: 'me'},
		{name: 'Users from a group', call: 'usersGroup'},
		{name: 'Pods I am subscribed to', call: 'podsSubscribedTo'},
		{name: 'Custom', call: 'custom'}
	];

	//assigning default value
	$scope.forecastUserResult.selected = $scope.forecastUserResults[0];

	//if requires get that gets this
	$scope.getUserResultsFollowing = function(apiCallLink) {
		$http.get(apiCallLink)
			.success(function (data) {
				$scope.resultsFollowing = data;
				finalUserResult = $scope.resultsFollowing;
				console.log("Successfull get user results call");
			})

			.error (function(){
			console.log("Get Call Error");
		});
	};

	$scope.getUserResultsFollowing("https://marketcrown.com/api/v1/personal/imfollowing/list/jeangrey");

	//initialized user group
	$scope.forecastUserGroupResult = {};

	$scope.getUserResultsGroups = function(apiCallLink) {
		var request = {
			method: 'POST',
			url: apiCallLink,

			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				"owner": "jeangrey"
			}
		};

		$http(request)
			.success(function(data){
				console.log(data);
				$scope.forecastUserGroupsResults = data;
				$scope.forecastUserGroupResult.selected = $scope.forecastUserGroupsResults[0];
				finalUserResult = $scope.forecastUserGroupResult.selected.members;
				groupsLoaded = true;
			})

			.error(function(){
				alert("getUserResultsPost Unsuccessfull");
			});
	};

	$scope.getSelectedGroup = function() {
		finalUserResult = $scope.forecastUserGroupResult.selected.members;
		console.log(" $scope.getSelectedGroup() selected: " + finalUserResult);
	};

	$scope.getUserResultsPods = function(apiCallLink) {
		var request = {
			method: 'POST',
			url: apiCallLink,

			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				"user": "jeangrey",
				"symbol":"all",
				"movement":"all",
				"timeofday":"all",
				"percentage":"all",
				"mcapcategory":"all",
				"sector":"all",
				"correct":"pending",
				"startdate" :"10/13/14",
				"enddate": "12/30/37"
			}
		};


		$http(request)
			.success(function(data){
				console.log(data);
				$scope.userResultsPods = data;
				finalUserResult = $scope.userResultsPods;
			})

			.error(function(){
				alert("getUserResultsPost Unsuccessfull");
			});
	};
	//$scope.getUserResultsPods("http://204.12.206.202:1935/group/find");

	//returning at a glance section data. Called on initial load
	$scope.getAtGlance = function () {
		$http.get("https://marketcrown.com/api/v1/personal/profile/" + market + "/" + clickedUser, {
			ignoreLoadingBar: true
		})
			.success(function (data) {
				$scope.atGlanceData = data;
				console.log("user info got");
			})

			.error (function(){
			console.log("Live search API error");
		});
	};

	$scope.getUsers = function() {
		$http.get("https://marketcrown.com/api/v1/personal/profile/" + market + "/" + clickedUser)
			.success(function (data) {
				$scope.atGlanceData = data;
				console.log("user info got");
			})

			.error (function(){
			console.log("Live search API error");
		});
	};

	$scope.getForecasts();

	$scope.onSelect = function (){
		console.log($scope.forecastUserResult.selected.name);
		if ($scope.forecastUserResult.selected.call == "all") {
			$scope.resetInputs();
			finalUserResult = "all";
			$scope.showGroups = false;
			$scope.showCustom = false;
			console.log(finalUserResult);
		}

		else if ($scope.forecastUserResult.selected.call == "following") {
			$scope.resetInputs();
			finalUserResult = $scope.resultsFollowing;
			$scope.showGroups = false;
			$scope.showCustom = false;
			console.log(finalUserResult);
		}

		else if ($scope.forecastUserResult.selected.call == "me") {
			$scope.resetInputs();
			finalUserResult = "jeangrey";
			$scope.showGroups = false;
			$scope.showCustom = false;
			console.log(finalUserResult);
		}

		else if ($scope.forecastUserResult.selected.call == "usersGroup") {
			$scope.resetInputs();
			$scope.getUserResultsGroups("https://marketcrown.com/api/v1/personal/group/find");
			//once the groups are loaded
			if (groupsLoaded) {
				finalUserResult = $scope.forecastUserGroupResult.selected.members;
				console.log("loaded");
			}

			else {
				console.log("not loaded");
			}
			$scope.showGroups = true;
			$scope.showCustom = false;
			console.log("user groups print " + finalUserResult);
		}


		else if ($scope.forecastUserResult.selected.call == "podsSubscribedTo") {
			$scope.resetInputs();
			$scope.showGroups = false;
			$scope.showCustom = false;
			console.log(finalUserResult);
		}


		else if ($scope.forecastUserResult.selected.call == "custom") {
			$scope.liveSearchSymbol();

			$scope.showGroups = false;
			$scope.showCustom = true;
			console.log("Custom selected");
		}
	};

	$scope.getUpdatedForecasts = function () {

		market = $scope.forecastMarket.selected.symbol;
		var postCallLink;
		correct = $scope.forecastStatus;

		//checking the correct api link
		if ($scope.forecastUserResult.selected.call == "podsSubscribedTo") {
			postCallLink = "https://marketcrown.com/api/v1/personal/pod/subscriptions/" + market + "/sonic";//current user will be here
			finalUserResult = "all";
		}

		else {
			postCallLink = 'https://marketcrown.com/api/v1/personal/masterquery/' + market + '/jeangrey'; //current user will be here
		}

		//assigning a default date range if not custom
		if (correct == "pending") {
			dateEnd = yearFromNow;
		}
		else {
			dateEnd = today;
		}

		//checking the correct ng-model values
		if ($scope.forecastUserResult.selected.call == "custom") {
			$scope.callCustomData();
		}



		var request = {
			method: 'POST',
			url: postCallLink,

			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				"user": finalUserResult,
				"symbol": symbols,
				"movement": movement,
				"timeofday":timeofday,
				"percentage":percentage,
				"mcapcategory":mcapcategory,
				"sector": sectors,
				"correct": correct,
				"startdate" : dateStart,
				"enddate": dateEnd
			}
		};


		$http(request)
			.success(function(data){
				console.log(data);
				$scope.forecastsData = data;
				//used for displaying different elements on different status
				$scope.forecastStatusVisibility = $scope.forecastStatus;
				console.log("user: " + finalUserResult + " | symbol: " + symbols + " | movements: " + movement + " | timeofday: " + timeofday + " | percentage: " + percentage + " | market cap: " + mcapcategory + " | sector: " + sectors + " | correct: " + correct + " | start date: " + dateStart + " | end date: " +  dateEnd);
			})

			.error(function(){
				alert("Forecast Unsuccessfull");
				console.log("user: " + finalUserResult + " |symbol: " + symbols + " |movements: " + movement + " |timeofday: " + timeofday + " |percentage: " + percentage + " |market cap: " + mcapcategory + " |sector: " + sectors + " |correct: " + correct + " |start date: " + dateStart + " |end date: " +  dateEnd);
			});
	};

	//controlling clicked items
	$scope.getClickedObject = function(clickedForecast) {
		$scope.selectedItem = clickedForecast;
		clickedUser = $scope.selectedItem.user;
		$scope.getAtGlance();
		$scope.getUserFollowingInfo(0);
		$scope.getAnalysis();
	};
	$scope.getAnalysis = function () {
		$http.get("https://marketcrown.com/api/v1/personal/find/analysis/" + $scope.selectedItem.guid, {
			ignoreLoadingBar: true
		})
				.success(function (data) {
					$scope.forecastAnalysis = data;
					console.log($scope.forecastAnalysis);
					if ($scope.forecastAnalysis.length <= 0) {
						console.log("Equals 0");
						$scope.analysisOutput = false;
					}

					else {
						console.log("Not zero");
						$scope.analysisOutput = true;
					}
				})

				.error (function(){
					console.log("Analysis error");
				});
	};

	$scope.cleanAnalysis = function () {
		$scope.forecastAnalysis = "";
		console.log("Cleaned!!");
	};


	$scope.getUserFollowingInfo = function () {
		$http.get("https://marketcrown.com/api/v1/personal/ifollow/" + currentUser + "/" + clickedUser, {
			ignoreLoadingBar: true
		})
			.success(function (data) {
				$scope.followingData = data;
				if ($scope.followingData == "yes") {
					$scope.followButton = "Unfollow";
				}

				else {
					$scope.followButton = "Follow";
				}
			})

			.error (function(){
			console.log("Not following");
		});
	};
	$scope.deleteClickedObject = function(clickedForecast) {
		$scope.selectedItemForDelete = clickedForecast;
		forecastId = $scope.selectedItemForDelete.guid;
		$http.get("https://marketcrown.com/api/v1/personal/delete/" + currentUser + "/" + forecastId)
			.success(function () {
				alert("Forecast for " + $scope.selectedItemForDelete.company + " Successfully deleted");
				$scope.getUpdatedForecasts();
			})

			.error (function(){
			console.log("Live search API error");
		});

	};
	$scope.followUser = function () {
		var followUnfollowLink;

		if ($scope.followingData == "no") {
			followUnfollowLink = "https://marketcrown.com/api/v1/personal/follow/add";
			$scope.followButton = "Unfollow";
		}

		else {
			followUnfollowLink = "https://marketcrown.com/api/v1/personal/follow/remove";
			$scope.followButton = "Follow";
		}

		var request = {
			method: 'POST',
			url: followUnfollowLink,

			headers: {
				'Content-Type': 'application/json'
			},

			data: {
				"user": currentUser,
				"member": clickedUser
			}
		};

		$http(request)
			.success(function(data){
				console.log(data);
			})

			.error(function(){
				alert("Follow error");
			});

	};

	//custom query
	$scope.liveSearchSymbol = function() {
		$http.get("https://marketcrown.com/api/v1/personal/getsymbols/" + market)
			.success(function (data) {
				$scope.selected = undefined;
				$scope.symbols = data;
				console.log(market);
				console.log($scope.symbols);
			})

			.error (function(){
			console.log("Live search symbol API error");
		});
	};


	$scope.multiselect = {};

	$scope.users = [
	  "jeangrey",
	  "sonic",
	  "godzilla",
	  "onslaught",
	  "rony",
	  "agustus",
	  "kaushik",
	  "gordongekko",
	  "superman",
	  "test",
	  "ccline",
	  "spiderman",
	  "tmcpeak",
	  "shahdhruvin",
	  "jimcramer",
	  "glen",
	  "vputin",
	  "stocklord"
	];

	$scope.sectors = ["utilities","services","industrial goods","consumer goods","conglomerates","financial","healthcare","basic materials","technology"];

	$scope.marketCaps = ["mega","large","mid","small","micro","nano"];

	$scope.timeOfDays = ["morning","midday","close"];

	$scope.stocks = ["stock one", "stock two", "stock three" ];

	$scope.outcomes = [true, false];

	$scope.movements = ["up","down"];

	$scope.percentages = [".2-.9%","1-5%","6-15%","16-30%","31+%"];


	$scope.callCustomData = function () {
		////callback if value is not set, otherwise use the value

		if ($scope.multiselect.users == undefined || $scope.multiselect.users == 0) {
			finalUserResult = "all";
			console.log(finalUserResult);
		}

		else {
			finalUserResult = $scope.multiselect.users;
			console.log(finalUserResult);
		}

		if ($scope.multiselect.symbols == undefined || $scope.multiselect.symbols == 0) {
			symbols = "all";
			console.log(symbols);
		}

		else {
			symbols = $scope.multiselect.symbols;
		}


		if ($scope.multiselect.sectors == undefined || $scope.multiselect.sectors == 0) {
			sectors = "all";
			console.log(sectors);
		}

		else {
			sectors = $scope.multiselect.sectors;
			console.log(sectors);
		}

		if ($scope.multiselect.timeOfDays == undefined || $scope.multiselect.timeOfDays == 0) {
			timeofday = "all";
			console.log(timeofday);
		}

		else {
			timeofday = $scope.multiselect.timeOfDays;
			console.log(timeofday);
		}

		if ($scope.multiselect.marketCaps == undefined || $scope.multiselect.marketCaps == 0) {
			mcapcategory = "all";
			console.log(mcapcategory);
		}

		else {
			mcapcategory = $scope.multiselect.marketCaps;
			console.log(mcapcategory);
		}

		if ($scope.multiselect.movements == undefined || $scope.multiselect.movements == 0) {
			movement = "all";
		}

		else {
			movement = $scope.multiselect.movements;
		}

		if ($scope.multiselect.percentages == undefined || $scope.multiselect.percentages == 0) {
			percentage = "all";
		}

		else {
			percentage = $scope.multiselect.percentages;
		}


		if ($scope.forecastDateStart == last7Days) {
			dateStart = last7Days;
			console.log(dateStart);
		}

		else {
			dateStart = $scope.forecastDateStart;
			console.log(dateStart);
		}


		if ($scope.forecastDateEnd == today) {
			dateEnd = today;
			console.log(dateEnd);
		}

		else {
			dateEnd = $scope.forecastDateEnd;
		}


		if ($scope.forecastStatus == "pending") {
			correct = "pending";
		}

		else if ($scope.forecastStatus == "validated") {

			if ($scope.multiselect.outcomes == undefined || $scope.multiselect.outcomes == 0) {
				correct = "validated";
			}

			else {
				correct = $scope.multiselect.outcomes;
			}
		}

		else {
			correct = $scope.forecastStatus;
		}
	};

	$scope.resetInputs = function () {
		symbols = "all";
		timeofday =  "all";
		percentage = "all";
		mcapcategory = "all";
		sectors = "all";
		correct = $scope.forecastStatus;
		dateStart = "04/04/14";
		dateEnd = "04/04/25";

		console.log("Fields Resetted");
	}

	$scope.roundNumbers = function (item) {
		return item.toFixed(2);
	};

	$scope.assignBodyText = function (item) {
		if (item < 0) {
			return "actually dropped "
		}

		else if (item > 0) {
			return "increased "
		}
	};


});