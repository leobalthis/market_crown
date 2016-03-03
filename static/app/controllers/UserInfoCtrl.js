App.controller ('UserInfoCtrl', function StockInfoCtrl ($scope, $http){

	var stock_info_market = "us";   	//default market value
	var stock_info_symbol = "googl";	//default symbol values

	//default get call
	var stock_info_full_link = "default info call";
	console.log("Default get call " + stock_info_full_link);



	//getData function. Calling default data
	$scope.getData = function(request_link, type) {
		$scope.$emit('loadProfileInfo');
		$http.get(request_link)
			.success(function (data) {
				$scope.chartData = data;
				console.log("Successful GET call " + stock_info_full_link);

				if (type === "sector_preference") {

					//calculate percentage
					var totalSectorPreference = $scope.chartData.healthcare + $scope.chartData.financial + 10 + $scope.chartData.services + 20 + $scope.chartData.conglomerates + 45 + $scope.chartData.technology + $scope.chartData.utilities;
					var healthcarePercent = $scope.chartData.healthcare * 100 / totalSectorPreference;
					var financialPercent = $scope.chartData.financial * 100 / totalSectorPreference;
					var industrialGoodsPercent = 10 * 100 / totalSectorPreference;
					var servicesPercent = $scope.chartData.services * 100 / totalSectorPreference;
					var consumerGoodsPercent = 25 * 100 / totalSectorPreference;
					var conglomeratesPercent = $scope.chartData.conglomerates * 100 / totalSectorPreference;
					var basicMaterialsPercent = 45 * 100 / totalSectorPreference;
					var technologyPercent = $scope.chartData.technology * 100 / totalSectorPreference;
					var utilitiesPercent = $scope.chartData.utilities * 100 / totalSectorPreference;

					$scope.sectorPreferenceData = [healthcarePercent.toFixed(1)  , financialPercent.toFixed(1), industrialGoodsPercent.toFixed(1) ,  servicesPercent.toFixed(1), consumerGoodsPercent.toFixed(1), conglomeratesPercent.toFixed(1), basicMaterialsPercent.toFixed(1), technologyPercent.toFixed(1), utilitiesPercent.toFixed(1) ];
				}

				else if (type === "correct_incorrect") {
					var totalCorrectIncorrect = $scope.chartData.true + $scope.chartData.false;
					var truePercent = $scope.chartData.true * 100 / totalCorrectIncorrect;
					var falsePercent = $scope.chartData.false * 100 / totalCorrectIncorrect;

					$scope.correctData = [truePercent.toFixed(1), falsePercent.toFixed(1)];
				}


				else if (type == "forecast_sentiment") {
					var totalForecastSentiment = $scope.chartData.bearish + $scope.chartData.bullish;
					var bearishPercent = $scope.chartData.bearish * 100 / totalForecastSentiment;
					var bullishPercent = $scope.chartData.bullish * 100 / totalForecastSentiment;

					$scope.forecastSentimentData = [bearishPercent.toFixed(1), bullishPercent.toFixed(1)];
				}

				else if (type == "market_cap_preference") {
					var totalMarketCapPreference = $scope.chartData.mega + $scope.chartData.nano + $scope.chartData.mid + $scope.chartData.large + $scope.chartData.micro + $scope.chartData.small;
					var megaPercentage = $scope.chartData.mega * 100 / totalMarketCapPreference;
					var nanoPercentage = $scope.chartData.nano * 100 / totalMarketCapPreference;
					var midPercentage = $scope.chartData.mid * 100 / totalMarketCapPreference;
					var largePercentage = $scope.chartData.large * 100 / totalMarketCapPreference;
					var microPercentage = $scope.chartData.micro * 100 / totalMarketCapPreference;
					var smallPercentage = $scope.chartData.small * 100 / totalMarketCapPreference;
					$scope.marketCapPreferenceData = [megaPercentage.toFixed(1), nanoPercentage.toFixed(1), midPercentage.toFixed(1), largePercentage.toFixed(1), microPercentage.toFixed(1), smallPercentage.toFixed(1)];
				}


				else if (type == "time_of_the_day_preference") {
					var totalTimeOfTheDayPreference = $scope.chartData.close + $scope.chartData.midday + $scope.chartData.morning;
					var closePercentage = $scope.chartData.close * 100 / totalTimeOfTheDayPreference;
					var middayPercentage = $scope.chartData.midday * 100 / totalTimeOfTheDayPreference;
					var morningPercentage = $scope.chartData.morning * 100 / totalTimeOfTheDayPreference;

					$scope.timeOfTheDayPreferenceData = [closePercentage.toFixed(1), middayPercentage.toFixed(1), morningPercentage.toFixed(1)];
				}

				$scope.$emit('unloadProfileInfo')
			})


			.error (function(){
			console.log("Get Call Error");
			$scope.$emit('UNLOAD');
		});
	};


	$scope.getSectorPreference = function() {
		$scope.sectorPreferenceLabel = ["Healthcare", "Financial", "Industrial Goods", "Services", "Consumer Goods", "Conglomerates", "Basic Materials", "Technology", "Utilities"];
		console.log("Called First");
		$scope.getData("http://204.12.206.202:2197/sector/jeangrey/" + stock_info_market, "sector_preference");
	};


	$scope.getCorrect = function() {
		$scope.correctLabel = ["Correct", "Incorrect"];
		console.log("Called Second");
		$scope.getData("http://204.12.206.202:2197/correctperformance/jeangrey/" + stock_info_market + "/02-05-14until09-21-22", "correct_incorrect");
	};

	$scope.getForecastSentiment = function() {
		$scope.forecastSentimentLabel = ["Bearish", "Bullish"];
		console.log("Called Third");
		$scope.getData("http://204.12.206.202:2197/sentiment/jeangrey/" + stock_info_market + "/01-02-14until01-02-22", "forecast_sentiment");
	};

	$scope.getMarketCapPreference = function() {
		$scope.marketCapPreferenceLabel = ["Mega", "Nano", "Mid", "Large", "Micro", "Small"];
		console.log("Called Fourth");
		$scope.getData("http://204.12.206.202:2197/marketcap/jeangrey/" + stock_info_market + "/01-02-14until01-02-22", "market_cap_preference");
	};

	$scope.getTimeOfTheDayPreference = function() {
		$scope.timeOfTheDayPreferenceLabel = ["Close", "Midday", "Morning"];
		console.log("Called Fifth");
		$scope.getData("http://204.12.206.202:2197/timeofday/jeangrey/" + stock_info_market + "/01-02-14until01-02-22", "time_of_the_day_preference");
	};


	//returning at a glance section data
	$scope.getAtGlance = function () {
		$http.get("http://204.12.206.202:2197/profile/" + stock_info_market + "/jeangrey")
			.success(function (data) {
				$scope.atGlanceData = data;
			})

			.error (function(){
			console.log("Live search API error");
		});
	};


	$scope.$watch('userInfoMarketSelected', function(newValue, oldValue) {
		if (newValue !== oldValue) {
			if ($scope.userInfoMarketSelected == $scope.userInfoMarket [0]) {
				stock_info_market = "us";
			}

			else if ($scope.userInfoMarketSelected == $scope.userInfoMarket [1]) {
				stock_info_market = "ca";
			}

			else if ($scope.userInfoMarketSelected == $scope.userInfoMarket [2]) {
				stock_info_market = "uk";
			}

			else if ($scope.userInfoMarketSelected == $scope.userInfoMarket [3]) {
				stock_info_market = "de";
			}

			else if ($scope.userInfoMarketSelected == $scope.userInfoMarket [4]) {
				stock_info_market = "hk";
			}
		}

		$scope.getAtGlance();
		$scope.getSectorPreference();
		$scope.getCorrect();
		$scope.getForecastSentiment();
		$scope.getMarketCapPreference();
		$scope.getTimeOfTheDayPreference();
	});

	$scope.updateUserInfoMarket = function() {

		$scope.userInfoMarket = [
			{name: "US Market", link: "us"},
			{name: "CA Market", link: "ca"},
			{name: "UK Market", link: "uk"},
			{name: "DE Market", link: "de"},
			{name: "HK Market", link: "hk"}
		];

		$scope.userInfoMarketSelected = $scope.userInfoMarket [0];

	};



	$scope.getAllData = function() {
		//calling profile info functions
		$scope.getAtGlance();
		$scope.getSectorPreference();
		$scope.getCorrect();
		$scope.getForecastSentiment();
		$scope.getMarketCapPreference();
		$scope.getTimeOfTheDayPreference();
	}

	$scope.updateUserInfoMarket();
	$scope.getAllData();

});