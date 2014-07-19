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
monadexDirectives.directive('mdCheckoutPanel', ['$timeout',
   function($timeout) {
       return {
           restrict: 'E',
           scope: {
           },
           templateUrl: 'partials/tshirt-designer-pages/checkout-panel.html'
       };
   }
]);

// TODO: more work needs to be done here. checkout panel should
//       reflect the real price.
monadexDirectives.directive('mdTshirtGoodiesPanel', ['$timeout',
   function($timeout) {
       return {
           restrict: 'E',
           scope: {
               colors: "=",
               images: '=',
               fonts: "=",
               tshirtTypes: '=tshirttypes'
           },
           templateUrl: 'partials/tshirt-designer-pages/tshirt-goodies-panel.html',
           link: function(scope, element) {
               element.find(".tab-link").click(function(event) {
                   event.preventDefault();
               });
           }
       };
   }
]);

monadexDirectives.directive('mdTshirtDesignAssistant', ['$timeout',
   function($timeout) {
       return {
           restrict: 'E',
           scope: {
           },
           templateUrl: 'partials/tshirt-designer-pages/tshirt-design-assistant.html',
           link: function(scope, element, attrs) {
               $timeout(function() {
                   element.find(".clearfix button,a").tooltip();
               }, 0);
           }
       };
   }
]);

monadexDirectives.directive('mdTshirtCanvas', ['$timeout', 'canvasService',
    function($timeout, canvasService) {
        var canvas;
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/tshirt-designer-pages/tshirt-canvas.html',
            link: function(scope, element, attrs) {
                // initialize the canvasService
                canvasService.init('tcanvas', "#tshirtFacing");
                $timeout(function() {
                    element.find("#drawingArea").hover(
                        canvasService.addCanvasBorder,
                        canvasService.removeCanvasBorder
                    );

                    element.find('#flip').click(function() {
                        var flipText = element.find('#flip-text');
                        if (flipText.text()==="Show Back View") {
                            flipText.text('Show Front View');
                            canvasService.flip("img/crew_back.png");
                        } else {
                            flipText.text('Show Back View');
                            canvasService.flip("img/crew_front.png");
                        }
                    });

                    scope.$on('mdeChangeBackground', function(event, color) {
                        element.find("#shirtDiv").css("backgroundColor", color);
                    });
                }, 0);
            }
        };
    }
]);

// currently not used
monadexDirectives.directive('mdBgColorPicker', ['$timeout', 'canvasService',
    function($timeout, canvasService){
        return {
            restrict: 'E',
            scope: {
                colors: '='
            },
            templateUrl: 'partials/tshirt-designer-pages/bg-color-picker.html',
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

monadexDirectives.directive('mdTextInput', ['$timeout', 'canvasService',
    function($timeout, canvasService){
        return {
            restrict: 'E',
            scope: {
                fonts: "="
            },
            templateUrl: 'partials/tshirt-designer-pages/text-input.html',
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

                    element.find('#add-text').on("click", function(){
                        var text = $("#text-string").val();
                        canvasService.addTextWhenNoActiveText(text);
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

                    element.find(".font-family-picker").change(
                        function(event) {
                            var sclass = ".font-family-picker option:selected",
                                selected = element.find(sclass)[0],
                                font = $(selected).text();

                            canvasService.changeTextFontFamily(font);
                            event.preventDefault();
                        }
                    );

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

                        element.find('#text-fontcolor').minicolors(
                            'value', props.fontColor
                        );

                        element.find('#text-bgcolor').minicolors(
                            'value', props.backgroundColor
                        );
                    });

                    scope.$on('mdeObjectCleared', function(event) {
                        element.find("#text-string").val("");
                    });
                }, 0);
            }
        };
    }
]);

monadexDirectives.directive('mdImagePage', ['$timeout', 'canvasService',
    function($timeout, canvasService){
        return {
            restrict: 'E',
            scope: {
                images: "="
            },
            templateUrl: 'partials/tshirt-designer-pages/image-page.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.find(".img-thumbnail").on("click", function(e){
                        var el = e.target;
                        canvasService.addImage(el.src);
                    });
                }, 0);
            }
        };
    }
]);

monadexDirectives.directive('mdImagePicker',
                            ['$timeout', '$compile', 'canvasService',
    function($timeout, $compile, canvasService){
        return {
            restrict: 'E',
            scope: {
                images: "=",
                popover: '@'
            },
            templateUrl: 'partials/tshirt-designer-pages/image-picker.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.find('#image-picker').popover({
                        trigger: "click",
                        html: true,
                        container: 'body',
                        content: function() {
                            // compile the html in popover attributes and set it
                            // as the content of the popover
                            var popoverContent = $compile(scope.popover)(scope);
                            return popoverContent;
                        }
                    });
                }, 0);
            }};
    }
]);

// This editor is used to remove the active objects (text or images) or
// flip the t-shirt canvas
monadexDirectives.directive('mdCanvasObjTrash', ['$timeout', 'canvasService',
    function($timeout, canvasService){
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/tshirt-designer-pages/md-canvas-obj-trash.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.find('#remove-selected').click(
                        canvasService.removeSelected
                    );

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
