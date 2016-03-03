var currentUser = "jeangrey";

var App = angular.module('App', ['ngSanitize',
	'ui.bootstrap',
	'ui.router',
	'chart.js',
	'ui.date',
	'ui.select',
	'angularUtils.directives.dirPagination',
	'angular-loading-bar',
	'nvd3'
])

	.config(['$urlRouterProvider', '$stateProvider', '$httpProvider', function($urlRouterProvider, $stateProvider, $httpProvider) {
		$urlRouterProvider.otherwise('/stock-info');
		$stateProvider
			.state('stock-info', {
				url: '/stock-info',
				views: {
					'section': {
						controller: 'StockInfoWrapperCtrl',
						templateUrl: 'views/StockInfo.html'
					},
					'sidebar': {
						templateUrl: 'views/Sidebar.html'
					}
				}
			})
			.state('forecasts', {
				url: '/forecasts',
				views: {
					'section': {
						templateUrl: 'views/Forecasts.html'
					},
					'sidebar': {
						templateUrl: 'views/Sidebar.html'
					}
				}
			})
			.state('queries', {
				url: '/queries',
				views: {
					'section': {
						templateUrl: 'views/Queries.html'
					},
					'sidebar': {
						templateUrl: 'views/Sidebar.html'
					}
				}
			})
			.state('pods', {
				url: '/pods',
				templateUrl: 'views/Pods.html',
				views: {
					'section': {
						templateUrl: 'views/Pods.html'
					},
					'sidebar': {
						templateUrl: 'views/Sidebar.html'
					}
				}

			})

			.state('pods.stats', {
				url: '/stats',
				views: {
					'section': {
						templateUrl: 'views/Stats.html'
					},
					'sidebar': {
						templateUrl: 'views/UserSidebar.html'
					}
				}
			})

			.state('user', {
				url: '/user/:username',
				views: {
					'section': {
						templateUrl: 'views/User.html',
						controller: function($scope, $stateParams) {
							$scope.username = [];
							$scope.username.id = $stateParams.username;
							console.log("App: " + $scope.username.id);
							if ($scope.username.id != currentUser) {
								currentUser = $scope.username.id;
							}
						},
					}
				}
			});
	}]);
