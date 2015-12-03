angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams, $location, $http, sessionSocket, hotkeys, $rootScope, $timeout) {

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
            // true for a snippet id if the current user has saved the snippet
            $scope.alreadySaved = {};
            // true for a snippet id if the current user has flagged the snippet
            $scope.alreadyFlagged = {};
            for (i=0; i<$scope.feed.length;i++) {
              if ($scope.feed[i].savedBy.indexOf($scope.currentUser) > -1) {
                $scope.alreadySaved[$scope.feed[i]._id] = true;
              } else {
                $scope.alreadySaved[$scope.feed[i]._id] = false;
              }
              if ($scope.feed[i].flaggedBy.indexOf($scope.currentUser) > -1) {
                $scope.alreadyFlagged[$scope.feed[i]._id] = true;
              } else {
                $scope.alreadyFlagged[$scope.feed[i]._id] = false;
              }
            }
            // snippets have loaded, can load page now
            openPage();
        } else {
            Materialize.toast("Error! " + response.data.error, 2000);
        }
    });


openPage = function() {

  // let the server know you've joined to update view counts, join the room
  sessionSocket.emit("joined session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});

  $scope.$on('$locationChangeStart', function () {
    // remove tooltips (weird for print view)
    $('.tooltipped').tooltip('remove');
    // leave session room on location start (socket disconnect on leave page is handled separately)
    sessionSocket.emit("left session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});
  });

  // start out in editor mode, not preview mode
  $scope.preview = false;

  // showown.js markdown parser
  var converter = new showdown.Converter();

  $scope.addSnippet = function() {
    // check if input is blank
    if (!$scope.snippetInput || $scope.snippetInput.length === 0) {Materialize.toast('You cannot submit an empty snippet!', 2000); return;}

    sessionSocket.emit("added snippet", {
        "content" : converter.makeHtml($scope.snippetInput),
        "sessionId" : $scope.sessionId,
        "username" :  $scope.currentUser
      });

  }

  // flag a snippet
  $scope.flagSnippet = function(id) {
    sessionSocket.emit("flagged snippet", {
        "snippetId" : id,
        "username" :  $scope.currentUser,
        "sessionId" : $scope.sessionId,
      });
  }

  // remove a snippet
  $scope.removeSnippet = function(id) {
      sessionSocket.emit("removed snippet", {
          "snippetId" : id,
          "username" :  $scope.currentUser,
          "sessionId" : $scope.sessionId,
          'stashId': $scope.session.stash._id,
        });
  }

  // save a snippet, color the button, add to stash, highlight new code
  $scope.saveSnippet = function(id) {
      sessionSocket.emit("saved snippet", {
          "snippetId" : id,
          "username" :  $scope.currentUser,
          "sessionId" : $scope.sessionId,
          'stashId': $scope.session.stash._id,
        });
  }

  // scroll stash and feed to bottom of page (not used yet)
  $scope.scrollDivs = function() {
    var objDiv = document.getElementById("feed-view");
    objDiv.scrollTop = objDiv.scrollHeight;
    objDiv = document.getElementById("stash-view");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  // add one to a particular snippet's save count
  $scope.incrementSaveCount = function(snippetId, username) {

    // but first lets add a cute animation!
     $("#feed-save-" + snippetId + ",#stash-save-" + snippetId).addClass('animated tada save-button-animate').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated tada save-button-animate');
    });

    // increment savecount, add to savedBy if it isn't already there (just in case)
    // do this for stash and feed

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

    // decrement savecount, delete from savedBy
    // do this for stash and feed

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

    // increment flagcount, add to flaggedBy if it isn't already there (just in case)
    // do this for stash and feed

    // but first lets add a cute animation!
    $("#feed-flag-" + snippetId + ",#stash-flag-" + snippetId).addClass('animated tada flag-button-animate').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated tada flag-button-animate');
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

  // use highlight js to highlight code blocks, also render mathjax
  $scope.typesetElement = function(id) {
    angular.element(document).ready(function () {
      // mathjax and code highlighting for new snippet
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById(id)]);
      $('#' + id + ' pre code').each(function(i, block) {
          hljs.highlightBlock(block);
      });
    });
  }

  // typeset the entire page on load
  $scope.typesetElement('stash-feed-rows');

  // on saved snippet, increment save count
  $scope.$on("socket:saved snippet", function(ev, data) {
      $scope.incrementSaveCount(data.snippetId, data.username);
     if (data.username === $scope.currentUser) {
           for (i=0;i<$scope.feed.length;i++) {
             if ($scope.feed[i]._id === data.snippetId) {
                 $scope.alreadySaved[data.snippetId] = true; // its saved by you!
                 console.log($scope.alreadySaved[data.snippetId], data.snippetId, "save");
                 $scope.stash.push(jQuery.extend(true, {}, $scope.feed[i])); // copy snippet onto stash
                 $scope.typesetElement('stash-snippet-' + data.snippetId)
                 Materialize.toast('Snippet has been saved!', 2000);
                 break;
             }
           }
      }
  });

  // on flagged snippet, increment flag count
  $scope.$on("socket:flagged snippet", function(ev, data) {
        $scope.incrementFlagCount(data.snippetId, data.username);
        if (data.username === $scope.currentUser) {
            $scope.alreadyFlagged[data.snippetId] = true;
            Materialize.toast('Snippet has been flagged!', 1000);
        }
  });

  // on removed snippet, decrement save count
  $scope.$on("socket:removed snippet", function(ev, data) {
      $scope.decrementSaveCount(data.snippetId, data.username);
      if (data.username === $scope.currentUser) {
            $scope.alreadySaved[data.snippetId] = false;
            for (i=0;i<$scope.session.stash.snippets.length;i++) {
              if ($scope.session.stash.snippets[i]._id === data.snippetId) { // found it!
                  // isnt saved anymore, set to false
                  $scope.session.stash.snippets.splice(i,1); // remove snippet from your own stash
                  break;
              }
            }
            Materialize.toast('Snippet has been removed!', 1000);
      }
  });

  // on added snippet, added snippet to feed
  $scope.$on("socket:added snippet", function(ev, data) {
      // add to feed
      $scope.feed.push(jQuery.extend(true, {}, data.snippet));
      $scope.typesetElement('feed-snippet-' + data.snippet._id);

      // if you were the one that posted it, handle it specially
      if (data.snippet.author === $scope.currentUser) {
          $scope.alreadySaved[data.snippet._id] = true;
          $scope.stash.push(jQuery.extend(true, {}, data.snippet)); // add snippet to your own stash
          // save it automatically
          $scope.typesetElement('stash-snippet-' + data.snippet._id);
          Materialize.toast('Your snippet has been posted!', 1000);
          // reset editor
          $scope.snippetInput = "";
          $scope.preview = false;
          $scope.previewText = "";
      }
  });

  $scope.$on("socket:error", function(ev, data) {
      Materialize.toast(data.message, 1000);
  });


  // changes the editor to preview mode, making sure to highlight code and parse markdown
  $scope.togglePreview = function() {
    if($scope.preview) {
      $scope.preview = false;

      angular.element(document).ready(function () {
        $("#snippet-input-area").focus();
      });

    }  else {
        // use showdown to convert
        $scope.previewText = converter.makeHtml($scope.snippetInput);
        $scope.typesetElement('snippet-preview');
        $scope.preview = true;
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

  $scope.getClassSave = function(id) {
    console.log("trying to compute class!!");
    return $scope.alreadySaved[id] ? ['save-button-active','save-button','snippet-button'] : ['save-button','snippet-button'];
  }

  $scope.getClassFlag = function(id) {
    return $scope.alreadySaved[id] ? 'flag-button-active flag-button snippet-button' : 'flag-button snippet-button';
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
