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
                             'campaignInfoAccumulatorService',
   function($timeout, $compile, canvasService, campaignInfoAccumulatorService) {
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

                   var setInitBaseCostAndUnit = function() {
                       var baseCostNum = element.find('.tshirt-variant').
                               attr("basecost"),
                           unit = element.find('.tshirt-variant').attr("unit"),
                           baseCost = [baseCostNum, unit].join(" ");

                       element.find("#baseCostLabel").text(baseCost);
                       campaignInfoAccumulatorService.setBaseCost(baseCost);
                   };

                   var setAvailableColorsFun = function() {
                       element.find('.tshirt-variant').click(function() {
                           canvasService.setAvailableBgColors(eval(
                               $(this).attr("colors")
                           ));
                       });
                   };

                   var setBaseCostAndUnitFun = function() {
                       element.find('.tshirt-variant').click(function() {
                           var baseCostNum = $(this).attr("basecost"),
                               unit = $(this).attr("unit"),
                               baseCost = [baseCostNum, unit].join(" ");

                           element.find("#baseCostLabel").text(baseCost);
                           campaignInfoAccumulatorService.setBaseCost(baseCost);
                       });
                   };

                   var setInitTshirtVariant = function() {
                       var name = element.find('.tshirt-variant').attr("name");
                       campaignInfoAccumulatorService.setTshirtVariant(name);
                   };

                   var setTshirtVariantFun = function() {
                       element.find('.tshirt-variant').click(function() {
                           var name = $(this).attr("name");
                           campaignInfoAccumulatorService.setTshirtVariant(
                               name
                           );
                       });
                   };

                   // set up the available colors
                   var setupColor = function() {
                       scope.$apply(setInitColor);
                       setAvailableColorsFun();
                   };

                   // set up the base cost
                   var setupBaseCost = function() {
                       setInitBaseCostAndUnit();
                       setBaseCostAndUnitFun();
                   };

                   // set up the tshirt variants
                   var setupTshirtVariant = function() {
                       setInitTshirtVariant();
                       setTshirtVariantFun();
                   };

                   setupColor();
                   setupBaseCost();
                   setupTshirtVariant();

                   element.find('#tshirt-type-selector').change(function(e) {
                       setupColor();
                       setupBaseCost();
                       setupTshirtVariant();
                   });

                   element.find('#designNextStep').click(function(e) {
                       canvasService.saveCanvas();

                       if(canvasService.isEmptyCanvas()) {
                           element.find("#emptyCanvasModal").modal('show');
                           e.preventDefault();
                       } else {
                           // when leaving the designer save the canvas
                           // TODO: set it to read only as well. setting
                           // canvas.selection = false doesn't seem to work.
                           campaignInfoAccumulatorService.setTshirtType(
                               scope.currentTshirtType
                           );

                           canvasService.disableEdit();
                       }
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
                canvasService.init('tcanvas', "#tshirtFacing", "#shirtDiv");
                $timeout(function() {
                    element.find("#drawingArea").hover(
                        canvasService.addCanvasBorder,
                        canvasService.removeCanvasBorder
                    );

                    element.find('#flip').click(function() {
                        var flipText = element.find('#flip-text');
                        if (flipText.text()==="Show Back View") {
                            flipText.text('Show Front View');
                            canvasService.flipBack();
                        } else {
                            flipText.text('Show Back View');
                            canvasService.flipFront();
                        }
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

monadexDirectives.directive('mdSalesGoalPanel',
                            ['$timeout', 'campaignInfoAccumulatorService',
    function($timeout, campaignInfoAccumulatorService){
        return {
            restrict: 'E',
            scope: {
                tshirtsSalesGoal: "=",
                tshirtsSalesGoalMin: "=",
                tshirtsSalesGoalMax: "=",
                tshirtPrice: "="
            },
            templateUrl: 'partials/sales_goal/sales-goal-panel.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    var sliderElem = element.find("#numOfTshirtSlider"),
                        numInputElem = element.find("#numOfTshirtInput"),
                        priceInputElem = element.find("#priceOfTshirtInput"),
                        slider = sliderElem.slider({}),
                        NotAvailable = "N/A",
                        baseCost = campaignInfoAccumulatorService.getBaseCost(),
                        profitFun = function(price) {
                            var profit = price - parseInt(baseCost);
                            if (profit > 0) {
                                return profit;
                            } else {
                                return 0;
                            }
                        },
                        displayProfitFun = function(price, goal) {
                            element.find('#estimatedProfitTag').text(
                                profitFun(price) * goal
                            );
                        };

                    // init the input value
                    numInputElem.val(slider.slider('getValue'));

                    sliderElem.on('slideStop', function(e) {
                        scope.$apply(function() {
                           scope.tshirtsSalesGoal = e.value;
                        });

                        displayProfitFun(
                            scope.tshirtPrice,
                            scope.tshirtsSalesGoal
                        );
                    });

                    numInputElem.keyup(function(e) {
                        var val = Number($(this)[0].value);
                        if (isNaN(val)) {
                            slider.slider(
                                'setValue',
                                scope.tshirtsSalesGoalMin
                            );

                            displayProfitFun(
                                scope.tshirtPrice,
                                scope.tshirtsSalesGoalMin
                            );
                        } else {
                            slider.slider('setValue', val);
                            displayProfitFun(scope.tshirtPrice, val);
                        }
                    });

                    // Display the base cost, the initial profit per tshirt
                    // and the total estimated profit.
                    element.find('#baseCostTag').text(
                        baseCost === null ? NotAvailable : baseCost
                    );

                    element.find('#profitPerTshirt').text(
                        profitFun(scope.tshirtPrice)
                    );

                    displayProfitFun(
                        scope.tshirtPrice,
                        scope.tshirtsSalesGoal
                    );

                    priceInputElem.keyup(function(e) {
                        var val = Number($(this)[0].value);
                        if (isNaN(val)) {
                            element.find('#profitPerTshirt').text(
                                NotAvailable
                            );
                            element.find('#estimatedProfitTag').text(
                                NotAvailable
                            );
                        } else {
                            var profit = profitFun(val);
                            element.find('#profitPerTshirt').text(
                                profit
                            );
                            element.find('#estimatedProfitTag').text(
                                profit * scope.tshirtsSalesGoal
                            );

                        }
                    });

                   element.find('#salesGoalNextStep').click(function(e) {
                       campaignInfoAccumulatorService.setSalesGoal(
                           scope.tshirtsSalesGoal
                       );
                       campaignInfoAccumulatorService.setSalesGoal(
                           scope.tshirtPrice
                       );
                   });
                }, 0);
            }
        };
    }
]);

monadexDirectives.directive('mdCampaignDetailsPanel', ['$timeout',
    function($timeout){
        return {
            restrict: 'E',
            scope: {
                campaignTitle: "=",
                campaignDescription: "=",
                campaignLengths: "=",
                campaignUrl: "="
            },
            templateUrl: 'partials/campaign_details/campaign-details-panel.html',
            link: function(scope, element, attrs) {
                $timeout(function() {
                   element.find('#campaignDetailNextStep').click(function(e) {
                       var status = "ok",
                           verifyEmptyFun = function(field, warningId) {
                               if(!field) {
                                   element.find(warningId).removeClass('hide');
                                   status = "not_ok";
                               } else {
                                   element.find(warningId).addClass('hide');
                               }
                           };

                       [{
                           field: scope.campaignTitle,
                           warningId: '#titleWarning'
                        },
                        {
                            field: scope.campaignDescription,
                            warningId: '#descriptionWarning'
                        },
                        {
                            field: scope.campaignUrl,
                            warningId: '#urlWarning'
                        },
                       ].forEach(function(obj) {
                           verifyEmptyFun(obj.field, obj.warningId);
                       });

                       if(status === "not_ok") {
                           e.preventDefault();
                       }
                   });
                }, 0);
            }
        };
    }
]);
