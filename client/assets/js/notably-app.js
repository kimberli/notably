angular.module('notablyApp', ['ngRoute', 'ngFitText','angularMoment','luegg.directives']).config(['$routeProvider', '$locationProvider',
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

.directive('navBar', function() {
	return {
		restrict: 'E',
		templateUrl: '/views/navbar.html',
        controller: 'navController'
	};
})

.run( function($rootScope, $location, $http) {
    $rootScope.$on( '$routeChangeStart', function(event, next, current) {
        $http.get('/api/user/auth', {})
        .then(function (response) {
            $rootScope.user = response.data.username;
        }, function(response) {
            if (next.templateUrl !== '/views/splash.html') {
                $location.path('/');
            }
        });
    });
});
