angular.module('notablyApp').controller('splashController', function ($scope, $http, $location, $window) {

    $scope.focusLogin = true;

    $scope.loginForm = false;
    $scope.registerForm = false;

    $scope.username = "";
    $scope.password = "";
    $scope.email = "";
    $scope.name = "";

    $http.get('/api/user/auth', {})
    .then(function (response) {
        $location.path('/home');
    });

    $scope.showLoginForm = function () {
        $scope.focusLogin = true;
        $scope.loginForm = true;
        $scope.registerForm = false;
        $("body").animate({ scrollTop: $('body').prop("scrollHeight")}, 1000);
    }

    $scope.showRegisterForm = function () {
        $scope.focusLogin = false;
        $scope.loginForm = true;
        $scope.registerForm = true;
        $("body").animate({ scrollTop: $('body').prop("scrollHeight")}, 1000);
    }

    $scope.hideForms = function () {
        $scope.loginForm = false;
        $scope.registerForm = false;
    }

    $scope.send = function () {
        if ($scope.focusLogin) {
            $http.post('/api/user/login', {
                'username': $scope.username,
                'password': $scope.password
            }).then(function (response) {
                $window.location.href = '/home';
            }, function(response) {
                $scope.error = response.data.error;
            });
        } else {
            $http.post('/api/user/create', {
                'username': $scope.username,
                'password': $scope.password,
                'email': $scope.email,
                'name': $scope.name
            }).then(function (response) {
                $window.location.href = '/home';
            }, function(response) {
                $scope.error = response.data.error;
            });
        }
    }
});
