App.factory('GeneralDataService', function ($http, $q) {
	return {
		getAllUsersService: function(url) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			return $http.get(url, {
					ignoreLoadingBar: true,
					cache: true
				})
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;


					} else {
						// invalid response
						return $q.reject(response.data);
					}

				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
		},

		getSymbols: function(market) {
			return $http.get("https://marketcrown.com/api/v1/personal/getsymbols/" + market, {
					ignoreLoadingBar: true
				})
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;
					} else {
						// invalid response
						return $q.reject(response.data);
					}

				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
		},

		createForecastService: function(user, symbol, movement, date, timeOfDay, percent, market, analysis) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var regExp = /\(([^)]+)\)/;
			var stockSymbolFormatted;

			var symbolObjStr = JSON.stringify(symbol);
			var symbolObjLength = symbolObjStr.length;

			if (symbolObjLength >= 15) {
				var formattedSymbol = regExp.exec(symbol);
				stockSymbolFormatted = formattedSymbol[1];

				if (market === "ca") {
					stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
				}

				else if (market === "uk"){
					stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-2);
				}


				else if (market === "de"){
					stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
				}


				else if (market === "hk"){
					stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
				}
			}

			else {
				stockSymbolFormatted = symbol;
			}

			var request = {
				method: 'POST',
				url: 'https://marketcrown.com/api/v1/personal/createforecast',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"user": user,
					"symbol": stockSymbolFormatted,
					"movement": movement,
					"date" : date,
					"timeofday" : timeOfDay,
					"percent": percent,
					"market": market,
					"analysis": analysis
				}
			};
			return $http(request)
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;

					} else {
						// invalid response
						return $q.reject(response.data);
					}

				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
		}
	};
});
