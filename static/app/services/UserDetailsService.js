App.factory('UserDetailsService', function ($http, $q) {
	return {
		getAtGlanceService: function(url) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
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

		getAtGlanceCurrentUserService: function(url) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			return $http.get(url, {
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

		getFollowersService: function(url) {
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

		getFollowingService: function(url) {
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

		getMyGroupsService: function(user) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: "https://marketcrown.com/api/v1/personal/group/find",

				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"owner": user
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
		},

		createGroupService: function(user, groupName, groupDescription, groupMembers) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: "https://marketcrown.com/api/v1/personal/group/create",

				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"owner": user,
					"name":groupName,
					"description":groupDescription,
					"members":groupMembers
				}
			};

			return $http(request)
			.then(function(response) {
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},

		addMemberToGroupService: function(members, groupId) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			console.log(members, groupId);
			var request = {
				method: 'POST',
				url: "https://marketcrown.com/api/v1/personal/group/adduser",

				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"guid": groupId,
					"member": members
				}
			};
			console.log(request);

			return $http(request)
				.then(function(response) {
					return response.data;

				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
		},

		removeMemberFromGroupService: function(member, groupId) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: "https://marketcrown.com/api/v1/personal/member/delete",

				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"guid": groupId,
					"member": member
				}
			};
			console.log(request);

			return $http(request)
					.then(function(response) {
						return response.data;

					}, function(response) {
						// something went wrong
						return $q.reject(response.data);
					});
		},


		deleteGroupService: function(groupId) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var request = {
				method: 'POST',
				url: " https://marketcrown.com/api/v1/personal/group/delete",

				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"guid": groupId
				}
			};
			console.log(request);

			return $http(request)
				.then(function(response) {
					return response.data;

				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
		}


	};
});
