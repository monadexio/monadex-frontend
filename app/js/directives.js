'use strict';

/* Directives */
var monadexDirectives = angular.module('monadexApp.directives', []);

monadexDirectives.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]);

monadexDirectives.directive('tshirtDesigner', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            colors: '=',
            images: '=',
            tshirtTypes: '=tshirttypes',
            fonts: '='
        },
        templateUrl: 'partials/tshirt-designer.html',
        link: function(scope, element, attrs) {
            $timeout(function() {
                //canvas.add(new fabric.fabric.Object({hasBorders:true,hasControls:false,hasRotatingPoint:false,selectable:false,type:'rect'}));
                element.find(".clearfix button,a").tooltip();
            }, 0);
        }
    };
}]);

monadexDirectives.directive('tShirtCanvas', ['$timeout', 'canvasService', function($timeout, canvasService) {
    var canvas;
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'partials/tshirt-canvas.html',
        link: function(scope, element, attrs) {
            // initialize the canvasService
            canvasService.init('tcanvas', "#tshirtFacing");
            $timeout(function() {
                element.find("#drawingArea").hover(canvasService.addCanvasBorder, canvasService.removeCanvasBorder);
                scope.$on('mdeChangeBackground', function(event, color) {
                    element.find("#shirtDiv").css("backgroundColor", color);
                });
            }, 0);
        }
    };
}]);

monadexDirectives.directive('bgColorPicker', ['$timeout', 'canvasService', function($timeout, canvasService){
    return {
        restrict: 'E',
        scope: {
            colors: '='
        },
        templateUrl: 'partials/bg-color-picker.html',
        link: function(scope, element, attrs) {
            $timeout(function() {
                element.find('.color-preview').on("click", function(){
                    var color = $(this).css("background-color");
                    canvasService.changeBackground(color);
                });
            }, 0);
        }
    };
}]);

monadexDirectives.directive('textInput', ['$timeout', 'canvasService', function($timeout, canvasService){
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'partials/text-input.html',
        link: function(scope, element, attrs) {
            $timeout(function() {
                element.find('#add-text').on("click", function(){
                    var text = $("#text-string").val();
                    canvasService.addText(text);
                    //$("#texteditor").css('display', 'block');
                    //$("#imageeditor").css('display', 'block');
                });

                element.find("#text-string").keyup(function(){
                    var text = $(this).value;
                    canvasService.renderActiveTextContent(text);
                });

                scope.$on('mdeTextObjectSelected', function(event, props) {
                    element.find("#text-string").val("");
                    element.find("#text-string").val(props.text);
                });

                scope.$on('mdeObjectCleared', function(event) {
                    element.find("#text-string").val("");
                });
            }, 0);
        }
    };
}]);

monadexDirectives.directive('imagePicker', ['$timeout', 'canvasService', function($timeout, canvasService){
    return {
        restrict: 'E',
        scope: {
            images: '='
        },
        templateUrl: 'partials/image-picker.html',
        link: function(scope, element, attrs) {
            $timeout(function() {
                element.find(".img-polaroid").on("click", function(e){
                    var el = e.target;
                    canvasService.addImage(el.src);
                });
            }, 0);
        }};
}]);

monadexDirectives.directive('imageEditor', ['$timeout', 'canvasService', function($timeout, canvasService){
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'partials/image-editor.html',
        link: function(scope, element, attrs) {
            $timeout(function() {
                element.find('#remove-selected').click(canvasService.removeSelected);
                element.find('#flip').click(function() {
                    if (element.find('#flip').attr("title") == "Show Back View") {
                        element.find('#flip').attr('title', 'Show Front View');
                        canvasService.flip("img/crew_back.png");
                    } else {
                        element.find('#flip').attr('title', 'Show Back View');
                        canvasService.flip("img/crew_front.png");
                    }
                });

                scope.$on('mdeTextObjectSelected', function(event, props) {
                    element.find("#imageeditor").css('display', 'none');
                });

                scope.$on('mdeImageObjectSelected', function(event, props) {
                    element.find("#imageeditor").css('display', 'block');
                });

                scope.$on('mdeObjectCleared', function(event) {
                    element.find("#imageeditor").css('display', 'none');
                });
            }, 0);
        }
    };
}]);

monadexDirectives.directive('textEditor', ['$timeout', 'canvasService', function($timeout, canvasService){
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'partials/text-editor.html',
        link: function(scope, element, attrs) {
            $timeout(function() {
                element.find('#text-fontcolor').miniColors({
                    change: function(hex, rgb) {
                        var color = $(this).value;
                        canvasService.renderActiveTextFontColor(color);
                    },
                    open: function(hex, rgb) {
                        //
                    },
                    close: function(hex, rgb) {
                        //
                    }
                });

                element.find('#text-bgcolor').miniColors({
                    change: function(hex, rgb) {
                        var color = $(this).value;
                        canvasService.renderActiveTextBgColor(color);
                    },
                    open: function(hex, rgb) {
                        //
                    },
                    close: function(hex, rgb) {
                        //
                    }
                });

                element.find('#text-strokecolor').miniColors({
                    change: function(hex, rgb) {
                        var color = $(this).value;
                        canvasService.renderActiveTextStrokeColor(color);
                    },
                    open: function(hex, rgb) {
                        //
                    },
                    close: function(hex, rgb) {
                        //
                    }
                });

                element.find("#font-family").change(function() {
                    var font = $(this).value;
                    canvasService.changeTextFontFamily(font);
                });

                element.find("#text-bold").click(canvasService.toggleActiveTextBold);
                element.find("#text-italic").click(canvasService.toggleActiveTextItalic);
                element.find("#text-strike").click(canvasService.toggleActiveTextStrike);
                element.find("#text-underline").click(canvasService.toggleActiveTextUnderline);
                element.find("#text-left").click(function() {
                    canvasService.setActiveTextAlignment('left');
                });
                element.find("#text-center").click(function() {
                    canvasService.setActiveTextAlignment('center');
                });
                element.find("#text-right").click(function() {
                    canvasService.setActiveTextAlignment('right');
                });

                scope.$on('mdeTextObjectSelected', function(event, props) {
                    element.find("#texteditor").css('display', 'block');
                    element.find('#text-fontcolor').miniColors('value', props.fontColor);
                    element.find('#text-strokecolor').miniColors('value', props.strokeStyle);
                });

                scope.$on('mdeImageObjectSelected', function(event, props) {
                    element.find("#texteditor").css('display', 'none');
                });

                scope.$on('mdeObjectCleared', function(event) {
                    element.find("#texteditor").css('display', 'none');
                });
            }, 0);
        }
    };
}]);
