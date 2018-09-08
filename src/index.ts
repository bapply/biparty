import * as Konva from 'konva';

let stageWidth = 400;
let stageHeight = 400;
const stage = new Konva.Stage({
  container: '.designer',
  width: 500,
  height: 500,
});

function fitStageIntoParentContainer() {
  const container = document.querySelector('.designer-container');

  const containerWidth = (container as any).offsetWidth;
  const scale = containerWidth / stageWidth;

  stage.width(stageWidth * scale);
  stage.height(stageHeight * scale);
  stage.scale({ x: scale, y: scale });
  stage.draw();
}

function update(activeAnchor) {
  const group = activeAnchor.getParent();

  const topLeft = group.get('.topLeft')[0];
  const topRight = group.get('.topRight')[0];
  const bottomRight = group.get('.bottomRight')[0];
  const bottomLeft = group.get('.bottomLeft')[0];
  const image = group.get('Image')[0];

  const anchorX = activeAnchor.getX();
  const anchorY = activeAnchor.getY();

  switch (activeAnchor.getName()) {
    case 'topLeft':
      topRight.setY(anchorY);
      bottomLeft.setX(anchorX);
      break;
    case 'topRight':
      topLeft.setY(anchorY);
      bottomRight.setX(anchorX);
      break;
    case 'bottomRight':
      bottomLeft.setY(anchorY);
      topRight.setX(anchorX);
      break;
    case 'bottomLeft':
      bottomRight.setY(anchorY);
      topLeft.setX(anchorX);
      break;
  }

  image.position(topLeft.position());

  const width = topRight.getX() - topLeft.getX();
  const height = bottomLeft.getY() - topLeft.getY();
  if (width && height) {
    image.width(width);
    image.height(height);
  }
}
function addAnchor(group, x, y, name) {
  const layer = group.getLayer();
  const anchor = new Konva.Circle({
    x: x,
    y: y,
    stroke: '#666',
    fill: '#ddd',
    strokeWidth: 2,
    radius: 8,
    name: name,
    draggable: true,
  });
  group.add(anchor);
  layer.draw();

  anchor.on('dragmove', function() {
    update(this);
    layer.draw();
  });
  anchor.on('mousedown touchstart', function() {
    group.setDraggable(false);
    this.moveToTop();
  });
  anchor.on('dragend', function() {
    group.setDraggable(true);
    layer.draw();
  });
  anchor.on('mouseover', function() {
    var layer = this.getLayer();
    document.body.style.cursor = 'pointer';
    this.setStrokeWidth(4);
    layer.draw();
  });
  anchor.on('mouseout', function() {
    var layer = this.getLayer();
    document.body.style.cursor = 'default';
    this.setStrokeWidth(2);
    layer.draw();
  });
}

fitStageIntoParentContainer();
window.addEventListener('resize', fitStageIntoParentContainer);

const imageLayer = new Konva.Layer();
const textLayer = new Konva.Layer();

stage.add(imageLayer);
stage.add(textLayer);
stage.draw();

function imageOnClick() {
  Array.from(document.querySelectorAll('.images img')).forEach(node => {
    node.removeEventListener('click', addImageToCanvas);
    node.addEventListener('click', addImageToCanvas);
  });
}

function addImageToCanvas() {
  const image = new Konva.Image({
    image: this,
    width: this.width,
    height: this.height,
  });
  const group = new Konva.Group({
    draggable: true,
    x: stage.getWidth() / 2 - this.width / 2,
    y: stage.getHeight() / 2 - this.height / 2,
  });
  group.add(image);
  imageLayer.add(group);
  imageLayer.draw();
  addAnchor(group, 0, 0, 'topLeft');
  addAnchor(group, this.width, 0, 'topRight');
  addAnchor(group, 0, this.height, 'bottomLeft');
  addAnchor(group, this.width, this.height, 'bottomRight');
}

setTimeout(imageOnClick, 0);
