'use strict';

/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
var myService = angular.module('monadexApp.services', []);

myService.value('version', '0.0.1');

myService.service("canvasService", ['$rootScope', function($rootScope) {
    var canvas;
    // line Left, Right, Up and Down
    var lineL, lineR, lineU, lineD;

    lineL = new fabric.Line([0,0,200,0], {"stroke":"#000000", "strokeWidth":1,hasBorders:false,hasControls:false,hasRotatingPoint:false,selectable:false});
    lineR = new fabric.Line([199,0,200,399], {"stroke":"#000000", "strokeWidth":1,hasBorders:false,hasControls:false,hasRotatingPoint:false,selectable:false});
    lineU = new fabric.Line([0,0,0,400], {"stroke":"#000000", "strokeWidth":1,hasBorders:false,hasControls:false,hasRotatingPoint:false,selectable:false});
    lineD = new fabric.Line([0,400,200,399], {"stroke":"#000000", "strokeWidth":1,hasBorders:false,hasControls:false,hasRotatingPoint:false,selectable:false});

    // return the canvas instance
    this.getCanvas = function() {
        return canvas;
    };

    this.init = function(canvasid, imageId) {
        console.log("initialize...");

        this.imageId = imageId;

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
                if (selectedObject && selectedObject.type === 'text') {
                    $rootScope.$broadcast('mdeTextObjectSelected',
                                         { text: selectedObject.getText(),
                                           fontColor: selectedObject.fill,
                                           strokeStyle: selectedObject.strokeStyle
                                         });
                }
                else if (selectedObject && selectedObject.type === 'image'){
                    $rootScope.$broadcast('mdeImageObjectSelected');
                };
            },
            'selection:cleared': function(e) {
                $rootScope.$broadcast('mdeObjectCleared');
            }
        });

        // piggyback on `canvas.findTarget`, to fire "object:over" and "object:out" events
        canvas.findTarget = (function(originalFn) {
            return function() {
                var target = originalFn.apply(this, arguments);
                if (target) {
                    if (this._hoveredTarget !== target) {
                        canvas.fire('object:over', { target: target });
                        if (this._hoveredTarget) {
                            canvas.fire('object:out', { target: this._hoveredTarget });
                        }
                        this._hoveredTarget = target;
                    }
                }
                else if (this._hoveredTarget) {
                    canvas.fire('object:out', { target: this._hoveredTarget });
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

    this.addText = function(text) {
        var textSample = new fabric.Text(text, {
            left: fabric.util.getRandomInt(0, 200),
            top: fabric.util.getRandomInt(0, 400),
            fontFamily: 'helvetica',
            angle: 0,
            fill: '#000000',
            scaleX: 0.5,
            scaleY: 0.5,
            fontWeight: '',
            hasRotatingPoint:true
        });
        canvas.add(textSample);
        canvas.item(canvas.item.length-1).hasRotatingPoint = true;
    };

    this.addImage = function(ImgSrc) {
        /*temp code*/
        var offset = 50;
        var left = fabric.util.getRandomInt(0 + offset, 200 - offset);
        var top = fabric.util.getRandomInt(0 + offset, 400 - offset);
        var angle = fabric.util.getRandomInt(-20, 40);
        var width = fabric.util.getRandomInt(30, 50);
        var opacity = (function(min, max){ return Math.random() * (max - min) + min; })(0.5, 1);

        fabric.Image.fromURL(ImgSrc, function(image) {
            image.set({
                left: left,
                top: top,
                angle: 0,
                padding: 10,
                cornersize: 10,
                hasRotatingPoint:true
            });
            //image.scale(getRandomNum(0.1, 0.25)).setCoords();
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

    this.bringToFront = function() {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        if (activeObject) {
            activeObject.bringToFront();
        }
        else if (activeGroup) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function(object) {
                object.bringToFront();
            });
        }
    };

    this.sentToBack = function() {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        if (activeObject) {
            activeObject.sendToBack();
        }
        else if (activeGroup) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function(object) {
                object.sendToBack();
            });
        }
    };

    this.flip = function(imageSrc) {
        var currentState;

        $(this.imageId).attr("src", imageSrc);
        currentState = JSON.stringify(canvas);
        try
        {
            var json = JSON.parse(this.prevState);
            canvas.loadFromJSON(json);
        }
        catch(e) {};
        this.prevState = currentState;

        canvas.renderAll();
        setTimeout(function() {
            canvas.calcOffset();
        }, 200);
    };
    

    this.changeBackground = function(color) {
        $rootScope.$broadcast('mdeChangeBackground', color);
    };

    this.addCanvasBorder = function() {
        canvas.add(lineL);
        canvas.add(lineR);
        canvas.add(lineU);
        canvas.add(lineD);
        canvas.renderAll();
    };

    this.removeCanvasBorder = function() {
        canvas.remove(lineL);
        canvas.remove(lineR);
        canvas.remove(lineU);
        canvas.remove(lineD);
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

    this.renderActiveTextStrokeColor = function(color) {
        applyToActiveTextFun(function(activeObject) {
            activeObject.strokeStyle = color;
        });
    };

    this.changeTextFontFamily = function(font) {
        applyToActiveTextFun(function(activeObject) {
            activeObject.fontFamily = font;
        });
    };

    this.toggleActiveTextBold = function() {
        applyToActiveTextFun(function(activeObject) {
            activeObject.fontWeight = (activeObject.fontWeight == 'bold' ? '' : 'bold');
        });
    };

    this.toggleActiveTextItalic = function() {
        applyToActiveTextFun(function(activeObject) {
            activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');
        });
    };

    this.toggleActiveTextStrike = function() {
        applyToActiveTextFun(function(activeObject) {
            activeObject.textDecoration = (activeObject.textDecoration == 'line-through' ? '' : 'line-through');
        });
    };

    this.toggleActiveTextUnderline = function() {
        applyToActiveTextFun(function(activeObject) {
            activeObject.textDecoration = (activeObject.textDecoration == 'underline' ? '' : 'underline');
        });
    };

    this.setActiveTextAlignment = function(position) {
        applyToActiveTextFun(function(activeObject) {
            activeObject.textAlign = position;
        });
    };
}]);
