/*
main client
*/

var fogExp2 = true;

var container;

var camera, controls, scene, renderer, effect;

var mesh, mat;

var ray;

var worldWidth = 200, worldDepth = 200,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2,
data = generateHeight( worldWidth, worldDepth );

var clock = new THREE.Clock();
var time = Date.now()

if (!vr.isInstalled()) {
  alert('NPVR plugin not installed!');
}
vr.load(function(error) {
  if (error) {
    alert('Plugin load failed: ' + error.toString());
  }

  init();
  animate();
});


function init() {
  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;


  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xffffff, 0.00015 );

  controls = new THREE.OculusRiftControls( camera );
  scene.add( controls.getObject() );

  //controls = new THREE.FirstPersonControls( camera );

  /*controls.movementSpeed = 1000;
  controls.lookSpeed = 0.125;
  controls.lookVertical = true;
  controls.constrainVertical = true;
  controls.verticalMin = 1.1;
  controls.verticalMax = 2.2;*/

  // sides
  
  var light = new THREE.Color( 0xffffff );
  var shadow = new THREE.Color( 0x505050 );

  var matrix = new THREE.Matrix4();

  var pxGeometry = new THREE.PlaneGeometry( 100, 100 );
  pxGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
  pxGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
  pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
  pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
  pxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
  pxGeometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
  pxGeometry.applyMatrix( matrix.makeTranslation( 50, 0, 0 ) );

  var nxGeometry = new THREE.PlaneGeometry( 100, 100 );
  nxGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
  nxGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
  nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
  nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
  nxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
  nxGeometry.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
  nxGeometry.applyMatrix( matrix.makeTranslation( - 50, 0, 0 ) );

  var pyGeometry = new THREE.PlaneGeometry( 100, 100 );
  pyGeometry.faces[ 0 ].vertexColors.push( light, light, light );
  pyGeometry.faces[ 1 ].vertexColors.push( light, light, light );
  pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
  pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
  pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
  pyGeometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
  pyGeometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

  var py2Geometry = new THREE.PlaneGeometry( 100, 100 );
  py2Geometry.faces[ 0 ].vertexColors.push( light, light, light );
  py2Geometry.faces[ 1 ].vertexColors.push( light, light, light );
  py2Geometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
  py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
  py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
  py2Geometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
  py2Geometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
  py2Geometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

  var pzGeometry = new THREE.PlaneGeometry( 100, 100 );
  pzGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
  pzGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
  pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
  pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
  pzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
  pzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, 50 ) );

  var nzGeometry = new THREE.PlaneGeometry( 100, 100 );
  nzGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
  nzGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
  nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
  nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
  nzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
  nzGeometry.applyMatrix( matrix.makeRotationY( Math.PI ) );
  nzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, - 50 ) );

  //

  var geometry = new THREE.Geometry();
  var dummy = new THREE.Mesh();

  for ( var z = 0; z < worldDepth; z ++ ) {

    for ( var x = 0; x < worldWidth; x ++ ) {

      var h = getY( x, z );

      dummy.position.x = x * 100 - worldHalfWidth * 100;
      dummy.position.y = h * 100;
      dummy.position.z = z * 100 - worldHalfDepth * 100;

      var px = getY( x + 1, z );
      var nx = getY( x - 1, z );
      var pz = getY( x, z + 1 );
      var nz = getY( x, z - 1 );

      var pxpz = getY( x + 1, z + 1 );
      var nxpz = getY( x - 1, z + 1 );
      var pxnz = getY( x + 1, z - 1 );
      var nxnz = getY( x - 1, z - 1 );

      var a = nx > h || nz > h || nxnz > h ? 0 : 1;
      var b = nx > h || pz > h || nxpz > h ? 0 : 1;
      var c = px > h || pz > h || pxpz > h ? 0 : 1;
      var d = px > h || nz > h || pxnz > h ? 0 : 1;

      if ( a + c > b + d ) {

        dummy.geometry = py2Geometry;

        var colors = dummy.geometry.faces[ 0 ].vertexColors;
        colors[ 0 ] = b === 0 ? shadow : light;
        colors[ 1 ] = c === 0 ? shadow : light;
        colors[ 2 ] = a === 0 ? shadow : light;

        var colors = dummy.geometry.faces[ 1 ].vertexColors;
        colors[ 0 ] = c === 0 ? shadow : light;
        colors[ 1 ] = d === 0 ? shadow : light;
        colors[ 2 ] = a === 0 ? shadow : light;

      } else {

        dummy.geometry = pyGeometry;

        var colors = dummy.geometry.faces[ 0 ].vertexColors;
        colors[ 0 ] = a === 0 ? shadow : light;
        colors[ 1 ] = b === 0 ? shadow : light;
        colors[ 2 ] = d === 0 ? shadow : light;

        var colors = dummy.geometry.faces[ 1 ].vertexColors;
        colors[ 0 ] = b === 0 ? shadow : light;
        colors[ 1 ] = c === 0 ? shadow : light;
        colors[ 2 ] = d === 0 ? shadow : light;

      }

      THREE.GeometryUtils.merge( geometry, dummy );

      if ( ( px != h && px != h + 1 ) || x == 0 ) {

        dummy.geometry = pxGeometry;

        var colors = dummy.geometry.faces[ 0 ].vertexColors;
        colors[ 0 ] = pxpz > px && x > 0 ? shadow : light;
        colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

        var colors = dummy.geometry.faces[ 1 ].vertexColors;
        colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

        THREE.GeometryUtils.merge( geometry, dummy );

      }

      if ( ( nx != h && nx != h + 1 ) || x == worldWidth - 1 ) {

        dummy.geometry = nxGeometry;

        var colors = dummy.geometry.faces[ 0 ].vertexColors;
        colors[ 0 ] = nxnz > nx && x < worldWidth - 1 ? shadow : light;
        colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

        var colors = dummy.geometry.faces[ 1 ].vertexColors;
        colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

        THREE.GeometryUtils.merge( geometry, dummy );

      }

      if ( ( pz != h && pz != h + 1 ) || z == worldDepth - 1 ) {

        dummy.geometry = pzGeometry;

        var colors = dummy.geometry.faces[ 0 ].vertexColors;
        colors[ 0 ] = nxpz > pz && z < worldDepth - 1 ? shadow : light;
        colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

        var colors = dummy.geometry.faces[ 1 ].vertexColors;
        colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

        THREE.GeometryUtils.merge( geometry, dummy );

      }

      if ( ( nz != h && nz != h + 1 ) || z == 0 ) {

        dummy.geometry = nzGeometry;

        var colors = dummy.geometry.faces[ 0 ].vertexColors;
        colors[ 0 ] = pxnz > nz && z > 0 ? shadow : light;
        colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

        var colors = dummy.geometry.faces[ 1 ].vertexColors;
        colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

        THREE.GeometryUtils.merge( geometry, dummy );

      }

    }

  }

  var texture = THREE.ImageUtils.loadTexture( 'textures/minecraft/atlas.png' );
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;

  var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture, ambient: 0xbbbbbb, vertexColors: THREE.VertexColors } ) );
  scene.add( mesh );

  var ambientLight = new THREE.AmbientLight( 0xcccccc );
  scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
  directionalLight.position.set( 1, 1, 0.5 ).normalize();
  scene.add( directionalLight );

  renderer = new THREE.WebGLRenderer({
    devicePixelRatio: 1,
    alpha: false,
    clearColor: 0xffffff,
    antialias: true
  });

  renderer.setSize( window.innerWidth, window.innerHeight );

  effect = new THREE.OculusRiftEffect( renderer );

  container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'keydown', keyPressed, false );
}

function genWorld() {

}

/*var remote = require('remote');
var BrowserWindow = remote.require('browser-window');

var win = remote.getCurrentWindow();

var ipc = require('ipc');

ipc.on('msg', function(msg){
  console.log('ipc msg: '+ msg);
});*/

function keyPressed (event) {
  var code = event.keyCode;
  if (code == 72) { // esc, H for now as issue with esc?
    //ipc.send('msg', 'close');
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  //renderer.setSize( window.innerWidth, window.innerHeight );
  //effect.setSize( window.innerWidth, window.innerHeight );

  //controls.handleResize();
}

function loadTexture( path, callback ) {

  var image = new Image();

  image.onload = function () { callback(); };
  image.src = path;

  return image;

}

function generateHeight( width, height ) {

  var data = [], perlin = new ImprovedNoise(),
  size = width * height, quality = 2, z = Math.random() * 100;

  for ( var j = 0; j < 4; j ++ ) {

    if ( j == 0 ) for ( var i = 0; i < size; i ++ ) data[ i ] = 0;

    for ( var i = 0; i < size; i ++ ) {

      var x = i % width, y = ( i / width ) | 0;
      data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;

    }

    quality *= 4

  }

  return data;
}

function getY( x, z ) {
  return ( data[ x + z * worldWidth ] * 0.2 ) | 0;
}

//

var vrstate = new vr.State();
function animate() {
  vr.requestAnimationFrame(animate);

  controls.isOnObject( false );

  // Poll VR, if it's ready.
  var polled = vr.pollState(vrstate);
  controls.update( Date.now() - time, polled ? vrstate : null );

  //renderer.render( scene, camera );
  effect.render( scene, camera, polled ? vrstate : null );

  time = Date.now();
}
