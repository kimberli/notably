angular.module('notablyApp').controller('navController', function ($scope, $http, $rootScope, $location) {

    $scope.logout = function () {
        $http.post('/api/user/logout', {})
        .then(function (response) {
            $rootScope.user = null;
            $location.path('/');
        }, function(response) {
            console.log(response.data.error);
        });
    }

});
