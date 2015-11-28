angular.module('notablyApp').controller('stashController', function ($scope, $http, $rootScope, $location, $routeParams) {
    $scope.stashId = $routeParams.stashId;

    $http.get('/api/stash?stashId=' + $scope.stashId).then(function (response) {
          $('.tooltipped').tooltip({delay: 50});
          if (response.status === 200) {
              $scope.stash = response.data;
              $scope.snippets = $scope.stash.snippets;

              $scope.printPage = function() {
                window.print();
              }

              angular.element(document).ready(function () {
                $('pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                  });
              });

          } else {
            $scope.error = true;
          }
      }, function() {$scope.error = true;});
});
