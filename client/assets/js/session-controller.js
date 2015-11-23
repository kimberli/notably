angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams) {

    $scope.sessionId = $routeParams.sessionId;
    //$scope.simplemde = new SimpleMDE({ element: document.getElementById("MyID"), spellChecker: true, hideIcons: ["side-by-side"]});

    // author: String,
    // text: String,
    // timestamp: Date,
    // saveCount: Number,
    // hidden: Boolean,
    // savedBy: [String],
    // flaggedBy: [String],
    // sessionId: String

  $scope.showOption = 'both';
    $scope.snippets = [{
      author : "kim",
      flags : 2,
      saveCount : 3,
      text : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
    },{
      author : "aluh",
      flags : 2,
      saveCount: 3,
      text : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
    },{
      author : "faz",
      flags : 2,
      saveCount: 3,
      text : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
    },{
      author : "kim",
      flags : 2,
      saveCount: 3,
      text : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
    },{
      author : "aluh",
      flags : 2,
      saveCount: 3,
      text : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
    },{
      author : "faz",
      flags : 2,
      saveCount: 3,
      text : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
    },{
      author : "kim",
      flags : 2,
      saveCount: 3,
      text : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
    },{
      author : "aluh",
      flags : 2,
      saveCount: 3,
      text : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
    },{
      author : "faz",
      flags : 2,
      saveCount: 3,
      text : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"],
      id: "aCd21as",
      timestamp : Date.now()
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
