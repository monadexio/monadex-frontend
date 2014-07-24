'use strict';

/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
var myService = angular.module('monadexApp.services', []);

myService.value('version', '0.0.1');

myService.service("canvasService", ['$rootScope',
    function($rootScope) {
        var canvas;

        // Variables related to the demarcation lines for the
        // Drawing area.
        var DrawAreaWidth   = 200,
            DrawAreaHeight  = 400,
            UpperLeftPoint  = [0, 0],
            UpperRightPoint = [DrawAreaWidth, 0],
            DownLeftPoint   = [0, DrawAreaHeight],
            DownRightPoint  = [DrawAreaWidth, DrawAreaHeight],
            LineWidthOffset = 1,
            lineProps = {
                "stroke":"#000000",
                "strokeWidth":1,
                hasBorders:false,
                hasControls:false,
                hasRotatingPoint:false,
                selectable:false
            },
            lineL, lineR, lineU, lineD;

        // Position for the newly added text
        var newTextTop = 50;

        var offsetXFun = function(Point, OffsetVal) {
            return [Point[0]-OffsetVal, Point[1]];
        };

        var offsetYFun = function(Point, OffsetVal) {
            return [Point[0], Point[1]-OffsetVal];
        };

        var fabricLineFun = function(Point1, Point2) {
            return new fabric.Line(Point1.concat(Point2), lineProps);
        };

        lineL = fabricLineFun(
            offsetXFun(UpperLeftPoint, 1),
            offsetXFun(DownLeftPoint, 1)
        );
        lineR = fabricLineFun(
            offsetXFun(UpperRightPoint, 1),
            offsetXFun(DownRightPoint, 1)
        );
        lineU = fabricLineFun(
            offsetYFun(UpperRightPoint, 1),
            offsetYFun(UpperLeftPoint, 1)
        );
        lineD = fabricLineFun(
            offsetYFun(DownLeftPoint, 1),
            offsetYFun(DownRightPoint, 1)
        );

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

            canvas.cursorMap = [
                'n-resize',
                '-webkit-grab',
                'e-resize',
                '-webkit-grab',
                's-resize',
                'pointer',
                'w-resize',
                '-webkit-grab'
            ];

            canvas._getActionFromCorner = function(target, corner) {
                var action = 'drag';
                if (corner) {
                    action = (corner === 'ml' || corner === 'mr')
                        ? 'scaleX'
                        : (corner === 'mt' || corner === 'mb')
                            ? 'scaleY'
                            : (corner === 'tr' || corner === 'mtr')
                                ? 'rotate'
                                : corner === 'bl'
                                    ? 'delete'
                                    : corner === 'tl'
                                        ? 'drag'
                                        : 'scale';
                }
                return action;
            };


            canvas._setupCurrentTransform = function(e, target) {
                var degreesToRadians = fabric.util.degreesToRadians;

                if (!target) return;

                var pointer = this.getPointer(e),
                corner = target._findTargetCorner(pointer),
                action = this._getActionFromCorner(target, corner),
                origin = this._getOriginFromCorner(target, corner);

                this._currentTransform = {
                    target: target,
                    action: action,
                    scaleX: target.scaleX,
                    scaleY: target.scaleY,
                    offsetX: pointer.x - target.left,
                    offsetY: pointer.y - target.top,
                    originX: origin.x,
                    originY: origin.y,
                    ex: pointer.x,
                    ey: pointer.y,
                    left: target.left,
                    top: target.top,
                    theta: degreesToRadians(target.angle),
                    width: target.width * target.scaleX,
                    mouseXSign: 1,
                    mouseYSign: 1
                };

                this._currentTransform.original = {
                    left: target.left,
                    top: target.top,
                    scaleX: target.scaleX,
                    scaleY: target.scaleY,
                    originX: origin.x,
                    originY: origin.y
                };

                this._resetCurrentTransform(e);
                if(action === 'delete') {
                    this.remove(target);
                }
            };

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
                                fontColor: selectedObject.fill,
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

        var addText = function(text, fontColor, fontFamily) {
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
                    scaleX: 0.5,
                    scaleY: 0.5,
                    textAlign: "center",
                    fontWeight: '',
                    hasRotatingPoint: true
                }
            );

            textSample.setControlVisible('mtr', false);
            textSample.lockUniScaling = true;
            textSample.centeredScaling = true;

            canvas.add(textSample);
            canvas.item(canvas.item.length-1).hasRotatingPoint = true;
        };

        this.addTextWhenNoActiveText =
            function(text, fontColor, fontFamily) {
                var activeObject = canvas.getActiveObject();
                if (!activeObject || activeObject.type != 'text') {
                    addText(text, fontColor, fontFamily);
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

                image.setControlVisible('mtr', false);
                image.centeredScaling = true;
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
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
                if(text === "") {
                    canvas.remove(activeObject);
                } else {
                    activeObject.text = text;
                    activeObject.left = (DrawAreaWidth - activeObject.width)/2;
                }
                canvas.renderAll();
            }
        };

        this.renderActiveTextFontColor = function(color) {
            applyToActiveTextFun(function(activeObject) {
                activeObject.fill = color;
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
