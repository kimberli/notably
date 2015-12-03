angular.module('notablyApp', ['ngRoute', 'ngFitText','angularMoment','luegg.directives', 'angucomplete-alt', 'ngSanitize','btford.socket-io', 'cfp.hotkeys'])
.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

	MathJax.Hub.Config({
       extensions: ["tex2jax.js"],
       jax: ["input/TeX", "output/HTML-CSS"],
       tex2jax: {
         inlineMath: [ ['$','$'], ["\\(","\\)"] ],
         displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
         processEscapes: true
       },
       "HTML-CSS": { availableFonts: ["TeX"], linebreaks: { automatic: true } }
     });

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

.factory('sessionSocket', function (socketFactory) {
	var sessionSocket = socketFactory();

 	sessionSocket.forward('saved snippet');
	sessionSocket.forward('removed snippet');
	sessionSocket.forward('added snippet');
	sessionSocket.forward('flagged snippet');
	sessionSocket.forward('joined session');
	sessionSocket.forward('left session');
	sessionSocket.forward('new session');
	sessionSocket.forward('session data loaded');
	sessionSocket.forward('error');

  return sessionSocket;
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
