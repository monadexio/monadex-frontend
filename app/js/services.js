'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myService = angular.module('monadexApp.services', []);

myService.value('version', '0.1');

myService.service("canvasService", function() {
  var canvas;

  // return the canvas instance
  this.getCanvas = function() {
    return canvas;
  };

  this.init = function(canvasid) {
    console.log("initialize...");

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
      'object:selected':onObjectSelected,
      'selection:cleared':onSelectedCleared
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

  this.changeBackground = function(color) {
    console.log("in change background");
    $("#shirtDiv").css("backgroundColor", color);
  }
});
