 /**
  * @controller
  * @member of module app.js
  * @desc Main routing, run and configuration
  * @Modified  By: Venki
  */
var app = angular.module('serverManageApp', ['ui.router','ngCookies','ui.bootstrap']);

app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider',function($httpProvider, $stateProvider, $urlRouterProvider){
	
	
	/*@desc Define the states*/
	$stateProvider
 	.state('main', {
		url: "/main",
		cache: false,		
		templateUrl: "templates/main.html",
		controller: 'mainController'
	})	
	
 $urlRouterProvider.otherwise('/login');
}]);

app.run(['$rootScope','$location','$cookieStore','$http',
		function($rootScope,$location,$cookieStore,$http){	
		$location.path('/main');
				
}]);