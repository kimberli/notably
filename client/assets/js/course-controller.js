angular.module('notablyApp').controller('courseController', function ($scope, $routeParams) {

    $scope.courseNumber = $routeParams.courseNumber;

    $scope.sessions = [{'title': 'stash111', 'count': 14},
        {'title': 'hi22', 'count': 201},
        {'title': 'heyo', 'count': 2}]

});
