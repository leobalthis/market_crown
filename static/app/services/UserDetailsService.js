App.factory('UserDetailsService', ['APIService', '$q','$timeout', function (API, $q, $timeout) {
	var user = null;
	function getUser(){
		if(!user){
			API.getHttp('/personal/me').then(function(data){
				console.log('user!',data);
				user = data;
				API.getHttp('/personal/tagline/'+data.mc_username).then(function(data){
					//$timeout(function(){
						user.tagline = data.tagline;
						user.profession = data.profession;
						console.log('tagling',user);
					//},1)

				});
				return user;
			});

		}else{
			return user;
		}
	};
	return {
		getUser:getUser,
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
