App.factory('MicroblogsService', function ($http, $q) {
	return {
		createTopic: function(user, message, market) {
			var request = {
				method: 'POST',
				url: 'https://marketcrown.com/api/v1/personal/feed/entry',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"theme_type" : "topic",
					"user" : user,
					"message": message,
					"image": null,
					"avatar": null,
					"market": market
				}
			};

			return $http(request)
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;

					} else {
						// invalid response
						console.log("Reply recieved string", request);
					}

				}, function(response) {
					// something went wrong
					console.log("request", request);
					return $q.reject(response.data);
				});
		},

		getDefaultMicroblogsService: function(user, market, query_type) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: 'https://marketcrown.com/api/v1/personal/feed/query',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"user" : user,
					"market" : market,
					"query_type" : query_type
				}
			};

			return $http(request)
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;

					} else {
						// invalid response
						console.log("Reply recieved string", request);
					}

				}, function(response) {
					// something went wrong
					console.log("request", request);
					return $q.reject(response.data);
				});
		},

		getSymbolsMicroblogsService: function(user, market, symbols) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: 'https://marketcrown.com/api/v1/personal/feed/query',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"user" : user,
					"market" : market,
					"query_type" : "symbols",
					"symbols": symbols
				}
			};

			return $http(request)
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;

					} else {
						// invalid response
						console.log("Reply received string", request);
					}

				}, function(response) {
					// something went wrong
					console.log("request", request);
					return $q.reject(response.data);
				});
		},

		getSectorsMicroblogsService: function(user, market, sectors) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: 'https://marketcrown.com/api/v1/personal/feed/query',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"user" : user,
					"market" : market,
					"query_type" : "sectors",
					"sectors": sectors
				}
			};

			return $http(request)
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;

					} else {
						// invalid response
						console.log("Reply received string", request);
					}

				}, function(response) {
					// something went wrong
					console.log("request", request);
					return $q.reject(response.data);
				});
		},

		getOnlyMeMicroblogsService: function(user, market) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: 'https://marketcrown.com/api/v1/personal/feed/query',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"user" : user,
					"market" : market,
					"query_type" : "onlyme"
				}
			};

			return $http(request)
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;

					} else {
						// invalid response
						console.log("Reply received string", request);
					}

				}, function(response) {
					// something went wrong
					console.log("request", request);
					return $q.reject(response.data);
				});
		},

		getRepliesService: function(user, market, theme_id) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: 'https://marketcrown.com/api/v1/personal/feed/query',
				ignoreLoadingBar: true,
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"user" : user,
					"market" : market,
					"query_type" : "response",
					"theme_id" : theme_id
				}
			};

			return $http(request)
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;

					} else {
						// invalid response
						console.log("Reply recieved string", request);
					}

				}, function(response) {
					// something went wrong
					console.log("request", request);
					return $q.reject(response.data);
				});
		},

		sendReplyService: function(user, theme_id, replyData) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: 'https://marketcrown.com/api/v1/personal/feed/reply',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"theme_type" :"reply",
					"theme_id" : theme_id,
					"user" : user,
					"reply": replyData,
					"image":null,
					"avatar":null
				}
			};

			return $http(request)
				.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;

					} else {
						// invalid response
						console.log("Reply recieved string", request);
					}

				}, function(response) {
					// something went wrong
					console.log("request", request);
					return $q.reject(response.data);
				});
		}
	};
});
