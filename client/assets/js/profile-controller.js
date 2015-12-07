angular.module('notablyApp').controller('profileController', function ($scope, $routeParams, $http, $rootScope, $location) {

    $scope.loaded = false;

    $scope.$on('$routeChangeSuccess', function() {
        $http.get('/api/user?username=' + $routeParams.username).then(function (response) {
            $scope.user = response.data;
            $scope.loaded = true;
        }, function(response) {
            $location.path('/home')
        });
    });

});
