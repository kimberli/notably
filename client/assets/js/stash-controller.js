angular.module('notablyApp').controller('stashController', function ($scope, $http, $rootScope, $location, $routeParams) {
    $scope.stashId = $routeParams.stashId;

    $http.get('/api/stash?stashId=' + $scope.stashId).then(function (response) {
          console.log(response);
          if (response.status === 200) {
              $scope.stash = response.data;
              $scope.snippets = $scope.stash.snippets;

              $scope.printPage = function() {
                window.print();
              }

          } else {
              Materialize.toast("Error! " + response.data.error, 2000);
          }
      });
});
