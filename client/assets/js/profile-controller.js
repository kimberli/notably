angular.module('notablyApp').controller('profileController', function ($scope, $routeParams, $http, $rootScope) {

    $scope.$on('$routeChangeSuccess', function() {
        $http.get('/api/user?username=' + $routeParams.username).then(function (response) {
            $scope.user = response.data;
        });
    });

});
