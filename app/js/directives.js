'use strict';

function onObjectSelected(e) {
  console.log("selected!");
  var selectedObject = e.target;
  $("#text-string").val("");
  selectedObject.hasRotatingPoint = true
  if (selectedObject && selectedObject.type === 'text') {
    //display text editor
    $("#texteditor").css('display', 'block');
    $("#text-string").val(selectedObject.getText());
    $('#text-fontcolor').miniColors('value',selectedObject.fill);
    $('#text-strokecolor').miniColors('value',selectedObject.strokeStyle);
    $("#imageeditor").css('display', 'block');
  }
  else if (selectedObject && selectedObject.type === 'image'){
    //display image editor
    $("#texteditor").css('display', 'none');
    $("#imageeditor").css('display', 'block');
  }
};

function onSelectedCleared(e){
  console.log("cleared!");
  $("#texteditor").css('display', 'none');
  $("#text-string").val("");
  $("#imageeditor").css('display', 'none');
};

function setFont(font){
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'text') {
    activeObject.fontFamily = font;
    canvas.renderAll();
  }
};

function removeWhite(){
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') {
    activeObject.filters[2] =  new fabric.Image.filters.RemoveWhite({hreshold: 100, distance: 10});//0-255, 0-255
    activeObject.applyFilters(canvas.renderAll.bind(canvas));
  }
};

/* Directives */
var monadexDirectives = angular.module('monadexApp.directives', []);

monadexDirectives.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

monadexDirectives.directive('tshirtDesigner', ['$document', function($document) {
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
        $(window).load(function() {
          var canvas;

          $("#text-bold").click(function() {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
              activeObject.fontWeight = (activeObject.fontWeight == 'bold' ? '' : 'bold');
              canvas.renderAll();
            }
          });

          $("#text-italic").click(function() {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
              activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');
              canvas.renderAll();
            }
          });

          $("#text-strike").click(function() {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
              activeObject.textDecoration = (activeObject.textDecoration == 'line-through' ? '' : 'line-through');
              canvas.renderAll();
            }
          });

          $("#text-underline").click(function() {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
              activeObject.textDecoration = (activeObject.textDecoration == 'underline' ? '' : 'underline');
              canvas.renderAll();
            }
          });

          $("#text-left").click(function() {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
              activeObject.textAlign = 'left';
              canvas.renderAll();
            }
          });

          $("#text-center").click(function() {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
              activeObject.textAlign = 'center';
              canvas.renderAll();
            }
          });

          $("#text-right").click(function() {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
              activeObject.textAlign = 'right';
              canvas.renderAll();
            }
          });

          $("#font-family").change(function() {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
              activeObject.fontFamily = this.value;
              canvas.renderAll();
            }
          });

          $('#text-bgcolor').miniColors({
            change: function(hex, rgb) {
              var activeObject = canvas.getActiveObject();
              if (activeObject && activeObject.type === 'text') {
                activeObject.backgroundColor = this.value;
                canvas.renderAll();
              }
            },
            open: function(hex, rgb) {
              //
            },
            close: function(hex, rgb) {
              //
            }
          });

          $('#text-strokecolor').miniColors({
            change: function(hex, rgb) {
              var activeObject = canvas.getActiveObject();
              if (activeObject && activeObject.type === 'text') {
                activeObject.strokeStyle = this.value;
                canvas.renderAll();
              }
            },
            open: function(hex, rgb) {
              //
            },
            close: function(hex, rgb) {
              //
            }
          });

        //canvas.add(new fabric.fabric.Object({hasBorders:true,hasControls:false,hasRotatingPoint:false,selectable:false,type:'rect'}));
          $(".clearfix button,a").tooltip();
        })}
    };
  }]);

monadexDirectives.directive('tShirtCanvas', ['$document', 'canvasService', function($document, canvasService) {
  var canvas;
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'partials/tshirt-canvas.html',
    link: function(scope, element, attrs) {
      // initialize the canvasService
      canvasService.init('tcanvas', "#tshirtFacing");
      $(window).load(function() {
        $("#drawingArea").hover(canvasService.addCanvasBorder, canvasService.removeCanvasBorder)
      })
    }
  }
}]);

monadexDirectives.directive('bgColorPicker', ['$document', 'canvasService', function($document, canvasService){
  return {
    restrict: 'E',
    scope: {
      colors: '='
    },
    templateUrl: 'partials/bg-color-picker.html',
    link: function(scope, element, attrs) {
      $(window).load(function() {
        $('.color-preview').on("click", function(){
          var color = $(this).css("background-color");
          canvasService.changeBackground(color);
        });
      })
    }
  }
}]);

monadexDirectives.directive('textInput', ['$document', 'canvasService', function($document, canvasService){
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'partials/text-input.html',
    link: function(scope, element, attrs) {
      $(window).load(function() {
        $('#add-text').on("click", function(){
          var text = $("#text-string").val();
          canvasService.addText(text);
          //$("#texteditor").css('display', 'block');
          //$("#imageeditor").css('display', 'block');
        });

        $("#text-string").keyup(function(){
          var text = $(this).value;
          canvasService.renderActiveText(text);
        });
      })
    }
  }
}]);

monadexDirectives.directive('imagePicker', ['$document', 'canvasService', function($document, canvasService){
  return {
    restrict: 'E',
    scope: {
      images: '='
    },
    templateUrl: 'partials/image-picker.html',
    link: function(scope, element, attrs) {
      console.log("imgpicker");
      $(window).load(function() {
        $(".img-polaroid").on("click", function(e){
          var el = e.target;
          canvasService.addImage(el.src);
          });
      })}
    }
}]);

monadexDirectives.directive('imageEditor', ['$document', 'canvasService', function($document, canvasService){
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'partials/image-editor.html',
    link: function(scope, element, attrs) {
      $(window).load(function() {
        $('#remove-selected').click(canvasService.removeSelected);
        $('#bring-to-front').click(canvasService.bringToFront);
        $('#send-to-back').click(canvasService.sendToBack);
        $('#flip').click(function() {
          if ($(this).attr("data-original-title") == "Show Back View") {
            $(this).attr('data-original-title', 'Show Front View');
            canvasService.flip("img/crew_back.png");
          } else {
            $(this).attr('data-original-title', 'Show Back View');
            canvasService.flip("img/crew_front.png");
          }
        });
      })}
    }
}]);

monadexDirectives.directive('textEditor', ['$document', 'canvasService', function($document, canvasService){
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'partials/text-editor.html',
    link: function(scope, element, attrs) {
      $(window).load(function() {
          $('#text-fontcolor').miniColors({
            change: function(hex, rgb) {
              var color = $(this).value;
              canvasService.renderActiveTextColor(color);
            },
            open: function(hex, rgb) {
              //
            },
            close: function(hex, rgb) {
              //
            }
          });
      })}
    }
}]);
