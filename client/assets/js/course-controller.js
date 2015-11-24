angular.module('notablyApp').controller('courseController', function ($scope, $routeParams) {

    $scope.courseNumber = $routeParams.courseNumber;

    $scope.sessions = [{'title': 'stash111', 'count': 14},
        {'title': 'hi22', 'count': 201},
        {'title': 'heyo', 'count': 2}]

    $scope.createSession = function () {
      $http.post('/api/course/newsession', {
          'number': $scope.courseNumber,
          'title': $scope.sessionInput
      }).then(function (response) {
           Materialize.toast('Your session has been created!', 2000);
      }, function(response) {
          alert(response.data.error);
      });
    }

});
