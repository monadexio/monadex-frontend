'use strict';

/* Directives */
var monadexDirectives = angular.module('monadexApp.directives', []);

monadexDirectives.directive('appVersion', ['version',
    function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }
]);

// TODO: more work needs to be done here. checkout panel should
//       reflect the real price.
monadexDirectives.directive('checkoutPanel', ['$timeout',
   function($timeout) {
       return {
           restrict: 'E',
           scope: {
           },
           templateUrl: 'partials/checkout-panel.html'
       };
   }
]);

// TODO: more work needs to be done here. checkout panel should
//       reflect the real price.
monadexDirectives.directive('tshirtGoodiesPanel', ['$timeout',
   function($timeout) {
       return {
           restrict: 'E',
           scope: {
               colors: "=",
               images: '=',
               tshirtTypes: '=tshirttypes'
           },
           templateUrl: 'partials/tshirt-goodies-panel.html',
           link: function(scope, element) {
               element.find(".tab-link").click(function(event) {
                   event.preventDefault();
               });
           }
       };
   }
]);

monadexDirectives.directive('tshirtDesignAssistant', ['$timeout',
   function($timeout) {
       return {
           restrict: 'E',
           scope: {
               fonts: '='
           },
           templateUrl: 'partials/tshirt-design-assistant.html',
           link: function(scope, element, attrs) {
               $timeout(function() {
                   element.find(".clearfix button,a").tooltip();
               }, 0);
           }
       };
   }
]);

monadexDirectives.directive('tshirtCanvas', ['$timeout', 'canvasService',
    function($timeout, canvasService) {
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
                    element.find("#drawingArea").hover(
                        canvasService.addCanvasBorder,
                        canvasService.removeCanvasBorder
                    );

                    scope.$on('mdeChangeBackground', function(event, color) {
                        element.find("#shirtDiv").css("backgroundColor", color);
                    });
                }, 0);
            }
        };
    }
]);

monadexDirectives.directive('bgColorPicker', ['$timeout', 'canvasService',
    function($timeout, canvasService){
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
    }
]);

monadexDirectives.directive('textInput', ['$timeout', 'canvasService',
    function($timeout, canvasService){
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/text-input.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.find('#add-text').on("click", function(){
                        var text = $("#text-string").val();
                        canvasService.addTextWhenNoActiveText(text);
                    });

                    element.find("#text-string").keyup(function(e){
                        var text;
                        var enterKeyCode = 13;
                        if(e.which === enterKeyCode) {
                            // click enter should have the same effect as
                            // clicking the #add-text button.
                            element.find('#add-text').trigger("click");
                            element.find('#add-text').focus();
                        } else {
                            text = $(this)[0].value;
                            canvasService.renderActiveTextContent(text);
                        }
                    });

                    scope.$on('mdeTextObjectSelected', function(event, props) {
                        element.find("#text-string").val(props.text);
                    });

                    scope.$on('mdeObjectCleared', function(event) {
                        element.find("#text-string").val("");
                    });
                }, 0);
            }
        };
    }
]);

monadexDirectives.directive('imagePicker', ['$timeout', 'canvasService',
    function($timeout, canvasService){
        return {
            restrict: 'E',
            scope: {
                images: '='
            },
            templateUrl: 'partials/image-picker.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.find(".img-thumbnail").on("click", function(e){
                        var el = e.target;
                        canvasService.addImage(el.src);
                    });
                }, 0);
            }};
    }
]);

// this editor is used to remove the active objects (text or images) or
// flip the t-shirt canvas
monadexDirectives.directive('canvasCommonEditor', ['$timeout', 'canvasService',
    function($timeout, canvasService){
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/canvas-common-editor.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.find('#remove-selected').click(
                        canvasService.removeSelected
                    );

                    element.find('#flip').click(function() {
                        if (element.find('#flip').attr("data-original-title") ==
                            "Show Back View") {
                            element.find('#flip').attr(
                                'data-original-title',
                                'Show Front View'
                            );

                            canvasService.flip("img/crew_back.png");
                        } else {
                            element.find('#flip').attr(
                                'data-original-title',
                                'Show Back View'
                            );

                            canvasService.flip("img/crew_front.png");
                        }
                    });

                    scope.$on('mdeTextObjectSelected', function(event, props) {
                        element.find("#imageeditor").css('display', 'block');
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
    }
]);

monadexDirectives.directive('textStyleEditor', ['$timeout', 'canvasService',
    function($timeout, canvasService){
        return {
            restrict: 'E',
            scope: {
                fonts: '='
            },
            templateUrl: 'partials/text-style-editor.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.find('#text-fontcolor').minicolors({
                        change: function(hex, opacity) {
                            canvasService.renderActiveTextFontColor(hex);
                        }
                    });

                    element.find('#text-bgcolor').minicolors({
                        change: function(hex, opacity) {
                            canvasService.renderActiveTextBgColor(hex);
                        }
                    });

                    element.find(".font-family-picker").click(function(event) {
                        var font = $(this).text();
                        canvasService.changeTextFontFamily(font);

                        event.preventDefault();
                    });

                    element.find("#text-bold").click(
                        canvasService.toggleActiveTextBold
                    );

                    element.find("#text-italic").click(
                        canvasService.toggleActiveTextItalic
                    );

                    element.find("#text-underline").click(
                        canvasService.toggleActiveTextUnderline
                    );

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
                        element.find('#text-fontcolor').minicolors(
                            'value', props.fontColor
                        );
                        element.find('#text-bgcolor').minicolors(
                            'value', props.backgroundColor
                        );
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
    }
]);
