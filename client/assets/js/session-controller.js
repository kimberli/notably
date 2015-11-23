angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams) {

    $scope.sessionId = $routeParams.sessionId;
    //$scope.simplemde = new SimpleMDE({ element: document.getElementById("MyID"), spellChecker: true, hideIcons: ["side-by-side"]});
    $scope.showOption = 'both';
    $scope.snippets = [{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    },{
      creator : "aluh",
      flags : 2,
      saves: 3,
      content : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    },{
      creator : "faz",
      flags : 2,
      saves: 3,
      content : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    },{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    },{
      creator : "aluh",
      flags : 2,
      saves: 3,
      content : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    },{
      creator : "faz",
      flags : 2,
      saves: 3,
      content : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    },{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    },{
      creator : "aluh",
      flags : 2,
      saves: 3,
      content : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    },{
      creator : "faz",
      flags : 2,
      saves: 3,
      content : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as"
    }];

    $scope.addSnippet = function() {
      alert($scope.snippetInput);
      // TODO add http call
    }

    $scope.flagSnippet = function(id) {
      alert("flag " + id);
      // TODO add http call
    }

    $scope.removeSnippet = function(id) {
      alert("remove " + id);
      // TODO add http call
    }

    $scope.saveSnippet = function(id) {
      alert("save " + id);
      // TODO add http call
    }


});
