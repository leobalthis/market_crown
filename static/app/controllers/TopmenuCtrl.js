App.controller ('TopmenuCtrl',['$scope', '$http', 'MicroblogsService', 'GeneralDataService', 'UserDetailsService', function ($scope, $http, MicroblogsService, GeneralDataService,UserDetailsService){
	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;
	console.log('currentUser',currentUsername);

}]);