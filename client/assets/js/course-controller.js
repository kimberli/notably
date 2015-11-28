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
        $scope.latestSession = $scope.course.sessions[$scope.course.sessions.length - 1];
        $scope.latestSessionTime = new Date($scope.latestSession.createdAt);
        if (Date.now() - $scope.latestSessionTime.getTime() < 15*60*1000) {
          $('#new-session-modal').openModal();
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
        $scope.occupancy[data.session._id] = 0;
      });

      // on removed snippet, decrement save count
      $scope.$on("socket:joined session", function(ev, data) {
        if (data.sessionId in $scope.occupancy) {$scope.occupancy[data.sessionId]++;}
      });

      // on added snippet, added snippet to feed
      $scope.$on("socket:left session", function(ev, data) {
        if (data.sessionId in $scope.occupancy) {$scope.occupancy[data.sessionId]--;}
      });

      $scope.$on("socket:session data loaded", function(ev, data) {
        $scope.occupancy = data.occupancy;
      });
  }
});
