angular.module('notablyApp', ['ngRoute', 'ngFitText']).config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		// routing definitions
	    $routeProvider
		.when('/', {
			templateUrl: '/views/splash.html',
			controller: 'splashController'
		})
		.when('/home', {
			templateUrl: '/views/home.html',
			controller: 'homeController'
		})
		.when('/profile/:username', {
			templateUrl: '/views/profile.html',
			controller: 'profileController'
		})
		.when('/course/:courseNumber', {
			templateUrl: '/views/course.html',
			controller: 'courseController'
		})
		.when('/session/:sessionId', {
			templateUrl: '/views/session.html',
			controller: 'sessionController'
		})
		.otherwise({
	        redirectTo: '/'
	    });
	    // remove # from URL
	    $locationProvider.html5Mode({
	        enabled: true,
	        requireBase: false
		});

	}
])
