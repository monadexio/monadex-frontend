'use strict';

/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
var myService = angular.module('monadexApp.services', []);

myService.value('version', '0.0.1');

myService.service("canvasService", ['$rootScope',
    function($rootScope) {
        var canvas;
        // line Left, Right, Up and Down
        var lineL, lineR, lineU, lineD;

        var lineProps = {
            "stroke":"#000000",
            "strokeWidth":1,
            hasBorders:false,
            hasControls:false,
            hasRotatingPoint:false,
            selectable:false
        };

        lineL = new fabric.Line([0,0,200,0], lineProps);
        lineR = new fabric.Line([199,0,200,399], lineProps);
        lineU = new fabric.Line([0,0,0,400], lineProps);
        lineD = new fabric.Line([0,400,200,399], lineProps);

        // return the canvas instance
        this.getCanvas = function() {
            return canvas;
        };

        this.init = function(canvasid, imageId) {
            console.log("initialize...");

            this.imageId = imageId;
            this.prevCanvas = null;

            canvas = new fabric.Canvas(canvasid, {
                hoverCursor: 'pointer',
                selection: true,
                selectionBorderColor:'blue'
            });

            canvas.on({
                'object:moving': function(e) {
                    e.target.opacity = 0.5;
                },
                'object:modified': function(e) {
                    e.target.opacity = 1;
                },
                'object:selected': function(e) {
                    var selectedObject = e.target;
                    selectedObject.hasRotatingPoint = true;
                    if (selectedObject &&
                        selectedObject.type === 'text') {
                        $rootScope.$broadcast(
                            'mdeTextObjectSelected',
                            {
                                text: selectedObject.getText(),
                                fontColor: selectedObject.fill || '#000000',
                                backgroundColor: selectedObject.backgroundColor,
                                fontFamily: selectedObject.fontFamily
                            }
                        );
                    } else if (selectedObject &&
                               selectedObject.type === 'image'){
                        $rootScope.$broadcast('mdeImageObjectSelected');
                    };
                },
                'selection:cleared': function(e) {
                    $rootScope.$broadcast('mdeObjectCleared');
                }
            });

            // piggyback on `canvas.findTarget`,
            // to fire "object:over" and "object:out" events
            canvas.findTarget = (function(originalFn) {
                return function() {
                    var target = originalFn.apply(this, arguments);
                    if (target) {
                        if (this._hoveredTarget !== target) {
                            canvas.fire('object:over', { target: target });
                            if (this._hoveredTarget) {
                                canvas.fire('object:out', {
                                    target: this._hoveredTarget
                                });
                            }
                            this._hoveredTarget = target;
                        }
                    }
                    else if (this._hoveredTarget) {
                        canvas.fire('object:out', {
                            target: this._hoveredTarget
                        });
                        this._hoveredTarget = null;
                    }
                    return target;
                };
            })(canvas.findTarget);

            canvas.on('object:over', function(e) {
                //e.target.setFill('red');
                //canvas.renderAll();
            });

            canvas.on('object:out', function(e) {
                //e.target.setFill('green');
                //canvas.renderAll();
            });
        };

        this.addText = function(text, fontColor, bgColor, fontFamily) {
            var textSample = new fabric.Text(
                text,
                {
                    //left: fabric.util.getRandomInt(0, 200),
                    //top: fabric.util.getRandomInt(0, 400),
                    left: 80,
                    top: 50,
                    fontFamily: fontFamily,
                    angle: 0,
                    fill: fontColor,
                    backgroundColor: bgColor,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    fontWeight: '',
                    hasRotatingPoint: true
                }
            );

            canvas.add(textSample);
            canvas.item(canvas.item.length-1).hasRotatingPoint = true;
        };

        this.addTextWhenNoActiveText =
            function(text, fontColor, backgroundColor, fontFamily) {
                var activeObject = canvas.getActiveObject();
                if (!activeObject || activeObject.type != 'text') {
                    this.addText(text, fontColor, backgroundColor, fontFamily);
                }
            };

        this.activeTextP = function() {
            var activeObject = canvas.getActiveObject();
            return activeObject && activeObject.type == 'text';
        };

        this.setTheLastObjActive = function() {
            canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
        };

        this.addImage = function(ImgSrc) {
            /*temp code*/
            var offset = 50;
            var left = fabric.util.getRandomInt(0 + offset, 200 - offset);
            var top = fabric.util.getRandomInt(0 + offset, 400 - offset);
            var angle = fabric.util.getRandomInt(-20, 40);
            var width = fabric.util.getRandomInt(30, 50);
            var opacity = (function(min, max){
                return Math.random() * (max - min) + min;
            })(0.5, 1);

            fabric.Image.fromURL(ImgSrc, function(image) {
                image.set(
                    {
                        left: left,
                        top: top,
                        angle: 0,
                        padding: 10,
                        cornersize: 10,
                        hasRotatingPoint:true
                    }
                );

                canvas.add(image);
            });
        };

        this.removeSelected = function() {
            var activeObject = canvas.getActiveObject(),
                activeGroup = canvas.getActiveGroup();
            if (activeObject) {
                canvas.remove(activeObject);
                $("#text-string").val("");
            }
            else if (activeGroup) {
                var objectsInGroup = activeGroup.getObjects();
                canvas.discardActiveGroup();
                objectsInGroup.forEach(function(object) {
                    canvas.remove(object);
                });
            }
        };

        this.flip = function(imageSrc) {
            var currentCanvas;

            $(this.imageId).attr("src", imageSrc);
            currentCanvas = JSON.stringify(canvas);
            canvas.clear();

            if(this.prevCanvas != null) {
                canvas.loadFromJSON(
                    this.prevCanvas,
                    canvas.renderAll.bind(canvas)
                );
            }

            this.prevCanvas = currentCanvas;
        };

        this.changeBackground = function(color) {
            $rootScope.$broadcast('mdeChangeBackground', color);
        };

        this.addCanvasBorder = function() {
           [lineL, lineR, lineU, lineD].map(function(elem) {
                canvas.add(elem);
            });
            canvas.renderAll();
        };

        this.removeCanvasBorder = function() {
           [lineL, lineR, lineU, lineD].map(function(elem) {
                canvas.remove(elem);
            });
            canvas.renderAll();
        };

        var applyToActiveTextFun = function(Fun) {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
                Fun(activeObject);
                canvas.renderAll();
            }
        };

        this.renderActiveTextContent = function(text) {
            applyToActiveTextFun(function(activeObject) {
                activeObject.text = text;
            });
        };

        this.renderActiveTextFontColor = function(color) {
            applyToActiveTextFun(function(activeObject) {
                activeObject.fill = color;
            });
        };

        this.renderActiveTextBgColor = function(color) {
            applyToActiveTextFun(function(activeObject) {
                activeObject.backgroundColor = color;
            });
        };

        this.changeTextFontFamily = function(font) {
            applyToActiveTextFun(function(activeObject) {
                activeObject.fontFamily = font;
            });
        };

        this.toggleActiveTextBold = function() {
            applyToActiveTextFun(function(activeObject) {
                activeObject.fontWeight = (
                    activeObject.fontWeight == 'bold' ? '' : 'bold'
                );
            });
        };

        this.toggleActiveTextItalic = function() {
            applyToActiveTextFun(function(activeObject) {
                activeObject.fontStyle = (
                    activeObject.fontStyle == 'italic' ? '' : 'italic'
                );
            });
        };

        this.toggleActiveTextStrike = function() {
            applyToActiveTextFun(function(activeObject) {
                activeObject.textDecoration = (
                    activeObject.textDecoration ==
                        'line-through' ? '' : 'line-through'
                );
            });
        };

        this.toggleActiveTextUnderline = function() {
            applyToActiveTextFun(function(activeObject) {
                activeObject.textDecoration = (
                    activeObject.textDecoration ==
                        'underline' ? '' : 'underline'
                );
            });
        };

        this.setActiveTextAlignment = function(position) {
            applyToActiveTextFun(function(activeObject) {
                activeObject.textAlign = position;
            });
        };
    }
]);
