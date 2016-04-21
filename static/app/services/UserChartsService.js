App.factory('UserChartsService', function ($http, $q) {
	return {
		getSectorPreferenceChartService: function(url){
			return $http.get(url)
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

		getMarketCapPreferenceService: function(url){
			return $http.get(url)
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

		getTotalCorrectService: function(url) {
			return $http.get(url)
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

		getForecastSentimentService: function(url) {
			return $http.get(url)
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
		getForecastPendingSentimentService: function(url) {
			return $http.get(url)
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

		getTimeOfDayPreferenceService: function(url) {
			return $http.get(url)
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
