angular.module('notablyApp').controller('splashController', function ($scope, $http) {

    $scope.focusLogin = true;

    $scope.loginForm = false;
    $scope.registerForm = false;

    $scope.username = "";
    $scope.password = "";
    $scope.email = "";
    $scope.name = "";

    $scope.showLoginForm = function () {
        $scope.focusLogin = true;
        $scope.loginForm = true;
    }

    $scope.showRegisterForm = function () {
        $scope.focusLogin = false;
        $scope.loginForm = true;
        $scope.registerForm = true;
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
                if (response.status !== 200) {
                    console.log(response);
                }
            })
        } else {
            $http.post('/api/user/create', {
                'username': $scope.username,
                'password': $scope.password,
                'email': $scope.email,
                'name': $scope.name
            }).then(function (response) {
                if (response.status !== 200) {
                    console.log(response);
                }
            })
        }

    }

});
