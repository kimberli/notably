angular.module('notablyApp').controller('profileController', function ($scope, $routeParams, $http, $rootScope) {

    $scope.loaded = false;

    $scope.$on('$routeChangeSuccess', function() {
        $http.get('/api/user?username=' + $routeParams.username).then(function (response) {
            $scope.user = response.data;
            $scope.loaded = true;
        });
    });

});
