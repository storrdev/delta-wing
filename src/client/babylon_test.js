var keys = {
    forward: false,
    reverse: false,
    strafeLeft: false,
    strafeRight: false,
    rotateLeft: false,
    rotateRight: false
};

var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);

var camera, targetCam, ship;

function createScene() {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0.2);

    ship = BABYLON.Mesh.CreateCylinder('ship', 3, 3, 3, 6, 1, scene, true);
    ship.position.z = -1;

    camera = new BABYLON.ArcRotateCamera('camera1', 0, 0, 10, ship.position, scene);
    // camera.setPosition(new BABYLON.Vector3(0, 50, -200));
    camera.attachControl(canvas, true);
    scene.activeCamera = camera;

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

    console.log('scene created');

    return scene;

}

var scene = createScene();

engine.runRenderLoop(function() {
    scene.render();
    if (keys.forward === true) {
        ship.position.z -= 0.1;
        ship.position.z += Math.sin(ship.rotation.x) * 0.1;
        console.log( ship.position.z );
    }
    if (keys.reverse === true) {
        ship.position.z += 0.1;
    }
    if (keys.strafeLeft === true) {
        ship.position.x += 0.1;
    }
    if (keys.strafeRight === true) {
        ship.position.x -= 0.1;
    }
    if (keys.rotateLeft === true) {
        ship.rotate(BABYLON.Axis.Y, 0.1, BABYLON.Space.LOCAL);
        //ship.translate(BABYLON.Axis.X, 0.1, BABYLON.Space.GLOBAL);
        //camera.rotate(BABYLON.Axis.Y, 0.1, BABYLON.Space.LOCAL);
    }
    if (keys.rotateRight === true) {
        ship.rotate(BABYLON.Axis.Y, -0.1, BABYLON.Space.LOCAL);
        //ship.translate(BABYLON.Axis.X, -0.1, BABYLON.Space.GLOBAL);
    }
});

window.addEventListener('resize', function() {
    engine.resize();
});

window.addEventListener('keydown', function(e) {

    //console.log(camera.cameraDirection);

    if ( e.keyCode == 87 ) {
        keys.forward = true;
    }
    else if ( e.keyCode == 83 ) {
        keys.reverse = true;
    }
    else if ( e.keyCode == 65 ) {
        keys.strafeLeft = true;
    }
    else if ( e.keyCode == 68 ) {
        keys.strafeRight = true;
    }
    else if ( e.keyCode == 81 ) {
        keys.rotateLeft = true;
    }
    else if ( e.keyCode == 69 ) {
        keys.rotateRight = true;
    }
 });

window.addEventListener('keyup', function(e) {
    if ( e.keyCode == 87 ) {
        keys.forward = false;
    }
    else if ( e.keyCode == 83 ) {
        keys.reverse = false;
    }
    else if ( e.keyCode == 65 ) {
        keys.strafeLeft = false;
    }
    else if ( e.keyCode == 68 ) {
        keys.strafeRight = false;
    }
    else if ( e.keyCode == 81 ) {
        keys.rotateLeft = false;
    }
    else if ( e.keyCode == 69 ) {
        keys.rotateRight = false;
    }
});

var oldMouseX = 0;
var oldMouseY = 0;

window.addEventListener('mousemove', function(e) {

    var moveX = e.pageX - oldMouseX;
    var moveY = e.pageY - oldMouseY;

    oldMouseX = e.pageX;
    oldMouseY = e.pageY;

    ship.rotation.y += Math.PI/90 * moveX;
    camera.alpha -= Math.PI/90 * moveX;

    ship.rotation.x -= Math.PI/90 * moveY;
    camera.beta -= Math.PI/90 * moveY;

    // console.log('%s, %s', moveX, moveY);
});