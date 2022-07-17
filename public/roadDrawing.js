
var canvasWidth = 600;
var canvasHeight = 400;

var roads = [];
var nodes = [];

var stage = new Konva.Stage({
    container: "konvaContainer",
    width: canvasWidth,
    height: canvasHeight
});

var layerA = new Konva.Layer();

var curRoad = null; 
var curSeparator = null;

stage.on('pointerdown touchstart', function() {
    var mousePos = stage.getPointerPosition();

    // CheckConnection()
    curRoad = new Konva.Line({
        points: [mousePos.x, mousePos.y],
        stroke: 'blue',
        strokeWidth: 15,
        lineCap: 'round',
        lineJoin: 'round',
        tension: 0.3,
    });

    curSeparator = new Konva.Line({
        points: [mousePos.x, mousePos.y],
        stroke: 'white',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round',
        tension: 0.3,
        dash: [10, 10],
    });

    layerA.add(curRoad);
    layerA.add(curSeparator);
});

stage.on('mouseup touchend', function() {
    var mousePos = stage.getPointerPosition();
    let newPoints = curRoad.points().concat([mousePos.x, mousePos.y]);
    let prunedPoints = [];
    for(let i = 0; i < newPoints.length; i++) {
        prunedPoints.push(newPoints[i]);
        prunedPoints.push(newPoints[i+1]);
        i+= 11;
    }
    curRoad.points(prunedPoints);
    curSeparator.points(prunedPoints);
    roads.push(curRoad);
    curRoad = null;
});

stage.on('mousemove touchmove', function() {
    if(curRoad == null) return;
    var mousePos = stage.getPointerPosition();
    const curPoints = curRoad.points();
    const lastPoint = {x: curPoints[curPoints.length - 2], y: curPoints[curPoints.length - 1]};
    const mouseDistance = Math.hypot(mousePos.x - lastPoint.x, mousePos.y - lastPoint.y);
    if(mouseDistance > 2) {
        const newPoints = curRoad.points().concat([mousePos.x, mousePos.y]);
        curRoad.points(newPoints);
        curSeparator.points(newPoints);
    }
});

stage.add(layerA);
