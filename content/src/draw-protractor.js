// drawProtractor(ctx2d, radius, angleDegrees) and supporting functions.
// Author: James Synge
// See: http://jsfiddle.net/jamessynge/QQ43x/

var $   = require('jquery'),
    see = require('see');


eval(see.scope('drawProtractor'));

function to360(v) {
    while (v < 0) {
        v = 7200 - Math.abs(v);
    }
    return v % 360;
}

function renderProtractor(canvas, step) {
  var ctx = canvas[0].getContext('2d');
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width(), canvas.height());
  if (!step.startCoords) {
    return;
  }
  var arrowDrawn = false;
  // Draw an orange arrow if we know where the turtle ends up.
  if (step.endCoords) {
    if (step.command == 'lt' || step.command == 'rt') {
      if (pageDistance(step.startCoords, step.endCoords) <= 0.8) {
        ctx.save();
        ctx.beginPath();
        canvas_arc_arrow(
            ctx,
            step.startCoords.pageX, step.startCoords.pageY,
            40,
            toCanvasRadians(step.startCoords.direction),
            toCanvasRadians(step.endCoords.direction),
            step.command == 'lt');
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
        arrowDrawn = true;
      } else if (step.args.length >= 2 && parseFloat(step.args[1]) > 0.8) {
        var radius = parseFloat(step.args[1]) * step.startCoords.scale,
            startdir = toCanvasRadians(step.startCoords.direction +
                (step.command == 'lt' ? 1 : -1) * 90),
            enddir = toCanvasRadians(step.endCoords.direction +
                (step.command == 'lt' ? 1 : -1) * 90),
            cx = step.startCoords.pageX - Math.cos(startdir) * radius,
            cy = step.startCoords.pageY - Math.sin(startdir) * radius;
        ctx.save();
        ctx.beginPath();
        canvas_arc_arrow(
            ctx,
            cx, cy, radius, startdir, enddir,
            step.command == 'lt');
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }
    } else if (pageDistance(step.startCoords, step.endCoords) > 0.8) {
      ctx.save();
      ctx.beginPath();
      canvas_straight_arrow(
          ctx,
          step.startCoords.pageX, step.startCoords.pageY,
          step.endCoords.pageX, step.endCoords.pageY);
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.save();
  ctx.translate(step.startCoords.pageX, step.startCoords.pageY);
  drawProtractor(ctx, 30, step.startCoords.direction + 270);
  ctx.restore();
}

function canvas_arc_arrow(context, cx, cy, radius, fromangle, toangle, ccw) {
  context.arc(cx, cy, radius, fromangle, toangle, ccw);
  var headx = cx + radius * Math.cos(toangle),
      heady = cy + radius * Math.sin(toangle);
  canvas_arrow_head(context,
      headx, heady, toangle + (ccw ? -1 : 1) * Math.PI / 2, 10);
}

function canvas_straight_arrow(context, fromx, fromy, tox, toy){
  var headlen = 10;   // length of head in pixels
  var angle = Math.atan2(toy - fromy, tox - fromx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  canvas_arrow_head(context, tox, toy, angle, headlen);
}

function canvas_arrow_head(context, x, y, angle, headlen) {
  context.moveTo(x - headlen * Math.cos(angle - Math.PI/6),
                 y - headlen * Math.sin(angle - Math.PI/6));
  context.lineTo(x, y);
  context.lineTo(x - headlen * Math.cos(angle + Math.PI/6),
                 y - headlen * Math.sin(angle + Math.PI/6));
}

function pageDistance(a, b) {
  var dx = a.pageX - b.pageX,
      dy = a.pageY - b.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

function toCanvasRadians(direction) {
  return (((direction % 360) + 270 + 360) % 360) / 180 * Math.PI;
}

function drawTick(ctx, innerRadius, outerRadius, angleRadians) {
    // We treat angleRadians clockwise starting horizontal, pointing right
    // (i.e. pi/2 is straight down, pi is to the left, 3pi/2 is straight up).
    var c = Math.cos(angleRadians), s = Math.sin(angleRadians);
    ctx.moveTo(c * innerRadius, s * innerRadius);
    ctx.lineTo(c * outerRadius, s * outerRadius);
}

function drawTicks(ctx, startDegrees, stepDegrees,
                   innerRadius, outerRadius,
                   skipMod, skipOffset) {
    var d, v;
    ctx.beginPath();
    if (skipMod) {
        skipOffset = skipOffset || 0;
        for (d = startDegrees; d < 360; d += stepDegrees) {
            v = d % skipMod;
            if (v === skipOffset) {
                continue;
            }
            drawTick(ctx, innerRadius, outerRadius, d * Math.PI / 180.0, 1);
        }
    } else {
        for (d = startDegrees; d < 360; d += stepDegrees) {
            drawTick(ctx, innerRadius, outerRadius, d * Math.PI / 180.0, 1);
        }
    }
    ctx.stroke();
}

function drawAxes(ctx, radius) {
    ctx.strokeStyle = 'rgba(255, 128, 128, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(0, radius);
    ctx.moveTo(-radius, 0);
    ctx.lineTo(radius, 0);

    if (radius > 50) {
        // Draw 45degree axes.
        var c = Math.cos(Math.PI / 4), p = radius*c, n = -p, p2 = p/2, n2 = -p2;
        ctx.moveTo(n, n);
        ctx.lineTo(n2, n2);

        ctx.moveTo(p, p);
        ctx.lineTo(p2, p2);

        ctx.moveTo(n, p);
        ctx.lineTo(n2, p2);

        ctx.moveTo(p, n);
        ctx.lineTo(p2, n2);
    }

    ctx.stroke();
}

function drawOuterLabel(ctx, radius, label, angle, zeroAngle) {
    angle = to360(angle);

    radius += 2;
    var x = radius * Math.cos(angle * Math.PI / 180.0);
    var y = radius * Math.sin(angle * Math.PI / 180.0);

    ctx.save();
    ctx.translate(x,y);
    ctx.font = '10pt monospace';

    // Should the label be drawn as if the protractor center is below the text, or above it.
    var effectiveAngle = to360(angle + zeroAngle);
    if (0 < effectiveAngle && effectiveAngle < 180) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.rotate((270 + angle) * Math.PI / 180.0);
    } else {
        ctx.rotate((90 + angle) * Math.PI / 180.0);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
    }

    ctx.fillStyle = 'rgba(68,68,68,0.8)';
    ctx.fillText(label, 0, 0);
    ctx.restore();
}

function drawProtractor(ctx, radius, zeroAngle) {
    ctx.save();

    zeroAngle = to360(zeroAngle || 0);
    ctx.rotate(zeroAngle * Math.PI / 180.0);

    // Draw transparent circle under the ticks.
    ctx.lineWidth = 8;
    // ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, radius - 4, 0, 2 * Math.PI, false);
    ctx.stroke();

    // Draw the axes.
    drawAxes(ctx, radius - 8);

    if (radius > 150) {
        // Have enough room for single degree ticks.
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(64, 64, 64, 0.66)';
        drawTicks(ctx, 0, 1, radius - 2, radius, 5, 0);
    }
    if (radius > 50) {
        // Have enough room for 5 degree ticks.
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(64, 64, 64, 0.66)';
        drawTicks(ctx, 0, 5, radius - 4, radius, 10, 0);
    }
    if (radius > 30) {
        // Have enough room for 10 degree ticks.
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(64, 128, 64, 0.66)';
        drawTicks(ctx, 0, 10, radius - 6, radius, 90, 0);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 128, 128, 0.66)';
    drawTicks(ctx, 0, 90, radius - 8, radius);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
    drawTicks(ctx, 0, 360, radius - 10, radius + 6);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
    drawTicks(ctx, 0, 360, radius - 10, radius);

    if (radius > 50) {
        drawOuterLabel(ctx, radius, 'lt(90)', -90, zeroAngle);
        drawOuterLabel(ctx, radius, '0', 0, zeroAngle);
        drawOuterLabel(ctx, radius, 'rt(90)', 90, zeroAngle);
        drawOuterLabel(ctx, radius, 'rt(180)', 180, zeroAngle);
    }
    if (radius > 75) {
        drawOuterLabel(ctx, radius, 'lt(135)', -135, zeroAngle);
        drawOuterLabel(ctx, radius, 'lt(45)', -45, zeroAngle);
        drawOuterLabel(ctx, radius, 'rt(45)', 45, zeroAngle);
        drawOuterLabel(ctx, radius, 'rt(135)', 135, zeroAngle);
    }

    ctx.restore();
}

module.exports = { renderProtractor: renderProtractor };



