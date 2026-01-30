const BLOCK_SIZE = 32;
const DIRECTIONS = [
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: -1 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: -1 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: 0.5, y: 1 },
  { x: 0.5, y: 0 },
  { x: 0.5, y: -1 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: -0.5, y: 1 },
  { x: -0.5, y: 0 },
  { x: -0.5, y: -1 },
  { x: 0.5, y: 1 },
  { x: 0, y: 1 },
  { x: -0.5, y: 1 },
  { x: 0.5, y: 0 },
  { x: -0.5, y: 0 },
  { x: 0.5, y: -1 },
  { x: 0, y: -1 },
  { x: -0.5, y: -1 },
];

let Character = class {
  mass = 80;
  baseSpeed = 6;
  yke = 0;
  gpe = 0;
  debugMessage = "";
  dead = false;
  startedMovement = {
    left: null,
    right: null,
  };
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  render() {
    if (this.dead) return;
    fg.fillStyle = this.color;
    fg.fillRect(this.left, this.top, this.width, this.height);
    fg.strokeStyle = "black";
    fg.strokeRect(this.left, this.y, this.width, this.height);
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get middle() {
    return this.y + this.height / 2;
  }
  get bottom() {
    return this.y + this.height;
  }
  speed(direction, onGround, increase = false) {
    let multiplier = (this.startedMovement[direction] || 0) + 1;
    if (increase && onGround) this.startedMovement[direction] = multiplier;
    let speed = Math.floor(
      this.baseSpeed +
        (multiplier != 1
          ? this.baseSpeed * (multiplier / 20) * (!onGround ? 0.3 : 1)
          : 0)
    );
    return speed;
  }
  movement() {
    let speed = this.baseSpeed;

    // Use rectHitsWall for full-body collision instead of point checks.
    // This prevents the character from slipping between blocks.
    let downHit = rectHitsWall(this.left, this.bottom - this.yke, this.right, this.bottom - this.yke + 1);
    let upHit = rectHitsWall(this.left, this.top - 1, this.right, this.top);
    let leftHit = rectHitsWall(this.left - speed, this.top, this.left - speed + 1, this.bottom);
    let rightHit = rectHitsWall(this.right + speed - 1, this.top, this.right + speed, this.bottom);

    return {
      down: !downHit,
      up: !upHit,
      left: !leftHit,
      right: !rightHit,
    };
  }
  resetPosition(minDistanceFromPlayer) {
    let minDistance = minDistanceFromPlayer * BLOCK_SIZE;
    let emptySpaces = [];
    for (let row = 0; row < currentLevel.length; row++) {
      for (let col = 0; col < currentLevel[0].length; col++) {
        let x = player.x - col * BLOCK_SIZE;
        let y = player.y - row * BLOCK_SIZE;
        if (
          (x > minDistance || x < -minDistance) &&
          (y > minDistance || y < -minDistance) &&
          currentLevel[row][col] === "0"
        ) {
          emptySpaces.push([col, row]);
        }
      }
    }

    let randIndex = Math.floor(Math.random() * emptySpaces.length);
    let position = emptySpaces[randIndex];

    this.x =
      position[0] * BLOCK_SIZE +
      Math.floor(Math.random() * (BLOCK_SIZE - this.width));

    this.y =
      position[1] * BLOCK_SIZE +
      Math.floor(Math.random() * (BLOCK_SIZE - this.height));
  }
};
