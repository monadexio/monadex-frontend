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

// Style and quality panel let the customer choose the style of the
// t-shirts with various qualities.
monadexDirectives.directive('mdTshirtStyleQualityPanel',
                            ['$timeout', '$compile', 'canvasService',
   function($timeout, $compile, canvasService) {
       return {
           restrict: 'E',
           scope: {
               tshirtTypes: '=',
               baseCost: "=",
               colors: "="
           },
           templateUrl: 'partials/designer/tshirt-style-quality-panel.html',
           link: function(scope, element, attrs) {
               $timeout(function() {
                   var setInitColor = function() {
                       var col = element.find('.tshirt-variant').attr("colors");
                       scope.colors = eval(col);
                   };
                   var setAvailableColorsFun = function() {
                       element.find('.tshirt-variant').click(function() {
                           canvasService.setAvailableBgColors(eval(
                               $(this).attr("colors")
                           ));
                       });
                   };

                   scope.$apply(setInitColor);
                   setAvailableColorsFun();

                   element.find('#tshirt-type-selector').change(function(e) {
                       scope.$apply(function() {
                           setInitColor();
                           setAvailableColorsFun();
                       });
                   });

                   scope.$on('mdeBgAvailableColorsChanged', function(e, o) {
                       scope.$apply(function() {
                           scope.colors = o.colors;
                       });
                   });
               }, 0);
           }
       };
   }
]);

monadexDirectives.directive('mdTshirtDesignPanel', ['$timeout',
   function($timeout) {
       return {
           restrict: 'E',
           scope: {
               colors: "=",
               images: '=',
               fonts: "="
           },
           templateUrl: 'partials/designer/tshirt-design-panel.html',
           link: function(scope, element) {
               $timeout(function() {
                   element.find(".tab-link").click(function(event) {
                       event.preventDefault();
                   });
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
            templateUrl: 'partials/designer/tshirt-canvas.html',
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
            templateUrl: 'partials/designer/bg-color-picker.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    scope.$watch("colors", function() {
                        element.find('.color-preview').on("click", function(){
                            var color = $(this).css("background-color");
                            canvasService.changeBackground(color);
                        });
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
            templateUrl: 'partials/designer/text-input.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.find('#text-fontcolor').minicolors({
                        change: function(hex) {
                            canvasService.renderActiveTextFontColor(hex);
                        }
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
                        var text = $(this)[0].value;

                        if(canvasService.activeTextP()) {
                            canvasService.renderActiveTextContent(text);
                        } else if (text != "") {
                            var miniColorValFun = function(sel) {
                                return element.find(sel).minicolors("value");
                            },
                                fontColor = miniColorValFun('#text-fontcolor'),
                                sfClass = ".font-family-picker option:selected",
                                sFontObj = element.find(sfClass)[0],
                                fontFamily = $(sFontObj).text();

                            canvasService.addTextWhenNoActiveText(
                                text, fontColor, fontFamily
                            );
                            canvasService.setTheLastObjActive();
                        }
                    });

                    scope.$on('mdeTextObjectSelected', function(event, props) {
                        element.find("#text-string").val(props.text);

                        element.find('#text-fontcolor').minicolors(
                            'value', props.fontColor
                        );

                        var index = undefined;
                        for(var i=0; i<scope.fonts.length; i++) {
                            if (scope.fonts[i].name.toLowerCase() ==
                                props.fontFamily.toLowerCase()) {
                                index = i;
                            }
                        }

                        element.find(".font-family-picker").val(index || 0);
                    });

                    scope.$on('mdeObjectCleared', function(event) {
                        element.find("#text-string").val("");
                        element.find('#text-fontcolor').minicolors(
                            'value', "#000000"
                        );

                        element.find(".font-family-picker").val(0);
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
            templateUrl: 'partials/designer/image-page.html',
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

monadexDirectives.directive('mdSalesGoal', ['$timeout',
    function($timeout){
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/campaign/sales-goal.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    var sliderElem = element.find("#numOfTshirtSlider"),
                        numInputElem = element.find("#numOfTshirtInput"),
                        priceInputElem = element.find("#priceOfTshirtInput"),
                        slider = sliderElem.slider({});

                    // init the input value
                    numInputElem.val(slider.slider('getValue'));
                    priceInputElem.val("80");

                    sliderElem.on('slideStop', function(e) {
                        numInputElem.val(e.value);
                    });

                    numInputElem.keyup(function(e) {
                        var val = Number($(this)[0].value);
                        slider.slider('setValue', val);
                    });

                    priceInputElem.keyup(function(e) {
                        var val = Number($(this)[0].value);
                        if (isNaN(val)) {
                            element.find('#profitPerTshirt').text("0");
                        } else {
                            console.log("not equal nan");
                            element.find('#profitPerTshirt').text(val);
                        }
                    });
                }, 0);
            }
        };
    }
]);

monadexDirectives.directive('mdCampaignDetails', ['$timeout',
    function($timeout){
        return {
            restrict: 'E',
            scope: {
                campaignLengths: "="
            },
            templateUrl: 'partials/details/campaign-details.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                }, 0);
            }
        };
    }
]);
