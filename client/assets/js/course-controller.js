angular.module('notablyApp').controller('courseController', function ($scope, $http, $routeParams) {


    $http.get('/api/course?number=' + $routeParams.courseNumber).then(function (response) {
        $scope.course = response.data;

        $scope.createSession = function () {
            $http.post('/api/course/newsession', {
                'number': $scope.course.meta.number,
                'title': $scope.newTitle
            }).then(function (response) {
                Materialize.toast('Your session has been created!', 2000);
                $scope.course.sessions.push(response.data);
            }, function(response) {
                Materialize.toast(response.data.error, 2000);
            });
        }
    });

});
