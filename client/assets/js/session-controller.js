angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams, $location, $http, sessionSocket, hotkeys) {


    new function($) {
      $.fn.setCursorPosition = function(pos) {
        if (this.setSelectionRange) {
          this.setSelectionRange(pos, pos);
        } else if (this.createTextRange) {
          var range = this.createTextRange();
          range.collapse(true);
          if(pos < 0) {
            pos = $(this).val().length + pos;
          }
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
        }
      }
    }(jQuery);

    $scope.sessionId = $routeParams.sessionId;
    $scope.showOption = 'both';
    $scope.snippetInput = "";
    $scope.showNotes = true;


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
    $('.tooltipped').tooltip('remove');
    sessionSocket.emit("left session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});
  });

  $scope.preview = false;
  var converter = new showdown.Converter();

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

  $scope.flagSnippet = function(id) {
    alert("flag " + id);
    // TODO add http call
  }

  $scope.removeSnippet = function(id) {
    $http.post('/api/stash/remove', {
        'stashId': $scope.session.stash._id,
        'snippetId': id
    }).then(function (response) {

          for (i=0;i<$scope.session.stash.snippets.length;i++) {
            if ($scope.session.stash.snippets[i]._id === id) {
                $scope.session.stash.snippets.splice(i,1); // remove snippet from your own stash
                sessionSocket.emit("removed snippet", {"sessionId" : $scope.sessionId, "snippetId" : id});
                break;
            }
          }

         Materialize.toast('Your snippet has been removed!', 2000);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

  $scope.saveSnippet = function(id) {
    $http.post('/api/stash/save', {
        'stashId': $scope.session.stash._id,
        'snippetId': id
    }).then(function (response) {

         for (i=0;i<$scope.feed.length;i++) {
           if ($scope.feed[i]._id === id) {
               $scope.stash.push(jQuery.extend(true, {}, $scope.feed[i])); // copy snippet onto stash

                angular.element(document).ready(function () {
                   $('#stash-snippet-' + id + ' pre code').each(function(i, block) {
                       hljs.highlightBlock(block);
                   });
                });

               sessionSocket.emit("saved snippet", {"sessionId" : $scope.sessionId, "snippetId" : id});
               break;
           }
         }

         Materialize.toast('Your snippet has been saved!', 2000);
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
  $scope.incrementSaveCount = function(snippetId) {

    $("#feed-save-" + snippetId + ",#stash-save-" + snippetId).addClass('animated tada save-button-active').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated tada save-button-active');
    });

    for (i=0;i<$scope.feed.length;i++) {
      if ($scope.feed[i]._id === snippetId) {
           $scope.feed[i].saveCount++;
      }
    }

    for (i=0;i<$scope.stash.length;i++) {
      if ($scope.stash[i]._id === snippetId) {
           $scope.stash[i].saveCount++;
      }
    }

  }

  // decrease one from a particular snippet's save count
  $scope.decrementSaveCount = function(snippetId) {
    for (i=0;i<$scope.feed.length;i++) {
      if ($scope.feed[i]._id === snippetId) {
           $scope.feed[i].saveCount--;
      }
    }

    for (i=0;i<$scope.stash.length;i++) {
      if ($scope.stash[i]._id === snippetId) {
           $scope.stash[i].saveCount--;
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
      $scope.incrementSaveCount(data.snippetId);
  });

  // on removed snippet, decrement save count
  $scope.$on("socket:removed snippet", function(ev, data) {
      $scope.decrementSaveCount(data.snippetId);
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


  $scope.isOverflowingStash = function(id) {
    return $("#stash-snippet-" + id).prop('scrollHeight') > $("#stash-snippet-" + id).height();
  }

  $scope.isOverflowingFeed = function(id) {
    return $("#feed-snippet-" + id).prop('scrollHeight') > $("#feed-snippet-" + id).height();
  }

  $scope.hasOverflownStash = function(id) {
    return $("#stash-snippet-" + id).hasClass('expanded-snippet');
  }

  $scope.hasOverflownFeed = function(id) {
    return $("#feed-snippet-" + id).hasClass('expanded-snippet');
  }

  $scope.toggleSnippetStash = function(id) {
     $("#stash-snippet-" + id).toggleClass("collapsed-snippet expanded-snippet");
  }

  $scope.toggleSnippetFeed = function(id) {
     $("#feed-snippet-" + id).toggleClass("collapsed-snippet expanded-snippet");
  }


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
