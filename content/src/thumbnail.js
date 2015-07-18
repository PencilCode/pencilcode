var THUMBNAIL_SIZE = 128;

// Public functions
var thumbnail = {
  generateThumbnailDataUrl: function(iframe) {
    // Get the canvas inside the iframe.
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    // TODO: Add support for multiple turtle.
    var canvas = innerDoc.getElementsByTagName('canvas')[0];

    if (!canvas || canvas.id === 'turtle') { return; }

    // Get the image data.
    var imageInfo = getImageInfo(canvas);

    // Get the cropped and resized image data url.
    return getImageDataUrl(canvas, imageInfo);
  }
}

// Private functions
function getImageInfo(canvas) {
  var w = canvas.width;
  var h = canvas.height;
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, w, h);

  // Initialize the coordinates for the image region,
  // topLeft is initialized to bottom right,
  // and bottomRight is initialized to top left.
  var topLeft = { x: h, y: w };
  var bottomRight = { x: 0, y: 0 };

  // Iterate through all the points to find the "interesting" region.
  var x, y, index;
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      // Every pixel takes up 4 slots in the array, contains R, G, B, A.
      index = (y * w + x) * 4;
      // Thus `index + 3` is the index of the Alpha value.
      if (imageData.data[index + 3] > 0) {
        if (x < topLeft.x) {
          topLeft.x = x;
        }
        if (x > bottomRight.x) {
          bottomRight.x = x;
        }
        if (y < topLeft.y) {
          topLeft.y = y;
        }
        if (y > bottomRight.y) {
          bottomRight.y = y;
        }
      }
    }
  }

  // Calculate the actual image size.
  var imageWidth = bottomRight.x - topLeft.x + 1;
  var imageHeight = bottomRight.y - topLeft.y + 1;

  // Find the longer edge and make it a square.
  var longerEdge;
  if (imageWidth > imageHeight) {
    longerEdge = imageWidth;
    topLeft.y -= (imageWidth - imageHeight) / 2;
  } else {
    longerEdge = imageHeight;
    topLeft.x -= (imageHeight - imageWidth) / 2;
  }

  return { x: topLeft.x, y: topLeft.y, size: longerEdge }
}

function getImageDataUrl(canvas, imageInfo) {
  // Draw the cropped image in a temp canvas and scale it down.
  var tempCanvas = document.createElement('canvas');
  var tempCanvasCtx = tempCanvas.getContext('2d');
  tempCanvas.width = THUMBNAIL_SIZE;
  tempCanvas.height = THUMBNAIL_SIZE;
  tempCanvasCtx.drawImage(canvas,       // Src canvas.
      imageInfo.x, imageInfo.y,         // Src coordinates.
      imageInfo.size, imageInfo.size,   // Src coordinates.
      0, 0,                             // Dest coordinates.
      THUMBNAIL_SIZE, THUMBNAIL_SIZE);  // Dest size.

  // Convert the temp canvas to data url and return.
  return tempCanvas.toDataURL();
}

module.exports = thumbnail;
