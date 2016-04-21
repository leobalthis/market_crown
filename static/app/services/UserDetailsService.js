App.factory('UserDetailsService', ['APIService', function (API) {
	return {
		getAtGlanceService: API.getHttp,

		getAtGlanceCurrentUserService: function (url) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			return API.getHttp(url, {
				ignoreLoadingBar: true
			})
		},

		getFollowersService: API.getHttp,

		getFollowingService: API.getHttp,

		getMyGroupsService: function (user) {
			return API.postHttp("/personal/group/find",
				{
					"owner": user
				})
		},

		createGroupService: function (user, groupName, groupDescription, groupMembers) {
			return API.postHttp("/personal/group/create",
				{
					"owner": user,
					"name": groupName,
					"description": groupDescription,
					"members": groupMembers
				})
		},


		addMemberToGroupService: function (members, groupId) {
			return API.postHttp("/personal/group/adduser",
				{
					"guid": groupId,
					"member": members
				})
		},

		removeMemberFromGroupService: function (member, groupId) {
			return API.postHttp("/personal/member/delete",
				{
					"guid": groupId,
					"member": member
				})
		},


		deleteGroupService: function (groupId) {
			return API.postHttp("/personal/group/delete",
				{
					"guid": groupId
				})
		}
	}
}]);
