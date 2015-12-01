angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams, $location, $http, sessionSocket, hotkeys, $rootScope) {

    // init important view variables
    $scope.sessionId = $routeParams.sessionId;
    $scope.showOption = 'both';
    $scope.snippetInput = "";
    $scope.showNotes = true;
    $scope.showFlags = true;
    $scope.currentUser = $rootScope.user;

    // initialize Materialize tooltips
    $('.tooltipped').tooltip({delay: 50});

    // retrieve data, set scope variables
    $http.get('/api/session?sessionId=' + $scope.sessionId).then(function (response) {
        if (response.status === 200) {
            $scope.session = response.data;
            $scope.feed = $scope.session.feed;
            $scope.stash = $scope.session.stash.snippets;
            openPage();
        } else {
            Materialize.toast("Error! " + response.data.error, 2000);
        }
    });


openPage = function() {
  sessionSocket.emit("joined session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});

  $scope.$on('$locationChangeStart', function () {
    // remove tooltips (weird for print view)
    $('.tooltipped').tooltip('remove');
    sessionSocket.emit("left session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});
  });

  // start out in editor mode, not preview mode
  $scope.preview = false;

  // showown.js markdown parser
  var converter = new showdown.Converter();

  // add a snippet to stash and feed, highlight code
  $scope.addSnippet = function() {
    if (!$scope.snippetInput || $scope.snippetInput.length === 0) {Materialize.toast('You cannot submit an empty snippet!', 2000); return;}
    $http.post('/api/session/newsnippet', {
        'sessionId': $scope.session._id,
        'text': converter.makeHtml($scope.snippetInput)
    }).then(function (response) {
        $scope.stash.push(response.data); // add snippet to your own stash

        angular.element(document).ready(function () {
          $('#stash-snippet-' + response.data._id + ' pre code').each(function(i, block) {
              hljs.highlightBlock(block);
          });
        });

        Materialize.toast('Your snippet has been posted!', 2000);
        sessionSocket.emit("added snippet", {"snippet" : response.data, "sessionId" : $scope.sessionId});
        $scope.snippetInput = "";
        $scope.preview = false;
        $scope.previewText = "";
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

  // flag a snippet
  $scope.flagSnippet = function(id) {
    $http.post('/api/snippet/flag', {
        'snippetId': id
    }).then(function (response) {
         sessionSocket.emit("flagged snippet", {"sessionId" : $scope.sessionId, "snippetId" : id, "username" : $scope.currentUser});
         Materialize.toast('Snippet has been flagged!', 2000);
         $("#feed-flag-" + id).addClass('flag-button-active').prop("disabled", true);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

  // remove a snippet, uncolor the button, removefrom stash
  $scope.removeSnippet = function(id) {
    $http.post('/api/stash/remove', {
        'stashId': $scope.session.stash._id,
        'snippetId': id
    }).then(function (response) {

          for (i=0;i<$scope.session.stash.snippets.length;i++) {
            if ($scope.session.stash.snippets[i]._id === id) {
                $scope.session.stash.snippets.splice(i,1); // remove snippet from your own stash
                sessionSocket.emit("removed snippet", {"sessionId" : $scope.sessionId, "snippetId" : id, "username" : $scope.currentUser});
                break;
            }
          }

          angular.element(document).ready(function () {
            $("#feed-save-" + id).removeClass('save-button-active').prop("disabled", false);
          });

         Materialize.toast('Snippet has been removed!', 2000);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

  // save a snippet, color the button, add to stash, highlight new code
  $scope.saveSnippet = function(id) {
    $http.post('/api/stash/save', {
        'stashId': $scope.session.stash._id,
        'snippetId': id
    }).then(function (response) {

         for (i=0;i<$scope.feed.length;i++) {
           if ($scope.feed[i]._id === id) {
               $scope.stash.push(jQuery.extend(true, {}, $scope.feed[i])); // copy snippet onto stash
                angular.element(document).ready(function () {
                   console.log(id, "changing");
                   $("#feed-save-" + id).addClass('save-button-active').prop("disabled", true);
                   $('#stash-snippet-' + id + ' pre code').each(function(i, block) {
                       hljs.highlightBlock(block);
                   });
                });

               sessionSocket.emit("saved snippet", {"sessionId" : $scope.sessionId, "snippetId" : id, "username" : $scope.currentUser});
               break;
           }
         }

         Materialize.toast('Snippet has been saved!', 2000);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

  // scroll stash and feed to bottom of page
  $scope.scrollDivs = function() {
    var objDiv = document.getElementById("feed-view");
    objDiv.scrollTop = objDiv.scrollHeight;
    objDiv = document.getElementById("stash-view");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  // add one to a particular snippet's save count
  $scope.incrementSaveCount = function(snippetId, username) {

    var active = $("#feed-save-" + snippetId).hasClass("save-button-active");
     $("#feed-save-" + snippetId + ",#stash-save-" + snippetId).addClass('animated tada save-button-active').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated tada');
      if (!active) {$(this).removeClass('save-button-active');}
    });

    for (i=0;i<$scope.feed.length;i++) {
      if ($scope.feed[i]._id === snippetId) {
           $scope.feed[i].saveCount++;
           if ($scope.feed[i].savedBy.indexOf(username) === -1) $scope.feed[i].savedBy.push(username);
      }
    }

    for (i=0;i<$scope.stash.length;i++) {
      if ($scope.stash[i]._id === snippetId) {
           $scope.stash[i].saveCount++;
           if ($scope.stash[i].savedBy.indexOf(username) === -1) $scope.stash[i].savedBy.push(username);
      }
    }

  }

  // decrease one from a particular snippet's save count
  $scope.decrementSaveCount = function(snippetId, username) {
    for (i=0;i<$scope.feed.length;i++) {
      if ($scope.feed[i]._id === snippetId) {
           $scope.feed[i].saveCount--;
           $scope.feed[i].savedBy.splice($scope.feed[i].savedBy.indexOf(username), 1);
       }
    }

    for (i=0;i<$scope.stash.length;i++) {
      if ($scope.stash[i]._id === snippetId) {
           $scope.stash[i].saveCount--;
           $scope.stash[i].savedBy.splice($scope.stash[i].savedBy.indexOf(username), 1);
      }
    }

  }

  // add one to a particular snippet's flag count
  $scope.incrementFlagCount = function(snippetId, username) {
    var active = $("#feed-flag-" + snippetId).hasClass("flag-button-active");
    $("#feed-flag-" + snippetId + ",#stash-flag-" + snippetId).addClass('animated tada flag-button-active').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated tada');
      if (!active) {$(this).removeClass('flag-button-active');}
    });

    for (i=0;i<$scope.feed.length;i++) {
      if ($scope.feed[i]._id === snippetId) {
           $scope.feed[i].flagCount++;
           if ($scope.feed[i].flaggedBy.indexOf(username) === -1) $scope.feed[i].flaggedBy.push(username);
      }
    }

    for (i=0;i<$scope.stash.length;i++) {
      if ($scope.stash[i]._id === snippetId) {
           $scope.stash[i].flagCount++;
           if ($scope.stash[i].flaggedBy.indexOf(username) === -1) $scope.stash[i].flaggedBy.push(username);
      }
    }

  }

  // use highlight js to highlight code blocks
    angular.element(document).ready(function () {
      $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
      });
    });

  // on saved snippet, increment save count
  $scope.$on("socket:saved snippet", function(ev, data) {
      $scope.incrementSaveCount(data.snippetId, data.username);
  });

  $scope.$on("socket:flagged snippet", function(ev, data) {
      $scope.incrementFlagCount(data.snippetId, data.username);
  });

  // on removed snippet, decrement save count
  $scope.$on("socket:removed snippet", function(ev, data) {
      $scope.decrementSaveCount(data.snippetId, data.username);
  });

  // on added snippet, added snippet to feed
  $scope.$on("socket:added snippet", function(ev, data) {
      $scope.feed.push(data.snippet);
      angular.element(document).ready(function () {
        $('#feed-snippet-' + data.snippet._id + ' pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
      });
  });


  // changes the editor to preview mode, making sure to highlight code and parse markdown
  $scope.togglePreview = function() {
    if($scope.preview) {
      $scope.preview = false;

      angular.element(document).ready(function () {
        $("#snippet-input-area").focus();
      });

    }  else {
        $scope.preview = true;
        $scope.previewText = converter.makeHtml($scope.snippetInput);
        angular.element(document).ready(function () {
          $('#snippet-preview pre code').each(function(i, block) {
              hljs.highlightBlock(block);
          });
        });
    }
  }


  // check if a stash snippet has overflow
  $scope.isOverflowingStash = function(id) {
    return $("#stash-snippet-" + id).prop('scrollHeight') > $("#stash-snippet-" + id).height();
  }

  // check if a feed snippet has overflow
  $scope.isOverflowingFeed = function(id) {
    return $("#feed-snippet-" + id).prop('scrollHeight') > $("#feed-snippet-" + id).height();
  }

  // check if a stash snippet has been expanded
  $scope.hasOverflownStash = function(id) {
    return $("#stash-snippet-" + id).hasClass('expanded-snippet');
  }

  // check if a feed snippet has been expanded
  $scope.hasOverflownFeed = function(id) {
    return $("#feed-snippet-" + id).hasClass('expanded-snippet');
  }

  // removes the max-height on a stash snippet
  $scope.toggleSnippetStash = function(id) {
     $("#stash-snippet-" + id).toggleClass("collapsed-snippet expanded-snippet");
  }

  // removes the max-height on a feed snippet
  $scope.toggleSnippetFeed = function(id) {
     $("#feed-snippet-" + id).toggleClass("collapsed-snippet expanded-snippet");
  }


  // using angular hotkeys to add functionality
  hotkeys.add({
     combo: 'ctrl+p',
     callback: function() {
       $scope.togglePreview();
     },
     allowIn : ['textarea']
   })
   hotkeys.add({
      combo: 'ctrl+e',
      callback: function() {
        $scope.showNotes = !$scope.showNotes;
      },
      allowIn : ['textarea']
    })
    hotkeys.add({
       combo: 'ctrl+s',
       callback: function() {
            $scope.addSnippet();
       },
       allowIn : ['textarea']
     })
  } // end

});
