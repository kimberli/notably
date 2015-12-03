angular.module('notablyApp').controller('profileController', function ($scope, $routeParams, $http, $rootScope) {

    $http.get('/api/user?username=' + $routeParams.username).then(function (response) {
        $scope.user = response.data;
    });
});
