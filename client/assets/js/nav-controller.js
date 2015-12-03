angular.module('notablyApp').controller('navController', function ($scope, $http, $rootScope, $location, $window) {

    $scope.logout = function () {
        $http.post('/api/user/logout', {})
        .then(function (response) {
            $rootScope.user = null;
            $window.location.href = '/';
        }, function(response) {
            console.log(response.data.error);
        });
    }

    $scope.selectedCourse = function(selected) {
        if (selected) {
            $location.path('/course/'+selected.originalObject.number);
        }
    }

    if (!$rootScope.courses) {
        $http.get('/api/course/all').then(function (response) {
            $rootScope.courses = response.data.courses;
            $scope.courses = $rootScope.courses;
        });
    } else {
        $scope.courses = $rootScope.courses;
    }

});
