/*!
 * AngularJS Round Progress Directive
 *
 * Copyright 2013 Stephane Begaudeau
 * Released under the MIT license
 */
angular.module('ringid.directives')
        .directive('rgRoundProgress', [function () {
                var compilationFunction = function (templateElement, templateAttributes, transclude) {
                    if (templateElement.length === 1) {
                        var node = templateElement[0];
                        var width;// = node.getAttribute('data-round-progress-width') || '400';
                        var height;// = node.getAttribute('data-round-progress-height') || '400';

                        var canvas = document.createElement('canvas');
//                        canvas.setAttribute('width', width);
//                        canvas.setAttribute('height', height);
//                        canvas.setAttribute('data-round-progress-model', node.getAttribute('data-round-progress-model'));

//                        node.parentNode.replaceChild(canvas, node);

                        var outerCircleWidth;// = node.getAttribute('data-round-progress-outer-circle-width') || '20';
                        var innerCircleWidth;// = node.getAttribute('data-round-progress-inner-circle-width') || '5';

                        var outerCircleBackgroundColor;// = node.getAttribute('data-round-progress-outer-circle-background-color') || '#505769';
                        var outerCircleForegroundColor;// = node.getAttribute('data-round-progress-outer-circle-foreground-color') || '#12eeb9';
                        var innerCircleColor;// = node.getAttribute('data-round-progress-inner-circle-color') || '#505769';
                        var labelColor;// = node.getAttribute('data-round-progress-label-color') || '#12eeb9';

                        var outerCircleRadius;// = node.getAttribute('data-round-progress-outer-circle-radius') || '100';
                        var innerCircleRadius;// = node.getAttribute('data-round-progress-inner-circle-radius') || '70';

                        var labelFont;// = node.getAttribute('data-round-progress-label-font') || '50pt Calibri';

                        return {
                            pre: function preLink(scope, instanceElement, instanceAttributes, controller) {
                                var scale = (window.outerWidth - 20) / 1920;
                                width = +(scope.roundProgressBarStyle.dataRoundProgressWidth || '200') * scale;
                                height = +(scope.roundProgressBarStyle.dataRoundProgressHeight || '200') * scale;

                                canvas.setAttribute('width', width);
                                canvas.setAttribute('height', height);
                                canvas.setAttribute('data-round-progress-model', node.getAttribute('data-round-progress-model'));

                                node.parentNode.replaceChild(canvas, node);


                                outerCircleWidth = +(scope.roundProgressBarStyle.dataRoundProgressOuterCircleWidth || '4') * scale;
                                innerCircleWidth = +(scope.roundProgressBarStyle.dataRoundProgressInnerCircleWidth || '8') * scale;


                                outerCircleRadius = +(scope.roundProgressBarStyle.dataRoundProgressOuterCircleRadius || '85') * scale;
                                innerCircleRadius = +(scope.roundProgressBarStyle.dataRoundProgressInnerCircleRadius || '85') * scale;

                                labelFont = (+(scope.roundProgressBarStyle.dataRoundProgressLabelFont || '24') * scale) + 'px Arial';



                                outerCircleBackgroundColor = scope.roundProgressBarStyle.dataRoundProgressOuterCircleBackgroundColor || '#505769';
                                outerCircleForegroundColor = scope.roundProgressBarStyle.dataRoundProgressOuterCircleForegroundColor || '#13A8E8';
                                innerCircleColor = scope.roundProgressBarStyle.dataRoundProgressInnerCircleColor || '#505769';
                                labelColor = scope.roundProgressBarStyle.dataRoundProgressLabelColor || '#fff';

                            },
                            post: function postLink(scope, instanceElement, instanceAttributes, controller) {

                                var expression = canvas.getAttribute('data-round-progress-model');

                                scope.$watch(expression, function (newValue, oldValue) {
                                    console.log(expression, newValue, oldValue);
                                    // Create the content of the canvas
                                    var ctx = canvas.getContext('2d');
                                    ctx.clearRect(0, 0, width, height);

                                    // The "background" circle
                                    var x = width / 2;
                                    var y = height / 2;
//                                    ctx.beginPath();
//                                    ctx.arc(x, y, parseInt(outerCircleRadius), 0, Math.PI * 2, false);
//                                    ctx.lineWidth = parseInt(outerCircleWidth);
//                                    ctx.strokeStyle = outerCircleBackgroundColor;
//                                    ctx.stroke();

                                    // The inner circle
                                    ctx.beginPath();
                                    ctx.arc(x, y, parseInt(innerCircleRadius), 0, Math.PI * 2, false);
                                    ctx.lineWidth = parseInt(innerCircleWidth);
//                                    ctx.shadowColor = innerCircleColor;
                                    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                                    ctx.globalCompositeOperation = 'source-over';
                                    ctx.stroke();

                                    // The inner number
                                    ctx.font = labelFont;
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = labelColor;
//                                    ctx.shadowColor = "black";
//                                    ctx.shadowOffsetY = 3;
//                                    ctx.shadowOffsetX = 3;
                                    ctx.fillText(newValue.label + '%', x, y);

                                    // The "foreground" circle
                                    var startAngle = -(Math.PI / 2);
                                    var endAngle = ((Math.PI * 2) * newValue.percentage) - (Math.PI / 2);
                                    var anticlockwise = false;
                                    ctx.beginPath();
                                    ctx.arc(x, y, parseInt(outerCircleRadius), startAngle, endAngle, anticlockwise);
                                    ctx.lineWidth = parseInt(outerCircleWidth);
                                    ctx.strokeStyle = outerCircleForegroundColor;
                                    ctx.stroke();
                                }, true);
                            }
                        };
                    }
                };

                var roundProgress = {
                    compile: compilationFunction,
                    replace: true
                };
                return roundProgress;
            }]);
