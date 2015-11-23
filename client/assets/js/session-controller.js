angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams) {

    $scope.sessionId = $routeParams.sessionId;
    // var $scope.simplemde = new SimpleMDE({ element: document.getElementById("MyID"), spellChecker: true, hideIcons: ["side-by-side"]});
    $scope.showOption = 'both';
    $scope.snippets = [{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "data is love, data is life",
    },{
      creator : "aluh",
      flags : 2,
      saves: 3,
      content : "Fresh Fruit in Lounge (EOM)"
    },{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "data is love, data is life"
    },{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "data is love, data is life"
    },{
      creator : "aluh",
      flags : 2,
      saves: 3,
      content : "Fresh Fruit in Lounge (EOM)"
    },{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "data is love, data is life"
    },{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "data is love, data is life"
    }];
});
