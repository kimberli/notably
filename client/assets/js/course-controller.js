angular.module('notablyApp').controller('courseController', function ($scope, $http, $routeParams, sessionSocket, $location) {

    $http.get('/api/course?number=' + $routeParams.courseNumber).then(function (response) {
        $scope.course = response.data;
        $scope.loadPage();
    });


    $scope.loadPage = function() {

      sessionSocket.emit("joined course page", {"courseNumber" : $routeParams.courseNumber, "sessions" : $scope.course.sessions});

      $scope.$on('$locationChangeStart', function () {
        sessionSocket.emit("left course page", {"courseNumber" : $routeParams.courseNumber});
      });

      $scope.createSession = function () {
        if ($scope.course.sessions.length > 0)  {
          $scope.latestSession = $scope.course.sessions[$scope.course.sessions.length - 1];
          $scope.latestSessionTime = new Date($scope.latestSession.createdAt);
          if (Date.now() - $scope.latestSessionTime.getTime() < 15*60*1000) {
            $('#newTitle').blur();
            $('#new-session-modal').openModal();
          } else {
            $scope.createNewSession();
          }
        } else {
          $scope.createNewSession();
        }
      }

    $scope.createNewSession = function() {
        $http.post('/api/course/newsession', {
            'number': $scope.course.meta.number,
            'title': $scope.newTitle
        }).then(function (response) {
            Materialize.toast('Your session has been created!', 2000);
            sessionSocket.emit("new session", {"session" : response.data, "courseNumber" : $routeParams.courseNumber});
            $scope.newTitle = "";
        }, function(response) {
            Materialize.toast(response.data.error, 2000);
        });
     }

      $scope.$on("socket:new session", function(ev, data) {
        $scope.course.sessions.push(data.session);
      });

      $scope.$on("socket:session data loaded", function(ev, data) {
        $scope.occupancy = data.occupancy;
      });
  }
});
