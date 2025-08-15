// ==================== ENHANCED 2D WEB GAME ENGINE - QUALITY OF LIFE EDITION ====================
// Component-Based Architecture with Advanced Developer Experience Features

// ==================== UTILITY CLASSES ====================

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiplyByScalar(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2(0, 0);
    return new Vector2(this.x / mag, this.y / mag);
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  distance(other) {
    return this.subtract(other).magnitude();
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  static zero() {
    return new Vector2(0, 0);
  }

  static one() {
    return new Vector2(1, 1);
  }
}

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return callback;
  }

  emit(event, data = null) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  clear(event = null) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

class Debug {
  static enabled = false;

  static log(...args) {
    if (this.enabled) {
      console.log("[DEBUG]", ...args);
    }
  }

  static warn(...args) {
    if (this.enabled) {
      console.warn("[DEBUG]", ...args);
    }
  }

  static error(...args) {
    console.error("[DEBUG]", ...args);
  }

  static drawBounds(ctx, bounds, color = "red") {
    if (!this.enabled) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      bounds.left,
      bounds.top,
      bounds.right - bounds.left,
      bounds.bottom - bounds.top
    );
    ctx.restore();
  }
}

function generateUniqueId() {
  return (
    "id-" + Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
  );
}

// ==================== TIMER SYSTEM ====================

class Timer {
  constructor(duration, callback, repeat = false) {
    this.duration = duration;
    this.callback = callback;
    this.repeat = repeat;
    this.timeLeft = duration;
    this.active = true;
  }

  update(deltaTime) {
    if (!this.active) return false;

    this.timeLeft -= deltaTime;
    if (this.timeLeft <= 0) {
      this.callback();

      if (this.repeat) {
        this.timeLeft = this.duration;
      } else {
        this.active = false;
        return true; // Timer finished
      }
    }
    return false;
  }

  stop() {
    this.active = false;
  }

  reset() {
    this.timeLeft = this.duration;
    this.active = true;
  }
}

class TimerManager {
  constructor() {
    this.timers = [];
  }

  setTimeout(callback, delay) {
    const timer = new Timer(delay, callback, false);
    this.timers.push(timer);
    return timer;
  }

  setInterval(callback, delay) {
    const timer = new Timer(delay, callback, true);
    this.timers.push(timer);
    return timer;
  }

  clearTimer(timer) {
    timer.stop();
    const index = this.timers.indexOf(timer);
    if (index > -1) {
      this.timers.splice(index, 1);
    }
  }

  update(deltaTime) {
    // Remove finished timers
    this.timers = this.timers.filter((timer) => {
      const finished = timer.update(deltaTime);
      return !finished;
    });
  }

  clear() {
    this.timers.forEach((timer) => timer.stop());
    this.timers = [];
  }
}

// ==================== PHYSICS LAYERS SYSTEM ====================

class PhysicsLayers {
  static layers = {
    Default: 0,
    Player: 1,
    Enemy: 2,
    PlayerBullet: 3,
    EnemyBullet: 4,
    Collectible: 5,
    Environment: 6,
    UI: 7,
  };

  static collisionMatrix = new Map();

  static setCollisionRule(layerA, layerB, canCollide) {
    const layerAId = typeof layerA === "string" ? this.layers[layerA] : layerA;
    const layerBId = typeof layerB === "string" ? this.layers[layerB] : layerB;

    const key = this.getMatrixKey(layerAId, layerBId);
    this.collisionMatrix.set(key, canCollide);
  }

  static canCollide(layerA, layerB) {
    const layerAId = typeof layerA === "string" ? this.layers[layerA] : layerA;
    const layerBId = typeof layerB === "string" ? this.layers[layerB] : layerB;

    const key = this.getMatrixKey(layerAId, layerBId);
    return this.collisionMatrix.get(key) || false;
  }

  static getMatrixKey(layerA, layerB) {
    return layerA <= layerB ? `${layerA}-${layerB}` : `${layerB}-${layerA}`;
  }

  static initializeDefaults() {
    // Set up default collision rules
    this.setCollisionRule("Player", "Enemy", true);
    this.setCollisionRule("Player", "Collectible", true);
    this.setCollisionRule("Player", "Environment", true);
    this.setCollisionRule("PlayerBullet", "Enemy", true);
    this.setCollisionRule("EnemyBullet", "Player", true);
    this.setCollisionRule("Enemy", "Environment", true);
    this.setCollisionRule("PlayerBullet", "Environment", true);
    this.setCollisionRule("EnemyBullet", "Environment", true);
  }
}

// Initialize default collision rules
PhysicsLayers.initializeDefaults();

// ==================== FINITE STATE MACHINE SYSTEM ====================

class State {
  constructor(name) {
    this.name = name;
    this.stateMachine = null;
  }

  enter() {
    // Override in subclasses
  }

  update(deltaTime) {
    // Override in subclasses
  }

  exit() {
    // Override in subclasses
  }

  // Helper method to transition to another state
  transitionTo(stateName) {
    if (this.stateMachine) {
      this.stateMachine.transitionTo(stateName);
    }
  }
}

// ==================== COMPONENT SYSTEM ====================

class Component {
  constructor() {
    this.gameObject = null;
    this.enabled = true;
    this.started = false;
  }

  awake() {}
  start() {
    this.started = true;
  }
  update(deltaTime) {}
  lateUpdate(deltaTime) {}
  draw(ctx, camera) {}
  onDestroy() {}
  onMessage(message, data) {}
  onCollisionEnter(other) {}
  onCollisionExit(other) {}

  sendMessage(message, data = null) {
    if (this.gameObject) {
      this.gameObject.sendMessage(message, data);
    }
  }
}

class StateMachine extends Component {
  constructor(initialState = null) {
    super();
    this.states = new Map();
    this.currentState = null;
    this.initialStateName = initialState;
  }

  addState(name, state) {
    state.stateMachine = this;
    this.states.set(name, state);
    return this; // Fluent interface
  }

  start() {
    if (this.initialStateName) {
      this.transitionTo(this.initialStateName);
    }
  }

  update(deltaTime) {
    if (this.currentState) {
      this.currentState.update(deltaTime);
    }
  }

  transitionTo(stateName) {
    const newState = this.states.get(stateName);
    if (!newState) {
      Debug.warn(`State '${stateName}' not found in StateMachine`);
      return;
    }

    if (this.currentState) {
      this.currentState.exit();
    }

    Debug.log(
      `State transition: ${this.currentState?.name || "null"} -> ${stateName}`
    );
    this.currentState = newState;
    this.currentState.enter();
  }

  getCurrentStateName() {
    return this.currentState?.name || null;
  }

  isInState(stateName) {
    return this.currentState?.name === stateName;
  }
}

// ==================== TILEMAP SYSTEM ====================

class Tilemap extends Component {
  constructor(tileWidth = 32, tileHeight = 32) {
    super();
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tiles = [];
    this.width = 0;
    this.height = 0;
    this.tileSprites = new Map(); // tile id -> sprite
    this.collisionLayer = [];
  }

  loadFromArray(mapData, mapWidth, mapHeight) {
    this.width = mapWidth;
    this.height = mapHeight;
    this.tiles = mapData;

    // Initialize collision layer (0 = passable, 1 = solid)
    this.collisionLayer = new Array(mapWidth * mapHeight).fill(0);
  }

  setCollisionLayer(collisionData) {
    this.collisionLayer = collisionData;
  }

  setTileSprite(tileId, imageSrc) {
    const image = new Image();
    image.onload = () => {
      this.tileSprites.set(tileId, image);
    };
    image.src = imageSrc;
  }

  getTileAt(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 0;
    }
    return this.tiles[y * this.width + x];
  }

  isCollisionAt(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return true; // Treat out of bounds as solid
    }
    return this.collisionLayer[y * this.width + x] === 1;
  }

  worldToTile(worldX, worldY) {
    return {
      x: Math.floor(worldX / this.tileWidth),
      y: Math.floor(worldY / this.tileHeight),
    };
  }

  tileToWorld(tileX, tileY) {
    return {
      x: tileX * this.tileWidth,
      y: tileY * this.tileHeight,
    };
  }

  checkCollisionAt(worldX, worldY, width, height) {
    const left = Math.floor((worldX - width / 2) / this.tileWidth);
    const right = Math.floor((worldX + width / 2) / this.tileWidth);
    const top = Math.floor((worldY - height / 2) / this.tileHeight);
    const bottom = Math.floor((worldY + height / 2) / this.tileHeight);

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        if (this.isCollisionAt(x, y)) {
          return true;
        }
      }
    }
    return false;
  }

  draw(ctx, camera) {
    const viewBounds = camera.getViewBounds(
      ctx.canvas.width,
      ctx.canvas.height
    );

    const startTileX = Math.max(
      0,
      Math.floor(viewBounds.left / this.tileWidth)
    );
    const endTileX = Math.min(
      this.width - 1,
      Math.floor(viewBounds.right / this.tileWidth)
    );
    const startTileY = Math.max(
      0,
      Math.floor(viewBounds.top / this.tileHeight)
    );
    const endTileY = Math.min(
      this.height - 1,
      Math.floor(viewBounds.bottom / this.tileHeight)
    );

    for (let x = startTileX; x <= endTileX; x++) {
      for (let y = startTileY; y <= endTileY; y++) {
        const tileId = this.getTileAt(x, y);
        if (tileId === 0) continue;

        const sprite = this.tileSprites.get(tileId);
        if (sprite) {
          const worldPos = this.tileToWorld(x, y);
          ctx.drawImage(
            sprite,
            worldPos.x,
            worldPos.y,
            this.tileWidth,
            this.tileHeight
          );
        }
      }
    }

    // Debug draw collision layer
    if (Debug.enabled) {
      ctx.save();
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      for (let x = startTileX; x <= endTileX; x++) {
        for (let y = startTileY; y <= endTileY; y++) {
          if (this.isCollisionAt(x, y)) {
            const worldPos = this.tileToWorld(x, y);
            ctx.fillRect(
              worldPos.x,
              worldPos.y,
              this.tileWidth,
              this.tileHeight
            );
          }
        }
      }
      ctx.restore();
    }
  }
}

class Transform extends Component {
  constructor(position = Vector2.zero(), rotation = 0, scale = Vector2.one()) {
    super();
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.parent = null;
    this.children = [];
  }

  getWorldPosition() {
    if (!this.parent) return this.position.copy();
    return this.parent.getWorldPosition().add(this.position);
  }

  setParent(parent) {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index > -1) this.parent.children.splice(index, 1);
    }

    this.parent = parent;
    if (parent) {
      parent.children.push(this);
    }
  }
}

class SpriteRenderer extends Component {
  constructor(imageSrc = null, width = 32, height = 32, layer = 0) {
    super();
    this.imageSrc = imageSrc;
    this.image = null;
    this.width = width;
    this.height = height;
    this.layer = layer;
    this.loaded = false;
    this.color = null;
    this.alpha = 1.0;
    this.flipX = false;
    this.flipY = false;
  }

  awake() {
    if (this.imageSrc && typeof this.imageSrc === "string") {
      this.loadImage(this.imageSrc);
    } else if (this.imageSrc && this.imageSrc instanceof HTMLImageElement) {
      this.image = this.imageSrc;
      this.loaded = true;
    }
  }

  loadImage(src) {
    this.image = new Image();
    this.image.onload = () => {
      this.loaded = true;
      Debug.log(`Image loaded: ${src}`);
    };
    this.image.onerror = () => {
      Debug.error(`Failed to load image: ${src}`);
    };
    this.image.src = src;
  }

  draw(ctx, camera) {
    if (!this.gameObject) return;

    const pos = this.gameObject.transform.position;
    const scale = this.gameObject.transform.scale;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(pos.x, pos.y);
    ctx.rotate(this.gameObject.transform.rotation);
    ctx.scale(scale.x * (this.flipX ? -1 : 1), scale.y * (this.flipY ? -1 : 1));

    if (this.loaded && this.image) {
      ctx.drawImage(
        this.image,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else if (this.color) {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      ctx.fillStyle = "#888888";
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    ctx.restore();
  }

  setColor(color) {
    this.color = color;
    this.image = null;
    this.loaded = true;
  }
}

class Collider extends Component {
  constructor(
    shape = "box",
    width = 32,
    height = 32,
    isTrigger = false,
    layer = "Default"
  ) {
    super();
    this.shape = shape;
    this.width = width;
    this.height = height;
    this.isTrigger = isTrigger;
    this.layer = layer;
    this.collidingWith = new Set();
    this.previousCollisions = new Set();
  }

  getBounds() {
    const pos = this.gameObject.transform.position;
    const scale = this.gameObject.transform.scale;
    const width = this.width * scale.x;
    const height = this.height * scale.y;

    return {
      left: pos.x - width / 2,
      right: pos.x + width / 2,
      top: pos.y - height / 2,
      bottom: pos.y + height / 2,
      centerX: pos.x,
      centerY: pos.y,
      width: width,
      height: height,
    };
  }

  onCollision(otherGameObject) {
    this.gameObject.sendMessage("collision", { other: otherGameObject });

    if (!this.collidingWith.has(otherGameObject.id)) {
      this.onCollisionEnter(otherGameObject);
      this.collidingWith.add(otherGameObject.id);
    }
  }

  update(deltaTime) {
    const currentCollisions = new Set(this.collidingWith);
    for (const objectId of this.previousCollisions) {
      if (!currentCollisions.has(objectId)) {
        this.onCollisionExit(objectId);
      }
    }
    this.previousCollisions = new Set(currentCollisions);
  }
}

class AudioSource extends Component {
  constructor(audioSrc = null, volume = 1.0, loop = false) {
    super();
    this.audioSrc = audioSrc;
    this.audio = null;
    this.volume = volume;
    this.loop = loop;
    this.loaded = false;
  }

  awake() {
    if (this.audioSrc) {
      this.loadAudio(this.audioSrc);
    }
  }

  loadAudio(src) {
    this.audio = new Audio();
    this.audio.oncanplaythrough = () => {
      this.loaded = true;
      Debug.log(`Audio loaded: ${src}`);
    };
    this.audio.onerror = () => {
      Debug.error(`Failed to load audio: ${src}`);
    };
    this.audio.volume = this.volume;
    this.audio.loop = this.loop;
    this.audio.src = src;
  }

  play() {
    if (this.loaded && this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch((e) => Debug.error("Audio play failed:", e));
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }
}

// ==================== ENHANCED PLAYER COMPONENT SYSTEM ====================

class Player extends Component {
  constructor(config = {}) {
    super();

    this.playerId = config.playerId || 1;
    this.playerName = config.playerName || `Player${this.playerId}`;
    this.movementType = config.movementType || "topdown";

    this.health = config.health || 100;
    this.maxHealth = config.maxHealth || 100;
    this.lives = config.lives || 3;
    this.score = config.score || 0;

    this.speed = config.speed || 200;
    this.maxSpeed = config.maxSpeed || 300;
    this.acceleration = config.acceleration || 800;
    this.deceleration = config.deceleration || 600;
    this.friction = config.friction || 0.85;

    this.jumpForce = config.jumpForce || 400;
    this.gravity = config.gravity || 980;
    this.groundDrag = config.groundDrag || 0.9;
    this.airDrag = config.airDrag || 0.98;
    this.coyoteTime = config.coyoteTime || 0.1;
    this.jumpBufferTime = config.jumpBufferTime || 0.1;

    this.steeringSpeed = config.steeringSpeed || 180;
    this.maxSteerAngle = config.maxSteerAngle || 30;
    this.downforce = config.downforce || 100;
    this.brakingForce = config.brakingForce || 1000;

    this.liftForce = config.liftForce || 300;
    this.maxAltitude = config.maxAltitude || 500;

    this.state = "idle";
    this.facing = config.facing || "right";
    this.isGrounded = false;
    this.isAlive = true;
    this.isInvulnerable = false;
    this.invulnerabilityTime = 0;

    this.velocity = new Vector2(0, 0);
    this.lastGroundedTime = 0;
    this.lastJumpInputTime = 0;

    this.inputConfig = {
      up: config.upKey || "KeyW",
      down: config.downKey || "KeyS",
      left: config.leftKey || "KeyA",
      right: config.rightKey || "KeyD",
      jump: config.jumpKey || "Space",
      action1: config.action1Key || "KeyE",
      action2: config.action2Key || "KeyQ",
      brake: config.brakeKey || "KeyS",
    };

    this.boundaries = config.boundaries || null;
    this.wrapAround = config.wrapAround || false;

    this.onHealthChanged = config.onHealthChanged || null;
    this.onDeath = config.onDeath || null;
    this.onJump = config.onJump || null;
    this.onLanding = config.onLanding || null;
    this.onStateChange = config.onStateChange || null;

    this.inputManager = null;
  }

  start() {
    if (this.gameObject.scene && this.gameObject.scene.engine) {
      this.inputManager = this.gameObject.scene.engine.inputManager;
    }
    this.updateSpriteDirection();
  }

  update(deltaTime) {
    if (!this.isAlive || !this.inputManager) return;
    

    this.updateTimers(deltaTime);
    this.handleInput(deltaTime);
    this.applyPhysics(deltaTime);
    this.updatePosition(deltaTime);
    this.handleBoundaries();
    this.updateState();
    this.updateSpriteDirection();
  }

  updateTimers(deltaTime) {
    if (this.isInvulnerable) {
      this.invulnerabilityTime -= deltaTime;
      if (this.invulnerabilityTime <= 0) {
        this.isInvulnerable = false;
      }
    }

    this.lastGroundedTime += deltaTime;
    this.lastJumpInputTime += deltaTime;
  }

  handleInput(deltaTime) {
    
    switch (this.movementType) {
      case "topdown":
        this.handleTopDownInput(deltaTime);
        break;
      case "platformer":
        this.handlePlatformerInput(deltaTime);
        break;
      case "racing":
        this.handleRacingInput(deltaTime);
        break;
      case "sidescroller":
        this.handleSideScrollerInput(deltaTime);
        break;
      case "flying":
        this.handleFlyingInput(deltaTime);
        break;
    }
  }

  handleTopDownInput(deltaTime) {
    const movement = new Vector2(0, 0);

    if (this.inputManager.isKeyDown(this.inputConfig.up)) movement.y -= 1;
    if (this.inputManager.isKeyDown(this.inputConfig.down)) movement.y += 1;
    if (this.inputManager.isKeyDown(this.inputConfig.left)) movement.x -= 1;
    if (this.inputManager.isKeyDown(this.inputConfig.right)) movement.x += 1;

    if (movement.magnitude() > 0) {
      const normalized = movement.normalize();
      this.velocity = normalized.multiplyByScalar(this.speed);
      this.updateFacing(normalized);
    } else {
      this.velocity = this.velocity.multiplyByScalar(this.friction);
    }
  }

  handlePlatformerInput(deltaTime) {
    // console.log("Doing something", this.inputConfig);

    let horizontalInput = 0;
    if (this.inputManager.isKeyDown(this.inputConfig.left))
      horizontalInput -= 1;
    if (this.inputManager.isKeyDown(this.inputConfig.right))
      horizontalInput += 1;

    if (horizontalInput !== 0) {
      this.velocity.x += horizontalInput * this.acceleration * deltaTime;
      this.velocity.x = Math.max(
        -this.maxSpeed,
        Math.min(this.maxSpeed, this.velocity.x)
      );
      this.updateFacing(new Vector2(horizontalInput, 0));
    } else {
      const drag = this.isGrounded ? this.groundDrag : this.airDrag;
      this.velocity.x *= drag;
    }

    if (this.inputManager.isKeyDown(this.inputConfig.jump)) {
      this.lastJumpInputTime = 0;
    }

    if (
      this.lastJumpInputTime < this.jumpBufferTime &&
      (this.isGrounded || this.lastGroundedTime < this.coyoteTime)
    ) {
      this.jump();
      this.lastJumpInputTime = this.jumpBufferTime;
    }

    // const wPressed = this.inputManager.isKeyPressed("KeyW");
    // const spacePressed = this.inputManager.isKeyPressed("Space");
    // const jumpPressed = this.inputManager.isKeyPressed(this.inputConfig.jump);

    // console.log(
    //   "Jump check - W:",
    //   wPressed,
    //   "Space:",
    //   spacePressed,
    //   "Jump config:",
    //   jumpPressed
    // );

    // if (wPressed || spacePressed || jumpPressed) {
    //   this.lastJumpInputTime = 0;
    //   console.log("Jump input detected!");
    // }

    if (
      this.inputManager.isKeyDown(this.inputConfig.jump) ||
      this.inputManager.isKeyDown("Space")
    ) {
      this.lastJumpInputTime = 0;
      console.log("Jump input detected");
    }

    // Jump conditions with better buffer and coyote time
    const canJump =
      (this.isGrounded || this.lastGroundedTime < this.coyoteTime) &&
      this.lastJumpInputTime < this.jumpBufferTime &&
      this.lastJumpInputTime >= 0;

    if (canJump) {
      this.jump();
      this.lastJumpInputTime = this.jumpBufferTime + 0.1; // Prevent multiple jumps from same input
      console.log("Jump executed!");
    }
  }

  handleRacingInput(deltaTime) {
    let throttle = 0;
    let steering = 0;
    let braking = false;

    if (this.inputManager.isKeyDown(this.inputConfig.up)) throttle = 1;
    if (this.inputManager.isKeyDown(this.inputConfig.down)) throttle = -0.5;

    if (this.inputManager.isKeyDown(this.inputConfig.left)) steering = -1;
    if (this.inputManager.isKeyDown(this.inputConfig.right)) steering = 1;

    if (this.inputManager.isKeyDown(this.inputConfig.brake)) braking = true;

    const currentSpeed = this.velocity.magnitude();

    if (throttle !== 0) {
      const forceDirection = this.getForwardVector();
      const force = forceDirection.multiplyByScalar(
        throttle * this.acceleration
      );
      this.velocity = this.velocity.add(force.multiplyByScalar(deltaTime));
    }

    if (steering !== 0 && currentSpeed > 10) {
      const steerAmount =
        steering *
        this.steeringSpeed *
        deltaTime *
        (currentSpeed / this.maxSpeed);
      this.gameObject.transform.rotation += (steerAmount * Math.PI) / 180;
    }

    if (braking) {
      const brakeForce = this.velocity
        .normalize()
        .multiplyByScalar(-this.brakingForce * deltaTime);
      this.velocity = this.velocity.add(brakeForce);
    }

    this.velocity = this.velocity.multiplyByScalar(this.friction);

    if (this.velocity.magnitude() > this.maxSpeed) {
      this.velocity = this.velocity.normalize().multiplyByScalar(this.maxSpeed);
    }
  }

  handleSideScrollerInput(deltaTime) {
    let horizontalInput = 0;
    if (this.inputManager.isKeyDown(this.inputConfig.left))
      horizontalInput -= 1;
    if (this.inputManager.isKeyDown(this.inputConfig.right))
      horizontalInput += 1;

    if (horizontalInput !== 0) {
      this.velocity.x = horizontalInput * this.speed;
      this.updateFacing(new Vector2(horizontalInput, 0));
    } else {
      this.velocity.x *= this.friction;
    }

    if (this.inputManager.isKeyDown(this.inputConfig.up)) {
      this.velocity.y = -this.speed * 0.5;
    } else if (this.inputManager.isKeyDown(this.inputConfig.down)) {
      this.velocity.y = this.speed * 0.5;
    } else {
      this.velocity.y *= this.friction;
    }
  }

  handleFlyingInput(deltaTime) {
    const movement = new Vector2(0, 0);

    if (this.inputManager.isKeyDown(this.inputConfig.up)) movement.y -= 1;
    if (this.inputManager.isKeyDown(this.inputConfig.down)) movement.y += 1;
    if (this.inputManager.isKeyDown(this.inputConfig.left)) movement.x -= 1;
    if (this.inputManager.isKeyDown(this.inputConfig.right)) movement.x += 1;

    if (movement.magnitude() > 0) {
      const normalized = movement.normalize();
      const force = normalized.multiplyByScalar(this.liftForce * deltaTime);
      this.velocity = this.velocity.add(force);
      this.updateFacing(normalized);
    }

    this.velocity = this.velocity.multiplyByScalar(this.airDrag);

    if (this.velocity.magnitude() > this.maxSpeed) {
      this.velocity = this.velocity.normalize().multiplyByScalar(this.maxSpeed);
    }
  }

  applyPhysics(deltaTime) {
    switch (this.movementType) {
      case "platformer":
        if (!this.isGrounded) {
          this.velocity.y += this.gravity * deltaTime;
        }
        break;

      case "flying":
        this.velocity.y += this.gravity * 0.1 * deltaTime;
        break;
    }
  }

  updatePosition(deltaTime) {
    const movement = this.velocity.multiplyByScalar(deltaTime);
    this.gameObject.transform.position =
      this.gameObject.transform.position.add(movement);
  }

  handleBoundaries() {
    if (!this.boundaries) return;

    const pos = this.gameObject.transform.position;
    let newPos = pos.copy();

    if (this.wrapAround) {
      if (pos.x < this.boundaries.left) newPos.x = this.boundaries.right;
      if (pos.x > this.boundaries.right) newPos.x = this.boundaries.left;
      if (pos.y < this.boundaries.top) newPos.y = this.boundaries.bottom;
      if (pos.y > this.boundaries.bottom) newPos.y = this.boundaries.top;
    } else {
      newPos.x = Math.max(
        this.boundaries.left,
        Math.min(this.boundaries.right, pos.x)
      );
      newPos.y = Math.max(
        this.boundaries.top,
        Math.min(this.boundaries.bottom, pos.y)
      );

      if (pos.x <= this.boundaries.left || pos.x >= this.boundaries.right) {
        this.velocity.x = 0;
      }
      if (pos.y <= this.boundaries.top || pos.y >= this.boundaries.bottom) {
        this.velocity.y = 0;
      }
    }

    this.gameObject.transform.position = newPos;
  }

  updateState() {
    const oldState = this.state;

    if (!this.isAlive) {
      this.state = "dead";
    } else if (this.movementType === "platformer") {
      if (!this.isGrounded && this.velocity.y > 0) {
        this.state = "falling";
      } else if (!this.isGrounded && this.velocity.y < 0) {
        this.state = "jumping";
      } else if (Math.abs(this.velocity.x) > 10) {
        this.state = "moving";
      } else {
        this.state = "idle";
      }
    } else {
      if (this.velocity.magnitude() > 10) {
        this.state = "moving";
      } else {
        this.state = "idle";
      }
    }

    if (oldState !== this.state && this.onStateChange) {
      this.onStateChange(this.state, oldState);
    }
  }

  updateSpriteDirection() {
    const spriteRenderer = this.gameObject.getComponent(SpriteRenderer);
    if (!spriteRenderer) return;

    if (this.facing === "left") {
      spriteRenderer.flipX = true;
    } else if (this.facing === "right") {
      spriteRenderer.flipX = false;
    }
  }

  updateFacing(direction) {
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
      this.facing = direction.x > 0 ? "right" : "left";
    } else if (direction.y !== 0) {
      this.facing = direction.y > 0 ? "down" : "up";
    }
  }

  getForwardVector() {
    const rotation = this.gameObject.transform.rotation;
    return new Vector2(Math.cos(rotation), Math.sin(rotation));
  }

  // In Player class, replace the jump method:
  jump() {
    if (this.movementType !== "platformer") return;

    console.log("Jumping with force:", this.jumpForce);
    this.velocity.y = -this.jumpForce;
    this.isGrounded = false;
    this.lastGroundedTime = this.coyoteTime + 0.1; // Ensure coyote time is exceeded

    if (this.onJump) this.onJump();
  }

  takeDamage(amount) {
    if (this.isInvulnerable || !this.isAlive) return false;

    this.health = Math.max(0, this.health - amount);

    if (this.onHealthChanged) this.onHealthChanged(this.health, this.maxHealth);

    if (this.health <= 0) {
      this.die();
    } else {
      this.makeInvulnerable(1.0);
    }

    return true;
  }

  heal(amount) {
    if (!this.isAlive) return false;

    const oldHealth = this.health;
    this.health = Math.min(this.maxHealth, this.health + amount);

    if (this.onHealthChanged && oldHealth !== this.health) {
      this.onHealthChanged(this.health, this.maxHealth);
    }

    return oldHealth !== this.health;
  }

  makeInvulnerable(duration) {
    this.isInvulnerable = true;
    this.invulnerabilityTime = duration;

    const spriteRenderer = this.gameObject.getComponent(SpriteRenderer);
    if (spriteRenderer) {
      spriteRenderer.alpha = 0.5;
      setTimeout(() => {
        if (spriteRenderer.gameObject) spriteRenderer.alpha = 1.0;
      }, duration * 1000);
    }
  }

  die() {
    this.isAlive = false;
    this.velocity = Vector2.zero();
    this.lives--;

    if (this.onDeath) this.onDeath();
  }

  respawn(position = null) {
    this.isAlive = true;
    this.health = this.maxHealth;
    this.velocity = Vector2.zero();
    this.state = "idle";
    this.makeInvulnerable(2.0);

    if (position) {
      this.gameObject.transform.position = position.copy();
    }
  }

  addScore(points) {
    this.score += points;
  }

  setGrounded(grounded) {
    const wasGrounded = this.isGrounded;
    this.isGrounded = grounded;

    if (grounded && !wasGrounded) {
      this.lastGroundedTime = 0;
      if (this.onLanding) this.onLanding();
    }
  }

  setMovementType(type) {
    this.movementType = type;
    this.velocity = Vector2.zero();
  }

  setBoundaries(left, top, right, bottom) {
    this.boundaries = { left, top, right, bottom };
  }

  setInputConfig(config) {
    this.inputConfig = { ...this.inputConfig, ...config };
  }
}

// ==================== SPECIALIZED PLAYER CLASSES ====================

class PlatformerPlayer extends Player {
  constructor(config = {}) {
    super({
      movementType: "platformer",
      speed: 200,
      jumpForce: 400,
      gravity: 980,
      ...config,
    });
  }
}

class RacingPlayer extends Player {
  constructor(config = {}) {
    super({
      movementType: "racing",
      speed: 300,
      maxSpeed: 500,
      steeringSpeed: 180,
      acceleration: 600,
      friction: 0.95,
      ...config,
    });
  }
}

class TopDownPlayer extends Player {
  constructor(config = {}) {
    super({
      movementType: "topdown",
      speed: 250,
      friction: 0.85,
      ...config,
    });
  }
}

class FlyingPlayer extends Player {
  constructor(config = {}) {
    super({
      movementType: "flying",
      speed: 200,
      liftForce: 300,
      airDrag: 0.98,
      gravity: 98,
      ...config,
    });
  }
}

// ==================== GAME OBJECT SYSTEM ====================

class GameObject {
  constructor(name = "GameObject") {
    this.id = generateUniqueId();
    this.name = name;
    this.transform = {
      position: new Vector2(0, 0),
      rotation: 0,
      scale: new Vector2(1, 1),
    };
    this.components = [];
    this.componentCache = new Map();
    this.scene = null;
    this.active = true;
    this.started = false;
  }

  addComponent(component) {
    if (component.gameObject) {
      Debug.warn("Component already belongs to another GameObject");
      return null;
    }

    component.gameObject = this;
    this.components.push(component);

    const className = component.constructor.name;
    if (!this.componentCache.has(className)) {
      this.componentCache.set(className, []);
    }
    this.componentCache.get(className).push(component);

    component.awake();

    if (this.started && this.scene) {
      component.start();
    }

    Debug.log(`Added component ${className} to ${this.name}`);
    return component;
  }

  // QUALITY OF LIFE IMPROVEMENT #1: Enhanced getComponent with inheritance support
  getComponent(ComponentClass) {
    // First try exact match for performance
    const className = ComponentClass.name;
    const cached = this.componentCache.get(className);
    if (cached && cached.length > 0) {
      return cached[0];
    }

    // If no exact match, search through all components using instanceof
    for (const component of this.components) {
      if (component instanceof ComponentClass) {
        // Cache for future lookups
        if (!this.componentCache.has(className)) {
          this.componentCache.set(className, []);
        }
        this.componentCache.get(className).push(component);
        return component;
      }
    }

    return null;
  }

  getComponents(ComponentClass) {
    const result = [];
    for (const component of this.components) {
      if (component instanceof ComponentClass) {
        result.push(component);
      }
    }
    return result;
  }

  removeComponent(ComponentClass) {
    const component = this.getComponent(ComponentClass);
    if (component) {
      component.onDestroy();
      const index = this.components.indexOf(component);
      this.components.splice(index, 1);

      // Clear all cache entries that might contain this component
      this.componentCache.forEach((cachedComponents, key) => {
        const cacheIndex = cachedComponents.indexOf(component);
        if (cacheIndex > -1) {
          cachedComponents.splice(cacheIndex, 1);
        }
      });

      component.gameObject = null;
      Debug.log(
        `Removed component ${component.constructor.name} from ${this.name}`
      );
    }
  }

  sendMessage(message, data = null) {
    this.components.forEach((component) => {
      if (component.enabled && component.onMessage) {
        try {
          component.onMessage(message, data);
        } catch (error) {
          Debug.error(
            `Error in component ${component.constructor.name} handling message ${message}:`,
            error
          );
        }
      }
    });
  }

  start() {
    if (this.started) return;
    this.started = true;

    this.components.forEach((component) => {
      if (!component.started) {
        component.start();
      }
    });
  }

  update(deltaTime) {
    if (!this.active) return;

    this.components.forEach((component) => {
      if (component.enabled) {
        try {
          component.update(deltaTime);
        } catch (error) {
          Debug.error(
            `Error updating component ${component.constructor.name}:`,
            error
          );
        }
      }
    });
  }

  lateUpdate(deltaTime) {
    if (!this.active) return;

    this.components.forEach((component) => {
      if (component.enabled && component.lateUpdate) {
        try {
          component.lateUpdate(deltaTime);
        } catch (error) {
          Debug.error(
            `Error in lateUpdate for component ${component.constructor.name}:`,
            error
          );
        }
      }
    });
  }

  destroy() {
    this.components.forEach((component) => {
      try {
        component.onDestroy();
      } catch (error) {
        Debug.error(
          `Error destroying component ${component.constructor.name}:`,
          error
        );
      }
    });

    if (this.scene) {
      this.scene.removeGameObject(this);
    }

    this.components = [];
    this.componentCache.clear();
    Debug.log(`Destroyed GameObject: ${this.name}`);
  }

  setActive(active) {
    this.active = active;
  }
}

// ==================== SCENE SYSTEM ====================

class Camera {
  constructor() {
    this.position = new Vector2(0, 0);
    this.zoom = 1;
    this.target = null;
    this.followSpeed = 2;
    this.bounds = null;
  }

  follow(gameObject, speed = 2) {
    this.target = gameObject;
    this.followSpeed = speed;
  }

  setBounds(left, top, right, bottom) {
    this.bounds = { left, top, right, bottom };
  }

  update(deltaTime) {
    if (this.target) {
      const targetPos = this.target.transform.position;
      const diff = targetPos.subtract(this.position);
      const movement = diff.multiplyByScalar(this.followSpeed * deltaTime);
      this.position = this.position.add(movement);

      if (this.bounds) {
        this.position.x = Math.max(
          this.bounds.left,
          Math.min(this.bounds.right, this.position.x)
        );
        this.position.y = Math.max(
          this.bounds.top,
          Math.min(this.bounds.bottom, this.position.y)
        );
      }
    }
  }

  worldToScreenPoint(worldPoint, canvasWidth, canvasHeight) {
    return new Vector2(
      (worldPoint.x - this.position.x) * this.zoom + canvasWidth / 2,
      (worldPoint.y - this.position.y) * this.zoom + canvasHeight / 2
    );
  }

  screenToWorldPoint(screenPoint, canvasWidth, canvasHeight) {
    return new Vector2(
      (screenPoint.x - canvasWidth / 2) / this.zoom + this.position.x,
      (screenPoint.y - canvasHeight / 2) / this.zoom + this.position.y
    );
  }

  getViewBounds(canvasWidth, canvasHeight) {
    const halfWidth = canvasWidth / 2 / this.zoom;
    const halfHeight = canvasHeight / 2 / this.zoom;

    return {
      left: this.position.x - halfWidth,
      right: this.position.x + halfWidth,
      top: this.position.y - halfHeight,
      bottom: this.position.y + halfHeight,
    };
  }
}

class Scene {
  constructor(name = "Scene") {
    this.name = name;
    this.gameObjects = [];
    this.camera = new Camera();
    this.engine = null;
    this.started = false;
    this.eventBus = new EventBus();
    this.backgroundColor = null;

    // QUALITY OF LIFE IMPROVEMENT #3: Timer system
    this.timers = new TimerManager();
  }

  init() {
    Debug.log(`Initializing scene: ${this.name}`);
  }

  // QUALITY OF LIFE IMPROVEMENT #2: Fluent API for GameObject creation
  createGameObject(name) {
    const gameObject = new GameObject(name);
    return new GameObjectBuilder(gameObject, this);
  }

  addGameObject(gameObject) {
    if (gameObject.scene) {
      Debug.warn("GameObject already belongs to a scene");
      return;
    }

    gameObject.scene = this;
    this.gameObjects.push(gameObject);

    if (this.started) {
      gameObject.start();
    }

    this.eventBus.emit("gameobject_added", gameObject);
    Debug.log(`Added GameObject ${gameObject.name} to scene ${this.name}`);
    return gameObject;
  }

  removeGameObject(gameObject) {
    const index = this.gameObjects.indexOf(gameObject);
    if (index > -1) {
      this.gameObjects.splice(index, 1);
      gameObject.scene = null;
      this.eventBus.emit("gameobject_removed", gameObject);
      Debug.log(
        `Removed GameObject ${gameObject.name} from scene ${this.name}`
      );
    }
  }

  findGameObject(name) {
    return this.gameObjects.find((obj) => obj.name === name);
  }

  findGameObjects(name) {
    return this.gameObjects.filter((obj) => obj.name === name);
  }

  findGameObjectWithComponent(ComponentClass) {
    return this.gameObjects.find(
      (obj) => obj.getComponent(ComponentClass) !== null
    );
  }

  findGameObjectsWithComponent(ComponentClass) {
    return this.gameObjects.filter(
      (obj) => obj.getComponent(ComponentClass) !== null
    );
  }

  // QUALITY OF LIFE IMPROVEMENT #3: Timer methods
  setTimeout(callback, delay) {
    return this.timers.setTimeout(callback, delay);
  }

  setInterval(callback, delay) {
    return this.timers.setInterval(callback, delay);
  }

  clearTimer(timer) {
    this.timers.clearTimer(timer);
  }

  start() {
    if (this.started) return;
    this.started = true;

    this.gameObjects.forEach((gameObject) => gameObject.start());
    this.eventBus.emit("scene_started", this);
    Debug.log(`Started scene: ${this.name}`);
  }

  update(deltaTime) {
    this.timers.update(deltaTime);
    this.camera.update(deltaTime);
    this.gameObjects.forEach((gameObject) => gameObject.update(deltaTime));
    this.gameObjects.forEach((gameObject) => gameObject.lateUpdate(deltaTime));
  }

  destroy() {
    Debug.log(`Destroying scene: ${this.name}`);
    this.gameObjects.forEach((gameObject) => gameObject.destroy());
    this.gameObjects = [];
    this.timers.clear();
    this.eventBus.clear();
    this.started = false;
  }

  setBackgroundColor(color) {
    this.backgroundColor = color;
  }
}

// QUALITY OF LIFE IMPROVEMENT #2: Fluent API Builder
class GameObjectBuilder {
  constructor(gameObject, scene) {
    this.gameObject = gameObject;
    this.scene = scene;
  }

  at(x, y) {
    this.gameObject.transform.position = new Vector2(x, y);
    return this;
  }

  withSprite(imageSrc, width = 32, height = 32, layer = 0) {
    const sprite = new SpriteRenderer(imageSrc, width, height, layer);
    this.gameObject.addComponent(sprite);
    return this;
  }

  withColor(color, width = 32, height = 32, layer = 0) {
    const sprite = new SpriteRenderer(null, width, height, layer);
    sprite.setColor(color);
    this.gameObject.addComponent(sprite);
    return this;
  }

  withCollider(
    shape = "box",
    width = 32,
    height = 32,
    isTrigger = false,
    layer = "Default"
  ) {
    const collider = new Collider(shape, width, height, isTrigger, layer);
    this.gameObject.addComponent(collider);
    return this;
  }

  withComponent(component) {
    this.gameObject.addComponent(component);
    return this;
  }

  withPlayer(config = {}) {
    const player = new Player(config);
    this.gameObject.addComponent(player);
    return this;
  }

  withPlatformerPlayer(config = {}) {
    const player = new PlatformerPlayer(config);
    this.gameObject.addComponent(player);
    return this;
  }

  withRacingPlayer(config = {}) {
    const player = new RacingPlayer(config);
    this.gameObject.addComponent(player);
    return this;
  }

  withTopDownPlayer(config = {}) {
    const player = new TopDownPlayer(config);
    this.gameObject.addComponent(player);
    return this;
  }

  withFlyingPlayer(config = {}) {
    const player = new FlyingPlayer(config);
    this.gameObject.addComponent(player);
    return this;
  }

  withStateMachine(initialState = null) {
    const stateMachine = new StateMachine(initialState);
    this.gameObject.addComponent(stateMachine);
    return this;
  }

  withTilemap(tileWidth = 32, tileHeight = 32) {
    const tilemap = new Tilemap(tileWidth, tileHeight);
    this.gameObject.addComponent(tilemap);
    return this;
  }

  withAudio(audioSrc, volume = 1.0, loop = false) {
    const audio = new AudioSource(audioSrc, volume, loop);
    this.gameObject.addComponent(audio);
    return this;
  }

  build() {
    this.scene.addGameObject(this.gameObject);
    return this.gameObject;
  }
}

class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.activeScene = null;
    this.eventBus = new EventBus();
  }

  add(name, scene) {
    if (this.scenes.has(name)) {
      Debug.warn(`Scene with name '${name}' already exists`);
      return;
    }

    this.scenes.set(name, scene);
    this.eventBus.emit("scene_added", { name, scene });
    Debug.log(`Added scene: ${name}`);
  }

  remove(name) {
    const scene = this.scenes.get(name);
    if (scene) {
      if (scene === this.activeScene) {
        this.activeScene = null;
      }
      scene.destroy();
      this.scenes.delete(name);
      this.eventBus.emit("scene_removed", { name, scene });
      Debug.log(`Removed scene: ${name}`);
    }
  }

  load(name) {
    const scene = this.scenes.get(name);
    if (!scene) {
      Debug.error(`Scene '${name}' not found`);
      return false;
    }

    if (this.activeScene) {
      this.eventBus.emit("scene_unloaded", {
        name: this.activeScene.name,
        scene: this.activeScene,
      });
    }

    this.activeScene = scene;
    scene.init();
    scene.start();
    this.eventBus.emit("scene_loaded", { name, scene });
    Debug.log(`Loaded scene: ${name}`);
    return true;
  }

  getActiveScene() {
    return this.activeScene;
  }

  getScene(name) {
    return this.scenes.get(name);
  }

  update(deltaTime) {
    if (this.activeScene) {
      this.activeScene.update(deltaTime);
    }
  }
}

// ==================== MANAGER CLASSES ====================

class InputManager {
  constructor() {
    this.keys = new Map();
    this.previousKeys = new Map();
    this.mousePosition = new Vector2(0, 0);
    this.mouseButtons = new Map();
    this.previousMouseButtons = new Map();
    this.canvas = null;
    this.setupEventListeners();
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  setupEventListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys.set(e.code, true);
      e.preventDefault();
    });

    window.addEventListener("keyup", (e) => {
      this.keys.set(e.code, false);
    });

    window.addEventListener("mousemove", (e) => {
      if (this.canvas) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = e.clientX - rect.left;
        this.mousePosition.y = e.clientY - rect.top;
      } else {
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
      }
    });

    window.addEventListener("mousedown", (e) => {
      this.mouseButtons.set(e.button, true);
      e.preventDefault();
    });

    window.addEventListener("mouseup", (e) => {
      this.mouseButtons.set(e.button, false);
    });

    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  isKeyDown(keyCode) {
    return this.keys.get(keyCode) || false;
  }

  isKeyUp(keyCode) {
    return !this.keys.get(keyCode);
  }

  isKeyPressed(keyCode) {
    return (
      (this.keys.get(keyCode) || false) &&
      !(this.previousKeys.get(keyCode) || false)
    );
  }

  isKeyReleased(keyCode) {
    return (
      !(this.keys.get(keyCode) || false) &&
      (this.previousKeys.get(keyCode) || false)
    );
  }

  isMouseButtonDown(button) {
    return this.mouseButtons.get(button) || false;
  }

  isMouseButtonPressed(button) {
    return (
      (this.mouseButtons.get(button) || false) &&
      !(this.previousMouseButtons.get(button) || false)
    );
  }

  isMouseButtonReleased(button) {
    return (
      !(this.mouseButtons.get(button) || false) &&
      (this.previousMouseButtons.get(button) || false)
    );
  }

  getMousePosition() {
    return this.mousePosition.copy();
  }

  getMouseWorldPosition(camera, canvasWidth, canvasHeight) {
    return camera.screenToWorldPoint(
      this.mousePosition,
      canvasWidth,
      canvasHeight
    );
  }

  update() {
    this.previousKeys.clear();
    this.keys.forEach((value, key) => this.previousKeys.set(key, value));

    this.previousMouseButtons.clear();
    this.mouseButtons.forEach((value, key) =>
      this.previousMouseButtons.set(key, value)
    );
  }
}

class AssetManager {
  constructor() {
    this.imageCache = new Map();
    this.audioCache = new Map();
    this.loadedAssets = 0;
    this.totalAssets = 0;
    this.loadingPromises = new Map();
  }

  async loadImage(path) {
    if (this.imageCache.has(path)) {
      return this.imageCache.get(path);
    }

    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path);
    }

    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        this.imageCache.set(path, image);
        this.loadedAssets++;
        this.loadingPromises.delete(path);
        Debug.log(`Loaded image: ${path}`);
        resolve(image);
      };
      image.onerror = (error) => {
        this.loadingPromises.delete(path);
        Debug.error(`Failed to load image: ${path}`, error);
        reject(error);
      };
      image.src = path;
    });

    this.loadingPromises.set(path, promise);
    this.totalAssets++;
    return promise;
  }

  async loadAudio(path) {
    if (this.audioCache.has(path)) {
      return this.audioCache.get(path);
    }

    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path);
    }

    const promise = new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.audioCache.set(path, audio);
        this.loadedAssets++;
        this.loadingPromises.delete(path);
        Debug.log(`Loaded audio: ${path}`);
        resolve(audio);
      };
      audio.onerror = (error) => {
        this.loadingPromises.delete(path);
        Debug.error(`Failed to load audio: ${path}`, error);
        reject(error);
      };
      audio.src = path;
    });

    this.loadingPromises.set(path, promise);
    this.totalAssets++;
    return promise;
  }

  async loadMultiple(assets) {
    const promises = assets.map((asset) => {
      if (asset.type === "image") {
        return this.loadImage(asset.path);
      } else if (asset.type === "audio") {
        return this.loadAudio(asset.path);
      }
    });

    return Promise.all(promises);
  }

  getLoadingProgress() {
    return this.totalAssets === 0 ? 1 : this.loadedAssets / this.totalAssets;
  }

  isLoading() {
    return this.loadingPromises.size > 0;
  }

  getImage(path) {
    return this.imageCache.get(path);
  }

  getAudio(path) {
    return this.audioCache.get(path);
  }

  clear() {
    this.imageCache.clear();
    this.audioCache.clear();
    this.loadingPromises.clear();
    this.loadedAssets = 0;
    this.totalAssets = 0;
  }
}

// QUALITY OF LIFE IMPROVEMENT #6: Enhanced Physics Engine with Layer System
class PhysicsEngine {
  constructor() {
    this.gravity = new Vector2(0, 980);
    this.collisionPairs = new Map();
  }

  setCollisionRule(layerA, layerB, canCollide) {
    PhysicsLayers.setCollisionRule(layerA, layerB, canCollide);
  }

  update(scene) {
    if (!scene) return;

    const collidableObjects = scene.findGameObjectsWithComponent(Collider);
    const currentCollisions = new Set();

    for (let i = 0; i < collidableObjects.length; i++) {
      for (let j = i + 1; j < collidableObjects.length; j++) {
        const objA = collidableObjects[i];
        const objB = collidableObjects[j];

        if (!objA.active || !objB.active) continue;

        const colliderA = objA.getComponent(Collider);
        const colliderB = objB.getComponent(Collider);

        if (!colliderA.enabled || !colliderB.enabled) continue;

        // QUALITY OF LIFE IMPROVEMENT #6: Check collision matrix
        if (!PhysicsLayers.canCollide(colliderA.layer, colliderB.layer)) {
          continue; // Skip collision check if layers shouldn't interact
        }

        const pairKey = this.getPairKey(objA.id, objB.id);

        if (this.checkCollision(objA, objB)) {
          currentCollisions.add(pairKey);

          if (!this.collisionPairs.has(pairKey)) {
            colliderA.onCollisionEnter(objB);
            colliderB.onCollisionEnter(objA);
            this.collisionPairs.set(pairKey, { objA, objB });
          }

          colliderA.onCollision(objB);
          colliderB.onCollision(objA);

          // ADD THIS LINE - Resolve solid collisions
          this.resolveCollision(objA, objB);
        } else if (this.collisionPairs.has(pairKey)) {
          const pair = this.collisionPairs.get(pairKey);
          pair.objA.getComponent(Collider)?.onCollisionExit(pair.objB);
          pair.objB.getComponent(Collider)?.onCollisionExit(pair.objA);
          this.collisionPairs.delete(pairKey);
        }
      }
    }

    for (const [key, pair] of this.collisionPairs) {
      if (!currentCollisions.has(key)) {
        this.collisionPairs.delete(key);
      }
    }
  }

  getPairKey(idA, idB) {
    return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
  }

  // Add this method to PhysicsEngine class
  // Add or replace this method in PhysicsEngine class:
  resolveCollision(objA, objB) {
    const colliderA = objA.getComponent(Collider);
    const colliderB = objB.getComponent(Collider);

    // Skip if either is a trigger
    if (colliderA.isTrigger || colliderB.isTrigger) return;

    // Only resolve Player vs Platform collisions
    let player, platform;
    if (colliderA.layer === "Player" && colliderB.layer === "Platform") {
      player = objA;
      platform = objB;
    } else if (colliderB.layer === "Player" && colliderA.layer === "Platform") {
      player = objB;
      platform = objA;
    } else {
      return; // Not a player-platform collision
    }

    const playerBounds = player.getComponent(Collider).getBounds();
    const platformBounds = platform.getComponent(Collider).getBounds();

    // Calculate overlap
    const overlapX = Math.min(
      playerBounds.right - platformBounds.left,
      platformBounds.right - playerBounds.left
    );
    const overlapY = Math.min(
      playerBounds.bottom - platformBounds.top,
      platformBounds.bottom - playerBounds.top
    );

    // Only resolve if there's significant overlap
    if (overlapX > 2 && overlapY > 2) {
      if (overlapX < overlapY) {
        // Horizontal collision
        const moveX =
          overlapX * (playerBounds.centerX < platformBounds.centerX ? -1 : 1);
        player.transform.position.x += moveX * 0.5;
      } else {
        // Vertical collision - push player up if coming from above
        if (playerBounds.centerY < platformBounds.centerY) {
          player.transform.position.y =
            platformBounds.top - playerBounds.height / 2;
          const playerComponent = player.getComponent(Player);
          if (playerComponent && playerComponent.velocity.y > 0) {
            playerComponent.velocity.y = 0;
          }
        }
      }
    }
  }

  checkCollision(objA, objB) {
    const colliderA = objA.getComponent(Collider);
    const colliderB = objB.getComponent(Collider);

    if (!colliderA || !colliderB) return false;

    const boundsA = colliderA.getBounds();
    const boundsB = colliderB.getBounds();

    return !(
      boundsA.right < boundsB.left ||
      boundsA.left > boundsB.right ||
      boundsA.bottom < boundsB.top ||
      boundsA.top > boundsB.bottom
    );
  }

  resolveCollision(objA, objB) {
    const colliderA = objA.getComponent(Collider);
    const colliderB = objB.getComponent(Collider);

    if (colliderA.isTrigger || colliderB.isTrigger) return;

    const boundsA = colliderA.getBounds();
    const boundsB = colliderB.getBounds();

    const overlapX = Math.min(
      boundsA.right - boundsB.left,
      boundsB.right - boundsA.left
    );
    const overlapY = Math.min(
      boundsA.bottom - boundsB.top,
      boundsB.bottom - boundsA.top
    );

    if (overlapX < overlapY) {
      const moveX =
        (overlapX / 2) * (boundsA.centerX < boundsB.centerX ? -1 : 1);
      objA.transform.position.x += moveX;
      objB.transform.position.x -= moveX;
    } else {
      const moveY =
        (overlapY / 2) * (boundsA.centerY < boundsB.centerY ? -1 : 1);
      objA.transform.position.y += moveY;
      objB.transform.position.y -= moveY;
    }
  }
}

class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.backgroundColor = "#000000";
    this.renderStats = {
      objectsRendered: 0,
      culledObjects: 0,
    };
  }

  render(scene) {
    if (!scene) return;

    this.renderStats.objectsRendered = 0;
    this.renderStats.culledObjects = 0;

    this.ctx.fillStyle = scene.backgroundColor || this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();

    const camera = scene.camera;
    this.ctx.translate(
      this.canvas.width / 2 - camera.position.x * camera.zoom,
      this.canvas.height / 2 - camera.position.y * camera.zoom
    );
    this.ctx.scale(camera.zoom, camera.zoom);

    const viewBounds = camera.getViewBounds(
      this.canvas.width,
      this.canvas.height
    );

    // Render tilemaps first (background layer)
    const tilemapObjects = scene.findGameObjectsWithComponent(Tilemap);
    tilemapObjects.forEach((obj) => {
      if (obj.active) {
        const tilemap = obj.getComponent(Tilemap);
        tilemap.draw(this.ctx, camera);
      }
    });

    // Then render sprite objects
    const renderableObjects = scene
      .findGameObjectsWithComponent(SpriteRenderer)
      .map((obj) => ({
        gameObject: obj,
        renderer: obj.getComponent(SpriteRenderer),
      }))
      .filter((item) => item.gameObject.active && item.renderer.enabled)
      .sort((a, b) => a.renderer.layer - b.renderer.layer);

    renderableObjects.forEach(({ gameObject, renderer }) => {
      const pos = gameObject.transform.position;
      const halfWidth = renderer.width / 2;
      const halfHeight = renderer.height / 2;

      if (
        pos.x + halfWidth < viewBounds.left ||
        pos.x - halfWidth > viewBounds.right ||
        pos.y + halfHeight < viewBounds.top ||
        pos.y - halfHeight > viewBounds.bottom
      ) {
        this.renderStats.culledObjects++;
        return;
      }

      try {
        renderer.draw(this.ctx, camera);
        this.renderStats.objectsRendered++;
      } catch (error) {
        Debug.error(`Error rendering ${gameObject.name}:`, error);
      }
    });

    this.ctx.restore();

    if (Debug.enabled) {
      this.renderDebugInfo(scene);
    }
  }

  renderDebugInfo(scene) {
    const collidableObjects = scene.findGameObjectsWithComponent(Collider);

    this.ctx.save();
    const camera = scene.camera;
    this.ctx.translate(
      this.canvas.width / 2 - camera.position.x * camera.zoom,
      this.canvas.height / 2 - camera.position.y * camera.zoom
    );
    this.ctx.scale(camera.zoom, camera.zoom);

    collidableObjects.forEach((obj) => {
      if (!obj.active) return;
      const collider = obj.getComponent(Collider);
      if (collider.enabled) {
        const bounds = collider.getBounds();
        this.ctx.strokeStyle = collider.isTrigger ? "yellow" : "red";
        this.ctx.lineWidth = 1 / camera.zoom;
        this.ctx.strokeRect(
          bounds.left,
          bounds.top,
          bounds.width,
          bounds.height
        );
      }
    });

    this.ctx.restore();

    this.ctx.fillStyle = "white";
    this.ctx.font = "12px Arial";
    this.ctx.fillText(`Objects: ${this.renderStats.objectsRendered}`, 10, 20);
    this.ctx.fillText(`Culled: ${this.renderStats.culledObjects}`, 10, 35);
  }

  setBackgroundColor(color) {
    this.backgroundColor = color;
  }

  getCanvas() {
    return this.canvas;
  }

  getContext() {
    return this.ctx;
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

// ==================== GAME LOOP ====================

class GameLoop {
  constructor(engine) {
    this.engine = engine;
    this.isRunning = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.timeStep = 1000 / 60;
    this.maxFrameTime = 250;
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsTime = 0;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastFpsTime = this.lastTime;
    Debug.log("Game loop started");
    this._loop(this.lastTime);
  }

  stop() {
    this.isRunning = false;
    Debug.log("Game loop stopped");
  }

  _loop = (currentTime) => {
    if (!this.isRunning) return;

    let deltaTime = currentTime - this.lastTime;
    if (deltaTime > this.maxFrameTime) {
      deltaTime = this.maxFrameTime;
    }

    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    this.frameCount++;
    if (currentTime - this.lastFpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = currentTime;
    }

    try {
      this.engine.inputManager.update();

      while (this.accumulator >= this.timeStep) {
        this.engine.sceneManager.update(this.timeStep / 1000);
        this.engine.physicsEngine.update(
          this.engine.sceneManager.getActiveScene()
        );
        this.accumulator -= this.timeStep;
      }

      this.engine.renderer.render(this.engine.sceneManager.getActiveScene());
    } catch (error) {
      Debug.error("Error in game loop:", error);
    }

    requestAnimationFrame(this._loop);
    this.engine.inputManager.update(); // ← This MUST be called every frame
  };

  getFPS() {
    return this.fps;
  }
}

// ==================== MAIN ENGINE CLASS ====================

class SeedFrameEngine {
  constructor(config = {}) {
    this.config = {
      width: 800,
      height: 600,
      containerId: "game-container",
      backgroundColor: "#222222",
      debug: false,
      ...config,
    };

    Debug.enabled = this.config.debug;

    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext("2d");

    this.inputManager = new InputManager();
    this.inputManager.setCanvas(this.canvas);
    this.assetManager = new AssetManager();
    this.sceneManager = new SceneManager();
    this.physicsEngine = new PhysicsEngine();
    this.renderer = new Renderer(this.canvas, this.ctx);
    this.gameLoop = new GameLoop(this);

    this.renderer.setBackgroundColor(this.config.backgroundColor);
    this.eventBus = new EventBus();

    Debug.log(
      "Enhanced 2D Game Engine with Quality of Life features initialized",
      this.config
    );
  }

  createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = this.config.width;
    canvas.height = this.config.height;
    canvas.style.display = "block";

    const container = document.getElementById(this.config.containerId);
    if (container) {
      container.appendChild(canvas);
    } else {
      document.body.appendChild(canvas);
    }

    return canvas;
  }

  start() {
    Debug.log("Starting enhanced game engine...");
    this.gameLoop.start();
    this.eventBus.emit("engine_started");
  }

  stop() {
    Debug.log("Stopping enhanced game engine...");
    this.gameLoop.stop();
    this.eventBus.emit("engine_stopped");
  }

  pause() {
    this.gameLoop.stop();
    this.eventBus.emit("engine_paused");
  }

  resume() {
    this.gameLoop.start();
    this.eventBus.emit("engine_resumed");
  }

  createScene(name) {
    const scene = new Scene(name);
    scene.engine = this;
    return scene;
  }

  resize(width, height) {
    this.config.width = width;
    this.config.height = height;
    this.renderer.resize(width, height);
    this.eventBus.emit("engine_resized", { width, height });
  }

  setDebugMode(enabled) {
    Debug.enabled = enabled;
    this.config.debug = enabled;
  }

  getFPS() {
    return this.gameLoop.getFPS();
  }

  destroy() {
    this.stop();
    this.sceneManager.scenes.forEach((scene, name) => {
      this.sceneManager.remove(name);
    });
    this.assetManager.clear();
    this.eventBus.clear();

    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    Debug.log("Enhanced engine destroyed");
  }
}

// ==================== EXPORTS ====================

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Engine: SeedFrameEngine,
    GameObject,
    Component,
    SpriteRenderer,
    Collider,
    AudioSource,
    Transform,
    Player,
    PlatformerPlayer,
    RacingPlayer,
    TopDownPlayer,
    FlyingPlayer,
    StateMachine,
    State,
    Tilemap,
    Vector2,
    Scene,
    Camera,
    EventBus,
    PhysicsLayers,
    Debug,
  };
}

if (typeof window !== "undefined") {
  window.GameEngine = {
    SeedFrames: Engine,
    GameObject,
    Component,
    SpriteRenderer,
    Collider,
    AudioSource,
    Transform,
    Player,
    PlatformerPlayer,
    RacingPlayer,
    TopDownPlayer,
    FlyingPlayer,
    StateMachine,
    State,
    Tilemap,
    Vector2,
    Scene,
    Camera,
    EventBus,
    PhysicsLayers,
    Debug,
  };
}

// ==================== USAGE EXAMPLES ====================
/*
// QUALITY OF LIFE IMPROVEMENTS IN ACTION:

// 1. Enhanced getComponent with inheritance support
const playerComponent = gameObject.getComponent(Player); // Works with PlatformerPlayer too!

// 2. Fluent API for GameObject creation
const player = scene.createGameObject('Player')
    .at(100, 300)
    .withColor('#4a90e2', 32, 48)
    .withCollider('box', 32, 48, false, 'Player')
    .withPlatformerPlayer({
        speed: 200,
        jumpForce: 450,
        onJump: () => console.log('Player jumped!')
    })
    .build();

// 3. Timer system integrated into scenes
scene.setTimeout(() => {
    console.log('Delayed action!');
}, 2.0);

// 4. Finite State Machine example
class IdleState extends State {
    constructor() { super('idle'); }
    
    update(deltaTime) {
        // Check for transition conditions
        if (inputManager.isKeyPressed('Space')) {
            this.transitionTo('attacking');
        }
    }
}

class AttackingState extends State {
    constructor() { super('attacking'); }
    
    enter() {
        console.log('Started attacking!');
        // Play attack animation, etc.
    }
    
    update(deltaTime) {
        // Attack logic
        // After attack completes, transition back
        this.transitionTo('idle');
    }
}

const fsm = player.addComponent(new StateMachine('idle'));
fsm.addState('idle', new IdleState())
   .addState('attacking', new AttackingState());

// 5. Tilemap system
const level = scene.createGameObject('Level')
    .withTilemap(32, 32)
    .build();

const tilemap = level.getComponent(Tilemap);
tilemap.loadFromArray([
    1, 1, 1, 1,
    0, 0, 0, 1,
    0, 0, 0, 1,
    1, 1, 1, 1
], 4, 4);

// 6. Physics layers
engine.physicsEngine.setCollisionRule('Player', 'Enemy', true);
engine.physicsEngine.setCollisionRule('Player', 'Collectible', true);
engine.physicsEngine.setCollisionRule('PlayerBullet', 'Enemy', true);
*/

console.log(
  "Enhanced 2D Game Engine with Quality of Life Features loaded and ready!"
);
console.log(
  "Features: Inheritance-aware getComponent, Fluent API, Timer system, State machines, Tilemaps, Physics layers"
);
