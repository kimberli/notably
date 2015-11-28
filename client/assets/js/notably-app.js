angular.module('notablyApp', ['ngRoute', 'ngFitText','angularMoment','luegg.directives', 'angucomplete-alt', 'ngSanitize','btford.socket-io'])
.config(['$routeProvider', '$locationProvider',
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
		.when('/stash/:stashId', {
			templateUrl: '/views/stash.html',
			controller: 'stashController'
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

.factory('socketInstance', function (socketFactory) {
	var socketInstance = socketFactory();
 	socketInstance.forward('saved snippet');
	socketInstance.forward('removed snippet');
	socketInstance.forward('added snippet');
  return socketInstance;
})


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
