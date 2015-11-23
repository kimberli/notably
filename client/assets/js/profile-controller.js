angular.module('notablyApp').controller('profileController', function ($scope, $routeParams, $http) {

    $scope.username = $routeParams.username;
    $scope.courses = []

    $http.get('/api/user/courses?username=' + $scope.username).then(function (response) {
        if (response.status === 200) {
            $scope.courses = response.data;
        } else {
            console.log($scope.data);
        }
    })

});
