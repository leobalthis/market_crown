App.controller ('CreateForecastCtrl', function StockInfoCtrl ($scope, $http){

	$scope.dateOptions = {
		changeYear: true,
		changeMonth: true,
		yearRange: '1900:-0'
	};

	$scope.marketData = {
		selectMarket: null,
		option1: "us",
		option2: "ca",
		option3: "uk",
		option4: "de",
		option5: "hk"
	};


	$scope.$watch('data.selectMarket', function(newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.liveSearchSymbol("http://204.12.206.202:1935/getsymbols/" + $scope.data.selectMarket);
			$scope.stockSymbol = "";
		}
	});

	$scope.marketMovement = {
		selectMarketMovement: null,
		option1: "up",
		option2: "down"
	};

	$scope.dayTime = {
		selectDayTime: null,
		option1: "morning",
		option2: "midday",
		option3: "close"
	};


	$scope.marketMovementPercentage = {
		selectMarketMovementPercentage: null,
		option1: ".2-.9%",
		option2: "1-5%",
		option3: "6-15%",
		option4: "16-30%",
		option5: "31+%"
	};


	$scope.createForecast = function () {
		var regExp = /\(([^)]+)\)/;
		var stockSymbolFormatted;

		var symbolObjStr = JSON.stringify($scope.stockSymbol);
		var symbolObjLength = symbolObjStr.length;

		if (symbolObjLength >= 15) {
			var formattedSymbol = regExp.exec($scope.stockSymbol);
			stockSymbolFormatted = formattedSymbol[1];

			if ($scope.data.selectMarket === "ca") {
				stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
			}

			else if ($scope.data.selectMarket === "uk"){
				stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-2);
			}


			else if ($scope.data.selectMarket === "de"){
				stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
			}


			else if ($scope.data.selectMarket === "hk"){
				stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
			}
		}

		else {
			stockSymbolFormatted = $scope.stockSymbol;
		}




		var request = {
			method: 'POST',
			url: 'http://204.12.206.202:1220/createforecast',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				"user": "jcramer",
				"symbol": stockSymbolFormatted,
				"movement": $scope.data.selectMarketMovement,
				"date" : $scope.forecastDate,
				"timeofday" : $scope.data.selectDayTime,
				"percent": $scope.data.selectMarketMovementPercentage,
				"market": $scope.data.selectMarket,
				"analysis": $scope.forecastAnalysis
			}
		};


		$http(request)
			.success(function(data){
				console.log("Successfull");
				console.log(data);

				$scope.stockSymbol = "";
				$scope.data.selectMarketMovement = null;
				$scope.forecastDate = null;
				$scope.data.selectDayTime = null;
				$scope.data.selectMarketMovementPercentage = null;
				alert("Forecast successfully created");
			})
			.error(function(){
				console.log("Unsuccesfull");
				alert("Forecast creation unsuccessful. Please make sure the fields are entered correctly ");
			});
	};

	$scope.liveSearchSymbol = function(apiUrl) {
		$http.get(apiUrl)
			.success(function (data) {
				ignoreLoadingBar: true;
				$scope.selected = undefined;
				$scope.symbols = data;


			})

			.error (function(){
			console.log("Live search API error");
		});
	};

});
