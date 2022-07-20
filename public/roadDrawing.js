
var canvasWidth = 600;
var canvasHeight = 400;

// tuning values
const interactionDistance = 40;
const roadWidth = 30;
const separatorWidth = 2;

var roads = [];
var nodes = [];

var stage = new Konva.Stage({
    container: "konvaContainer",
    width: canvasWidth,
    height: canvasHeight
});

var layerA = new Konva.Layer();
var layerB = new Konva.Layer();

var curRoad = null; 
var curSeparator = null;

stage.on('pointerdown touchstart', function() {
    var mousePos = stage.getPointerPosition();

    const connectionCheck = CheckNearNode(mousePos);
    if(connectionCheck.nearNode){
        mousePos = {x:connectionCheck.nodePos.x(), y:connectionCheck.nodePos.y()};
    }
    curRoad = new Konva.Line({
        points: [mousePos.x, mousePos.y],
        stroke: '#154a8b',
        strokeWidth: roadWidth,
        lineCap: 'round',
        lineJoin: 'round',
        tension: 0.3,
    });

    curSeparator = new Konva.Line({
        points: [mousePos.x, mousePos.y],
        stroke: '#e3f2ff',
        strokeWidth: separatorWidth,
        lineCap: 'round',
        lineJoin: 'round',
        tension: 0.3,
        dash: [10, 10],
    });

    layerA.add(curRoad);
    layerA.add(curSeparator);

    if(!connectionCheck.nearNode) {
        AddLineEnd(mousePos.x, mousePos.y);
    }
});

stage.on('mouseup touchend', function() {
    var mousePos = stage.getPointerPosition();

    const connectionCheck = CheckNearNode(mousePos);
    if(connectionCheck.nearNode){
        mousePos = {x:connectionCheck.nodePos.x(), y:connectionCheck.nodePos.y()};
    }
    else {
        AddLineEnd(mousePos.x, mousePos.y);
    }
    
    let newPoints = curRoad.points().concat([mousePos.x, mousePos.y]);
    curRoad.points(newPoints);
    curSeparator.points(newPoints);
    roads.push(curRoad);
    curRoad = null;
});

stage.on('mousemove touchmove', function() {
    if(curRoad == null) return;
    var mousePos = stage.getPointerPosition();
    const curPoints = curRoad.points();
    const lastPoint = {x: curPoints[curPoints.length - 2], y: curPoints[curPoints.length - 1]};
    const mouseDistance = Math.hypot(mousePos.x - lastPoint.x, mousePos.y - lastPoint.y);
    if(mouseDistance > interactionDistance) {
        const newPoints = curRoad.points().concat([mousePos.x, mousePos.y]);
        curRoad.points(newPoints);
        curSeparator.points(newPoints);
    }
});

function AddLineEnd(endX, endY) {
    var lineEnd = new Konva.Circle({
            x: endX,
            y: endY,
            radius: 13,
            stroke: '#e3f2ff',
            strokeWidth: 3,
            fill:'#154a8b',
        });
    nodes.push(lineEnd);
    layerB.add(lineEnd);
}

function CheckNearNode(mousePos) {
    for(let i = 0; i < nodes.length; i++) {
        if(Math.hypot(mousePos.x - nodes[i].x(), mousePos.y - nodes[i].y()) < interactionDistance) {
            console.log(nodes[i].x());
            return {nearNode:true, nodePos: nodes[i]};
        }
    }
    return {nearNode:false, nodePos:null};
}

stage.add(layerA);
stage.add(layerB);
