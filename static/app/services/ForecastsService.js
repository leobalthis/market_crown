App.factory('ForecastService', function ($http, $q) {
	return {
		getSimpleForecastsService: function(market, user, status) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: "https://marketcrown.com/api/v1/personal/masterquery/"+ market + "/" + user,

				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"user": user,
					"symbol":"all",
					"movement":"all",
					"timeofday":"all",
					"percentage":"all",
					"mcapcategory":"all",
					"sector":"all",
					"correct": status,
					"startdate" :"09/15/15",
					"enddate": "01/17/25"
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
