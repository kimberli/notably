angular.module('notablyApp').controller('splashController', function ($scope, $http) {

    $scope.loginForm = false;
    $scope.registerForm = false;

    $scope.showLoginForm = function () {
        $scope.loginForm = true;
    }

    $scope.showRegisterForm = function () {
        $scope.loginForm = true;
        $scope.registerForm = true;
    }

    $scope.login = function () {
        $http.post('/api/user/login', {
            'username': 'vfazel',
            'password': 'pass'
        }).then(function (response) {
            if (response.status !== 200) {
                console.log(response);
            }
        })
    }

});
