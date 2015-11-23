angular.module('notablyApp').controller('splashController', function ($scope, $http) {

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
