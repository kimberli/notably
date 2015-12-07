angular.module('notablyApp').controller('stashController', function ($scope, $http, $rootScope, $location, $routeParams) {
    $scope.stashId = "";
    $('.tooltipped').tooltip({delay: 50});
    // use highlight js to highlight code blocks, render mathjax

    $scope.$on('$routeChangeSuccess', function() {
        $scope.stashId = $routeParams.stashId;
        $http.get('/api/stash?stashId=' + $scope.stashId).then(function (response) {
            if (response.status === 200) {
                $scope.stash = response.data;
                $scope.snippets = $scope.stash.snippets;

                $scope.printPage = function() {
                    window.print();
                }

                angular.element(document).ready(function () {
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('snippet-table')]);
                    $('pre code').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                });
            } else {
                $scope.error = true;
            }
        }, function(response) {
            $location.path('/home')
        });
    });
});
