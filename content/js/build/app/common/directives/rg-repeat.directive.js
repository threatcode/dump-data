/**
 * © Ipvision
 */


angular.module('ringid.directives')
.directive('rgRepeat', rgRepeat);

rgRepeat.$inject = ['$parse', '$rootScope', '$animate','SystemEvents'];

function rgRepeat($parse, $rootScope, $animate, SystemEvents) {

    function compile(element, attr) {


        return function ($scope, $element, $attr, ctrl, $transclude) {

            var expression = $attr.rgRepeat;
            var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s+track\s+by\s+(.+)\s*$/),
                index, lhs, rhs, trackByExp, valueIdentifier, cell, cells = [],
                lastBlockMap = Object.create(null);

            if (!match) {
                throw "Expected expression in form of '_item_ in _collection track by _key_'";
            }

            var rgRepeatEndComment = document.createComment(' end rgRepeat: ' + expression + ' ');

            lhs = match[1];
            rhs = match[2];

            /* find getter function by parsing track by*/
            var getTrackID = $parse(match[3]);

            valueIdentifier = match[1];

            $scope.$watchCollection(rhs, update);

            function update(collection) {

                var index, i, length = collection.length,
                    value, childScope, cellIndex, trackID, block, getterLocals, prevNode = $element[0],
                    nextNode, nextBlockMap = Object.create(null), parent, clone, temp;


                    $rootScope.$$postDigest(function() {
                         var index, value, block;

                         for (index = 0; index < collection.length; index++) {
                            value = collection[index];
                            if(!lastBlockMap[value.$TrackID]) continue;
                            block = lastBlockMap[value.$TrackID];
                            if(block.childHead) block.scope.$$childHead = block.childHead;
                         }
                     });

                /* Find next Blocks that are going to added*/
                for (index = 0; index < length; index++) {

                    value = collection[index];
                    getterLocals = {};
                    getterLocals[valueIdentifier] = value;
                    trackID = getTrackID($scope, getterLocals);

                    if (lastBlockMap[trackID]) {
                        block = lastBlockMap[trackID];
                        /* found it and it is going to be processed in next blockmap so deleted it from last block map */
                        delete lastBlockMap[trackID];
                    }
                    else {

                        childScope = $scope.$new();
                        childScope[valueIdentifier] = value;
                        block = {};
                        block.clone = null;
                        block.scope = childScope;
                    }

                    collection[index]['$TrackID'] = trackID;
                    nextBlockMap[trackID] = block;
                }

                /* Remove blocks from existing which are not going to process*/
                for (trackID in lastBlockMap) {
                    if (lastBlockMap[trackID]) {

                        block = lastBlockMap[trackID];
                        for (i = 0; i < block.clone.length; i++) {
                            prevNode.parentNode.removeChild(block.clone[i]);
                        }
                        block.scope.$destroy();
                    }
                }

                /* Build DOM now*/
                for (index = 0; index < length; index++) {

                    value = collection[index];
                    trackID = value['$TrackID'];
                    block = nextBlockMap[trackID];
                    block.scope.$index = index;
                    clone = block.clone;

                    if (clone) {

                        nextNode = prevNode;

                        if (block.startNode != nextNode) {
                            $animate.move(block.clone, null, angular.element(prevNode));
                        }

                        prevNode = block.clone[block.clone.length-1];

                        block.childHead = block.scope.$$childHead;
                        block.scope.$$childHead = null;

                    }
                    else {

                        $transclude(block.scope, function rgRepeatTransclude(clone) {

                            var endNode = rgRepeatEndComment.cloneNode(false);
                            clone[clone.length++] = endNode;
                            $animate.enter(clone, null, angular.element(prevNode));
                            prevNode = endNode;

                            block.clone = clone;
                            block.startNode = clone[0];
                        });
                    }

               }

               /*broadcast feed-height change*/
               if($scope.target && $scope.target.getMapKey) {
                  $scope.$emit(SystemEvents.FEED.HEIGHT, $scope.target.getMapKey());
               }

                /* Updating last blockmap from current block map*/
                lastBlockMap = nextBlockMap;
            }
        }
    }

    return {
        restrict: 'A',
        transclude: 'element',
        priority: 1000,
        terminal: true,
        compile: compile
    };
}
