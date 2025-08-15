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
  static showOverlay = false;
  static showFPS = true;
  static showStats = true;
  static showProfiler = true;
  static showQuadtree = false;
  
  // Performance tracking
  static frameCount = 0;
  static lastTime = 0;
  static fps = 0;
  static frameTimes = [];
  static updateTimes = [];
  static renderTimes = [];
  static collisionChecks = 0;
  static activeObjects = 0;
  static memoryUsage = 0;
  
  // Profiling
  static profilerData = new Map();
  static profilerStartTime = 0;
  
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
  
  // Performance tracking methods
  static updateFPS(currentTime) {
    this.frameCount++;
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Keep only last 60 frame times for averaging
      if (this.frameTimes.length > 60) {
        this.frameTimes.shift();
      }
    }
  }
  
  static addFrameTime(frameTime) {
    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }
  }
  
  static addUpdateTime(updateTime) {
    this.updateTimes.push(updateTime);
    if (this.updateTimes.length > 60) {
      this.updateTimes.shift();
    }
  }
  
  static addRenderTime(renderTime) {
    this.renderTimes.push(renderTime);
    if (this.renderTimes.length > 60) {
      this.renderTimes.shift();
    }
  }
  
  static getAverageFrameTime() {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }
  
  static getAverageUpdateTime() {
    if (this.updateTimes.length === 0) return 0;
    return this.updateTimes.reduce((a, b) => a + b, 0) / this.updateTimes.length;
  }
  
  static getAverageRenderTime() {
    if (this.renderTimes.length === 0) return 0;
    return this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
  }
  
  // Profiling methods
  static startProfile(name) {
    if (!this.enabled) return;
    this.profilerData.set(name, { start: performance.now() });
  }
  
  static endProfile(name) {
    if (!this.enabled) return;
    const data = this.profilerData.get(name);
    if (data) {
      data.duration = performance.now() - data.start;
      data.count = (data.count || 0) + 1;
      data.average = data.average || 0;
      data.average = (data.average * (data.count - 1) + data.duration) / data.count;
    }
  }
  
  // Debug overlay drawing
  static drawOverlay(ctx, engine, scene) {
    if (!this.showOverlay || !this.enabled) return;
    
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 300, 200);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    let y = 20;
    const lineHeight = 16;
    
    if (this.showFPS) {
      ctx.fillText(`FPS: ${this.fps}`, 20, y);
      y += lineHeight;
      ctx.fillText(`Frame Time: ${this.getAverageFrameTime().toFixed(2)}ms`, 20, y);
      y += lineHeight;
    }
    
    if (this.showStats) {
      ctx.fillText(`Active Objects: ${this.activeObjects}`, 20, y);
      y += lineHeight;
      ctx.fillText(`Collision Checks: ${this.collisionChecks}`, 20, y);
      y += lineHeight;
      ctx.fillText(`Memory: ${this.memoryUsage}MB`, 20, y);
      y += lineHeight;
    }
    
    if (this.showProfiler) {
      ctx.fillText('Profiler:', 20, y);
      y += lineHeight;
      
      for (const [name, data] of this.profilerData) {
        if (data.average) {
          ctx.fillText(`${name}: ${data.average.toFixed(2)}ms`, 30, y);
          y += lineHeight;
        }
      }
    }
    
    // Scene info
    if (scene) {
      ctx.fillText(`Scene: ${scene.name}`, 20, y);
      y += lineHeight;
      ctx.fillText(`Camera: (${scene.camera.transform.position.x.toFixed(1)}, ${scene.camera.transform.position.y.toFixed(1)})`, 20, y);
    }
    
    ctx.restore();
  }
  
  // Quadtree visualization
  static drawQuadtree(ctx, quadtree, camera) {
    if (!this.showQuadtree || !this.enabled || !quadtree) return;
    
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.lineWidth = 1;
    
    this.drawQuadtreeNode(ctx, quadtree, camera);
    
    ctx.restore();
  }
  
  static drawQuadtreeNode(ctx, node, camera) {
    if (!node) return;
    
    // Convert world coordinates to screen coordinates
    const screenBounds = {
      x: node.bounds.x - camera.transform.position.x + camera.width / 2,
      y: node.bounds.y - camera.transform.position.y + camera.height / 2,
      width: node.bounds.width,
      height: node.bounds.height
    };
    
    // Only draw if visible on screen
    if (screenBounds.x + screenBounds.width > 0 && screenBounds.x < camera.width &&
        screenBounds.y + screenBounds.height > 0 && screenBounds.y < camera.height) {
      
      ctx.strokeRect(screenBounds.x, screenBounds.y, screenBounds.width, screenBounds.height);
      
      // Draw object count
      if (node.objects.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px monospace';
        ctx.fillText(node.objects.length.toString(), 
                    screenBounds.x + screenBounds.width / 2, 
                    screenBounds.y + screenBounds.height / 2);
      }
      
      // Recursively draw child nodes
      if (node.divided) {
        for (const childNode of node.nodes) {
          this.drawQuadtreeNode(ctx, childNode, camera);
        }
      }
    }
  }
  
  // Toggle methods
  static toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }
  
  static toggleFPS() {
    this.showFPS = !this.showFPS;
  }
  
  static toggleStats() {
    this.showStats = !this.showStats;
  }
  
  static toggleProfiler() {
    this.showProfiler = !this.showProfiler;
  }
  
  static toggleQuadtree() {
    this.showQuadtree = !this.showQuadtree;
  }
  
  // Reset stats
  static resetStats() {
    this.frameTimes = [];
    this.updateTimes = [];
    this.renderTimes = [];
    this.collisionChecks = 0;
    this.activeObjects = 0;
    this.memoryUsage = 0;
    this.profilerData.clear();
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
    
    // Animation properties
    this.animations = new Map();
    this.currentAnimation = null;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameDuration = 0.1; // seconds per frame
    this.looping = true;
    this.playing = false;
    
    // Skeletal animation properties
    this.bones = [];
    this.skeleton = null;
    this.boneTransforms = new Map();
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

  setImage(imageElement) {
    this.image = imageElement;
    this.imageSrc = null;
    this.color = null;
    this.loaded = !!imageElement;
    if (imageElement && (!this.width || !this.height)) {
      // Default to natural size if width/height not set
      this.width = imageElement.naturalWidth || this.width || 32;
      this.height = imageElement.naturalHeight || this.height || 32;
    }
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
  
  // Animation methods
  addAnimation(name, frames, frameDuration = 0.1, loop = true) {
    this.animations.set(name, {
      frames: frames,
      frameDuration: frameDuration,
      loop: loop
    });
  }
  
  playAnimation(name, reset = true) {
    if (!this.animations.has(name)) return false;
    
    const animation = this.animations.get(name);
    this.currentAnimation = name;
    this.frameDuration = animation.frameDuration;
    this.looping = animation.loop;
    this.playing = true;
    
    if (reset) {
      this.currentFrame = 0;
      this.frameTimer = 0;
    }
    
    return true;
  }
  
  stopAnimation() {
    this.playing = false;
  }
  
  pauseAnimation() {
    this.playing = false;
  }
  
  resumeAnimation() {
    this.playing = true;
  }
  
  update(deltaTime) {
    if (!this.playing || !this.currentAnimation) return;
    
    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameDuration) {
      this.frameTimer = 0;
      this.currentFrame++;
      
      const animation = this.animations.get(this.currentAnimation);
      if (this.currentFrame >= animation.frames.length) {
        if (this.looping) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = animation.frames.length - 1;
          this.playing = false;
        }
      }
    }
  }
  
  // Skeletal animation methods
  setSkeleton(skeleton) {
    this.skeleton = skeleton;
    this.bones = skeleton.bones;
    this.updateBoneTransforms();
  }
  
  addBone(name, parent = null, localTransform = null) {
    const bone = {
      name: name,
      parent: parent,
      localTransform: localTransform || { position: new Vector2(0, 0), rotation: 0, scale: new Vector2(1, 1) },
      worldTransform: { position: new Vector2(0, 0), rotation: 0, scale: new Vector2(1, 1) }
    };
    
    this.bones.push(bone);
    this.updateBoneTransforms();
    return bone;
  }
  
  updateBoneTransforms() {
    for (const bone of this.bones) {
      this.updateBoneWorldTransform(bone);
    }
  }
  
  updateBoneWorldTransform(bone) {
    if (bone.parent) {
      const parentTransform = this.boneTransforms.get(bone.parent.name) || bone.parent.worldTransform;
      bone.worldTransform.position = parentTransform.position.add(bone.localTransform.position);
      bone.worldTransform.rotation = parentTransform.rotation + bone.localTransform.rotation;
      bone.worldTransform.scale = parentTransform.scale.multiplyByScalar(bone.localTransform.scale.x);
    } else {
      bone.worldTransform = { ...bone.localTransform };
    }
    
    this.boneTransforms.set(bone.name, bone.worldTransform);
  }
  
  animateBone(name, targetTransform, duration = 1.0) {
    const bone = this.bones.find(b => b.name === name);
    if (!bone) return;
    
    // Simple linear interpolation for bone animation
    const startTransform = { ...bone.localTransform };
    const timer = new Timer(duration, () => {
      bone.localTransform = targetTransform;
      this.updateBoneTransforms();
    });
    
    // Store animation timer for cleanup
    if (!this.boneAnimations) this.boneAnimations = [];
    this.boneAnimations.push(timer);
  }
  
  // Enhanced draw method for animations
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
      // Draw current animation frame or static image
      if (this.currentAnimation && this.playing) {
        const animation = this.animations.get(this.currentAnimation);
        const frame = animation.frames[this.currentFrame];
        
        if (frame.spriteSheet) {
          // Sprite sheet animation
          ctx.drawImage(
            frame.spriteSheet,
            frame.x, frame.y, frame.width, frame.height,
            -this.width / 2, -this.height / 2,
            this.width, this.height
          );
        } else if (frame.image) {
          // Individual frame images
          ctx.drawImage(
            frame.image,
            -this.width / 2, -this.height / 2,
            this.width, this.height
          );
        }
      } else {
        // Draw static image
        ctx.drawImage(
          this.image,
          -this.width / 2, -this.height / 2,
          this.width, this.height
        );
      }
      
      // Draw skeletal bones if skeleton exists
      if (this.skeleton && Debug.enabled) {
        this.drawSkeleton(ctx);
      }
    } else if (this.color) {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      ctx.fillStyle = "#888888";
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    ctx.restore();
  }
  
  drawSkeleton(ctx) {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    
    for (const bone of this.bones) {
      if (bone.parent) {
        const parentPos = bone.parent.worldTransform.position;
        const bonePos = bone.worldTransform.position;
        
        ctx.beginPath();
        ctx.moveTo(parentPos.x, parentPos.y);
        ctx.lineTo(bonePos.x, bonePos.y);
        ctx.stroke();
      }
    }
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

class Rigidbody extends Component {
  constructor(mass = 1.0, gravityScale = 1.0, bodyType = 'dynamic') {
    super();
    this.mass = mass;
    this.gravityScale = gravityScale;
    this.velocity = new Vector2(0, 0);
    this.acceleration = new Vector2(0, 0);
    this.force = new Vector2(0, 0);
    this.drag = 0.98;
    this.gravity = new Vector2(0, 9.8 * gravityScale);
    this.useGravity = true;
    this.isKinematic = false;
    
    // Body types: 'static', 'kinematic', 'dynamic'
    this.bodyType = bodyType;
    this.setBodyType(bodyType);
  }
  
  setBodyType(type) {
    this.bodyType = type;
    switch (type) {
      case 'static':
        this.isKinematic = true;
        this.useGravity = false;
        this.mass = Infinity;
        this.velocity = new Vector2(0, 0);
        break;
      case 'kinematic':
        this.isKinematic = true;
        this.useGravity = false;
        this.mass = Infinity;
        break;
      case 'dynamic':
        this.isKinematic = false;
        this.useGravity = true;
        this.mass = Math.max(0.1, this.mass);
        break;
    }
  }

  addForce(force) {
    // Static bodies cannot have forces applied to them
    if (this.bodyType === 'static' || this.mass === Infinity) return;
    this.force = this.force.add(force);
  }

  setVelocity(velocity) {
    // Static bodies cannot have velocity changed
    if (this.bodyType === 'static') return;
    this.velocity = velocity;
    this.currentSpeed = velocity.magnitude();
    this.targetSpeed = this.currentSpeed;
  }

  update(deltaTime) {
    // Static and kinematic bodies don't update via physics
    if (this.isKinematic || this.bodyType === 'static') return;

    // Prevent infinite mass objects from moving
    if (this.mass === Infinity || this.mass <= 0) return;

    // Apply forces
    this.acceleration = this.force.multiplyByScalar(1 / this.mass);
    
    // Apply gravity
    if (this.useGravity) {
      this.acceleration = this.acceleration.add(this.gravity);
    }
    
    // Update velocity
    this.velocity = this.velocity.add(this.acceleration.multiplyByScalar(deltaTime));
    
    // Apply drag
    this.velocity = this.velocity.multiplyByScalar(this.drag);
    
    // Update position
    if (this.gameObject && this.gameObject.transform) {
      this.gameObject.transform.position = this.gameObject.transform.position.add(
        this.velocity.multiplyByScalar(deltaTime)
      );
    }
    
    // Reset forces
    this.force = new Vector2(0, 0);
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
    
    // Advanced audio properties
    this.pitch = 1.0;
    this.pan = 0.0; // -1.0 (left) to 1.0 (right)
    this.spatial = false;
    this.maxDistance = 1000;
    this.rolloffFactor = 1.0;
    this.referenceDistance = 100;
    
    // Fade properties
    this.fadeInTime = 0;
    this.fadeOutTime = 0;
    this.fadeTimer = 0;
    this.fadeType = 'none'; // 'none', 'in', 'out'
    
    // Audio context for advanced features
    this.audioContext = null;
    this.gainNode = null;
    this.stereoPanner = null;
    this.sourceNode = null;
    
    // Spatial audio properties
    this.listener = null; // Camera or player reference
    this.spatialVolume = 1.0;
  }

  awake() {
    if (this.audioSrc) {
      this.loadAudio(this.audioSrc);
    }
    
    // Initialize Web Audio API if available
    this.initWebAudioAPI();
  }
  
  initWebAudioAPI() {
    try {
      if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        this.audioContext = new (AudioContext || webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.stereoPanner = this.audioContext.createStereoPanner();
        
        this.gainNode.connect(this.stereoPanner);
        this.stereoPanner.connect(this.audioContext.destination);
        
        this.gainNode.gain.value = this.volume;
        this.stereoPanner.pan.value = this.pan;
      }
    } catch (error) {
      Debug.warn('Web Audio API not available, falling back to HTML5 Audio');
    }
  }

  loadAudio(src) {
    this.audio = new Audio();
    this.audio.oncanplaythrough = () => {
      this.loaded = true;
      Debug.log(`Audio loaded: ${src}`);
      
      // Create audio source node if Web Audio API is available
      if (this.audioContext && this.audio) {
        this.createAudioSource();
      }
    };
    this.audio.onerror = () => {
      Debug.error(`Failed to load audio: ${src}`);
    };
    this.audio.volume = this.volume;
    this.audio.loop = this.loop;
    this.audio.src = src;
  }
  
  createAudioSource() {
    if (!this.audioContext || !this.audio) return;
    
    try {
      // Create audio source from HTML5 audio element
      this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
      this.sourceNode.connect(this.gainNode);
    } catch (error) {
      Debug.warn('Failed to create audio source node:', error);
    }
  }

  play() {
    if (this.loaded && this.audio) {
      this.audio.currentTime = 0;
      
      if (this.fadeInTime > 0) {
        this.startFadeIn();
      }
      
      this.audio.play().catch((e) => Debug.error("Audio play failed:", e));
    }
  }

  stop() {
    if (this.audio) {
      if (this.fadeOutTime > 0) {
        this.startFadeOut();
      } else {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }
  
  // Advanced audio controls
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }
  
  setPitch(pitch) {
    this.pitch = Math.max(0.1, Math.min(4, pitch));
    if (this.audio) {
      this.audio.playbackRate = this.pitch;
    }
  }
  
  setPan(pan) {
    this.pan = Math.max(-1, Math.min(1, pan));
    if (this.stereoPanner) {
      this.stereoPanner.pan.value = this.pan;
    }
  }
  
  // Fade controls
  fadeIn(duration) {
    this.fadeInTime = duration;
    this.fadeType = 'in';
    this.fadeTimer = 0;
    this.setVolume(0);
  }
  
  fadeOut(duration) {
    this.fadeOutTime = duration;
    this.fadeType = 'out';
    this.fadeTimer = 0;
  }
  
  startFadeIn() {
    this.fadeType = 'in';
    this.fadeTimer = 0;
    this.setVolume(0);
  }
  
  startFadeOut() {
    this.fadeType = 'out';
    this.fadeTimer = 0;
  }
  
  // Spatial audio
  setSpatial(enabled, maxDistance = 1000, rolloffFactor = 1.0) {
    this.spatial = enabled;
    this.maxDistance = maxDistance;
    this.rolloffFactor = rolloffFactor;
  }
  
  setListener(listener) {
    this.listener = listener;
  }
  
  updateSpatialAudio() {
    if (!this.spatial || !this.listener || !this.gameObject) return;
    
    const listenerPos = this.listener.transform ? this.listener.transform.position : this.listener;
    const sourcePos = this.gameObject.transform.position;
    
    const distance = sourcePos.distance(listenerPos);
    
    if (distance > this.maxDistance) {
      this.spatialVolume = 0;
    } else if (distance <= this.referenceDistance) {
      this.spatialVolume = 1.0;
    } else {
      // Logarithmic rolloff
      this.spatialVolume = this.referenceDistance / (this.referenceDistance + this.rolloffFactor * (distance - this.referenceDistance));
    }
    
    // Apply spatial volume
    const finalVolume = this.volume * this.spatialVolume;
    if (this.gainNode) {
      this.gainNode.gain.value = finalVolume;
    }
    if (this.audio) {
      this.audio.volume = finalVolume;
    }
    
    // Calculate pan based on horizontal distance
    if (this.stereoPanner) {
      const dx = sourcePos.x - listenerPos.x;
      const pan = Math.max(-1, Math.min(1, dx / this.maxDistance));
      this.stereoPanner.pan.value = pan;
    }
  }
  
  // Update method for fade and spatial audio
  update(deltaTime) {
    // Handle fades
    if (this.fadeType === 'in' && this.fadeInTime > 0) {
      this.fadeTimer += deltaTime;
      const progress = Math.min(this.fadeTimer / this.fadeInTime, 1.0);
      this.setVolume(this.volume * progress);
      
      if (progress >= 1.0) {
        this.fadeType = 'none';
        this.fadeTimer = 0;
      }
    } else if (this.fadeType === 'out' && this.fadeOutTime > 0) {
      this.fadeTimer += deltaTime;
      const progress = Math.min(this.fadeTimer / this.fadeOutTime, 1.0);
      this.setVolume(this.volume * (1.0 - progress));
      
      if (progress >= 1.0) {
        this.fadeType = 'none';
        this.fadeTimer = 0;
        this.audio.pause();
        this.audio.currentTime = 0;
      }
    }
    
    // Update spatial audio
    if (this.spatial) {
      this.updateSpatialAudio();
    }
  }
  
  // Utility methods
  isPlaying() {
    return this.audio && !this.audio.paused && this.audio.currentTime > 0;
  }
  
  getCurrentTime() {
    return this.audio ? this.audio.currentTime : 0;
  }
  
  getDuration() {
    return this.audio ? this.audio.duration : 0;
  }
  
  seek(time) {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
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
    
    // Racing-specific properties
    this.currentSpeed = 0;
    this.targetSpeed = 0;
    this.steeringAngle = 0;
    this.driftFactor = 0.8;
    this.boostMultiplier = 1.0;
    this.isDrifting = false;
    this.driftIntensity = 0;
    
    // Callbacks
    this.onDrift = config.onDrift || null;
  }

  getSpeed() {
    return this.currentSpeed;
  }

  getSpeedKmh() {
    return this.currentSpeed * 3.6; // Convert m/s to km/h
  }

  accelerate(amount = 1.0) {
    this.targetSpeed = Math.min(this.maxSpeed, this.targetSpeed + this.acceleration * amount);
  }

  brake(amount = 1.0) {
    this.targetSpeed = Math.max(0, this.targetSpeed - this.acceleration * amount);
  }

  steer(direction) {
    this.steeringAngle += direction * this.steeringSpeed * 0.016; // Assuming 60 FPS
    this.steeringAngle = Math.max(-Math.PI/4, Math.min(Math.PI/4, this.steeringAngle));
  }

  startDrift() {
    this.isDrifting = true;
    this.driftIntensity = 0;
  }

  stopDrift() {
    this.isDrifting = false;
    this.driftIntensity = 0;
  }

  update(deltaTime) {
    super.update(deltaTime);
    
    // Update speed
    if (this.targetSpeed > this.currentSpeed) {
      this.currentSpeed = Math.min(this.targetSpeed, this.currentSpeed + this.acceleration * deltaTime);
    } else if (this.targetSpeed < this.currentSpeed) {
      this.currentSpeed = Math.max(this.targetSpeed, this.currentSpeed - this.acceleration * deltaTime);
    }
    
    // Apply friction
    this.currentSpeed *= this.friction;
    
    // Apply boost
    this.currentSpeed *= this.boostMultiplier;
    
    // Update drift
    if (this.isDrifting) {
      this.driftIntensity += deltaTime;
      if (this.onDrift) {
        this.onDrift(this.driftIntensity);
      }
    }
    
    // Update position based on speed and steering
    if (this.gameObject && this.gameObject.transform) {
      const direction = new Vector2(
        Math.cos(this.gameObject.transform.rotation + this.steeringAngle),
        Math.sin(this.gameObject.transform.rotation + this.steeringAngle)
      );
      
      this.gameObject.transform.position.x += direction.x * this.currentSpeed * deltaTime;
      this.gameObject.transform.position.y += direction.y * this.currentSpeed * deltaTime;
    }
  }

  setBoost(multiplier, duration = 0) {
    this.boostMultiplier = multiplier;
    if (duration > 0) {
      setTimeout(() => {
        this.boostMultiplier = 1.0;
      }, duration * 1000);
    }
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

  asset(name, width = null, height = null, layer = 0) {
    const engine = this.scene && this.scene.engine;
    if (!engine || !engine.assetManager) {
      Debug.warn("Engine or AssetManager not available for asset() call");
      return this;
    }
    const img = engine.assetManager.getNamedImage(name);
    if (!img) {
      Debug.warn(`Asset '${name}' not found. Did you call engine.assetManagement(...) before starting?`);
      return this;
    }
    let sprite = this.gameObject.getComponent(SpriteRenderer);
    if (!sprite) {
      sprite = new SpriteRenderer(null, width || img.naturalWidth || 32, height || img.naturalHeight || 32, layer);
      this.gameObject.addComponent(sprite);
    }
    if (width) sprite.width = width;
    if (height) sprite.height = height;
    sprite.setImage(img);
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

  withRigidbody(mass = 1.0, gravityScale = 1.0, bodyType = 'dynamic') {
    const rigidbody = new Rigidbody(mass, gravityScale, bodyType);
    this.gameObject.addComponent(rigidbody);
    return this;
  }

  withStaticBody() {
    return this.withRigidbody(Infinity, 0, 'static');
  }

  withKinematicBody(mass = 1.0) {
    return this.withRigidbody(mass, 0, 'kinematic');
  }

  withDynamicBody(mass = 1.0, gravityScale = 1.0) {
    return this.withRigidbody(mass, gravityScale, 'dynamic');
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
  
  // Scene serialization methods
  serializeScene(sceneName) {
    const scene = this.scenes.get(sceneName);
    if (!scene) return null;
    
    try {
      const sceneData = {
        name: scene.name,
        gameObjects: [],
        camera: {
          position: scene.camera.transform.position,
          scale: scene.camera.transform.scale,
          rotation: scene.camera.transform.rotation,
          width: scene.camera.width,
          height: scene.camera.height
        },
        backgroundColor: scene.backgroundColor,
        timestamp: Date.now()
      };
      
      // Serialize all game objects
      for (const gameObject of scene.gameObjects) {
        if (gameObject.serialize) {
          sceneData.gameObjects.push(gameObject.serialize());
        }
      }
      
      return JSON.stringify(sceneData, null, 2);
    } catch (error) {
      Debug.error(`Failed to serialize scene ${sceneName}:`, error);
      return null;
    }
  }
  
  deserializeScene(sceneData) {
    try {
      const data = typeof sceneData === 'string' ? JSON.parse(sceneData) : sceneData;
      
      // Create new scene
      const scene = new Scene(data.name, data.backgroundColor);
      
      // Restore camera
      if (data.camera) {
        scene.camera.transform.position = new Vector2(data.camera.position.x, data.camera.position.y);
        scene.camera.transform.scale = new Vector2(data.camera.scale.x, data.camera.scale.y);
        scene.camera.transform.rotation = data.camera.rotation;
        scene.camera.width = data.camera.width;
        scene.camera.height = data.camera.height;
      }
      
      // Restore game objects
      for (const objData of data.gameObjects) {
        try {
          const gameObject = this.deserializeGameObject(objData, scene);
          if (gameObject) {
            scene.addGameObject(gameObject);
          }
        } catch (error) {
          Debug.warn(`Failed to deserialize game object:`, error);
        }
      }
      
      return scene;
    } catch (error) {
      Debug.error(`Failed to deserialize scene:`, error);
      return null;
    }
  }
  
  deserializeGameObject(objData, scene) {
    try {
      const gameObject = new GameObject(objData.name || 'DeserializedObject');
      
      // Restore transform
      if (objData.transform) {
        gameObject.transform.position = new Vector2(objData.transform.position.x, objData.transform.position.y);
        gameObject.transform.scale = new Vector2(objData.transform.scale.x, objData.transform.scale.y);
        gameObject.transform.rotation = objData.transform.rotation || 0;
      }
      
      // Restore components
      if (objData.components) {
        for (const compData of objData.components) {
          try {
            const component = this.deserializeComponent(compData, gameObject);
            if (component) {
              gameObject.addComponent(component);
            }
          } catch (error) {
            Debug.warn(`Failed to deserialize component ${compData.type}:`, error);
          }
        }
      }
      
      return gameObject;
    } catch (error) {
      Debug.error(`Failed to deserialize game object:`, error);
      return null;
    }
  }
  
  deserializeComponent(compData, gameObject) {
    try {
      let component;
      
      switch (compData.type) {
        case 'SpriteRenderer':
          component = new SpriteRenderer(compData.imageSrc, compData.width, compData.height, compData.layer);
          if (compData.color) component.setColor(compData.color);
          if (compData.alpha !== undefined) component.alpha = compData.alpha;
          if (compData.flipX !== undefined) component.flipX = compData.flipX;
          if (compData.flipY !== undefined) component.flipY = compData.flipY;
          break;
          
        case 'Collider':
          component = new Collider(compData.shape, compData.width, compData.height, compData.isTrigger, compData.layer);
          break;
          
        case 'Rigidbody':
          component = new Rigidbody(compData.mass, compData.gravityScale);
          if (compData.velocity) {
            component.velocity = new Vector2(compData.velocity.x, compData.velocity.y);
          }
          break;
          
        default:
          Debug.warn(`Unknown component type: ${compData.type}`);
          return null;
      }
      
      // Restore custom properties
      if (compData.properties) {
        for (const [key, value] of Object.entries(compData.properties)) {
          if (component[key] !== undefined) {
            component[key] = value;
          }
        }
      }
      
      return component;
    } catch (error) {
      Debug.error(`Failed to deserialize component ${compData.type}:`, error);
      return null;
    }
  }
  
  // Save/load scene to/from localStorage
  saveSceneToStorage(sceneName, storageKey = null) {
    const serialized = this.serializeScene(sceneName);
    if (!serialized) return false;
    
    const key = storageKey || `scene_${sceneName}`;
    try {
      localStorage.setItem(key, serialized);
      Debug.log(`Scene ${sceneName} saved to localStorage`);
      return true;
    } catch (error) {
      Debug.error(`Failed to save scene to localStorage:`, error);
      return false;
    }
  }
  
  loadSceneFromStorage(storageKey) {
    try {
      const serialized = localStorage.getItem(storageKey);
      if (!serialized) return null;
      
      const scene = this.deserializeScene(serialized);
      if (scene) {
        Debug.log(`Scene loaded from localStorage: ${storageKey}`);
      }
      return scene;
    } catch (error) {
      Debug.error(`Failed to load scene from localStorage:`, error);
      return null;
    }
  }
  
  // Export scene to file
  exportSceneToFile(sceneName, filename = null) {
    const serialized = this.serializeScene(sceneName);
    if (!serialized) return false;
    
    const blob = new Blob([serialized], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${sceneName}_scene.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    Debug.log(`Scene ${sceneName} exported to file`);
    return true;
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
    
    // Touch support
    this.touches = new Map();
    this.previousTouches = new Map();
    this.touchStartPositions = new Map();
    
    // Gamepad support
    this.gamepads = new Map();
    this.gamepadAxes = new Map();
    this.gamepadButtons = new Map();
    this.gamepadConnected = false;
    
    // Virtual joystick for touch
    this.virtualJoystick = {
      active: false,
      center: new Vector2(0, 0),
      current: new Vector2(0, 0),
      deadzone: 0.1
    };
    
    this.setupEventListeners();
    this.setupGamepadSupport();
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
    
    // Touch events
    if (this.canvas) {
      this.canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          const rect = this.canvas.getBoundingClientRect();
          const pos = new Vector2(
            touch.clientX - rect.left,
            touch.clientY - rect.top
          );
          
          this.touches.set(touch.identifier, pos);
          this.touchStartPositions.set(touch.identifier, pos.copy());
          
          // Handle virtual joystick
          if (touch.identifier === 0) {
            this.virtualJoystick.active = true;
            this.virtualJoystick.center = pos.copy();
            this.virtualJoystick.current = pos.copy();
          }
        }
      });
      
      this.canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          const rect = this.canvas.getBoundingClientRect();
          const pos = new Vector2(
            touch.clientX - rect.left,
            touch.clientY - rect.top
          );
          
          this.touches.set(touch.identifier, pos);
          
          // Update virtual joystick
          if (touch.identifier === 0) {
            this.virtualJoystick.current = pos.copy();
          }
        }
      });
      
      this.canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          this.touches.delete(touch.identifier);
          this.touchStartPositions.delete(touch.identifier);
          
          // Reset virtual joystick
          if (touch.identifier === 0) {
            this.virtualJoystick.active = false;
          }
        }
      });
    }
  }
  
  setupGamepadSupport() {
    window.addEventListener("gamepadconnected", (e) => {
      const gamepad = e.gamepad;
      this.gamepads.set(gamepad.index, gamepad);
      this.gamepadConnected = true;
      this.gamepadAxes.set(gamepad.index, new Array(gamepad.axes.length).fill(0));
      this.gamepadButtons.set(gamepad.index, new Array(gamepad.buttons.length).fill(false));
      console.log(`Gamepad connected: ${gamepad.id}`);
    });
    
    window.addEventListener("gamepaddisconnected", (e) => {
      this.gamepads.delete(e.gamepad.index);
      this.gamepadAxes.delete(e.gamepad.index);
      this.gamepadButtons.delete(e.gamepad.index);
      this.gamepadConnected = this.gamepads.size > 0;
      console.log(`Gamepad disconnected: ${e.gamepad.id}`);
    });
  }
  
  updateGamepadState() {
    const gamepads = navigator.getGamepads();
    
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (!gamepad) continue;
      
      // Update axes
      if (this.gamepadAxes.has(i)) {
        const axes = this.gamepadAxes.get(i);
        for (let j = 0; j < gamepad.axes.length; j++) {
          axes[j] = Math.abs(gamepad.axes[j]) > 0.1 ? gamepad.axes[j] : 0;
        }
      }
      
      // Update buttons
      if (this.gamepadButtons.has(i)) {
        const buttons = this.gamepadButtons.get(i);
        for (let j = 0; j < gamepad.buttons.length; j++) {
          buttons[j] = gamepad.buttons[j].pressed;
        }
      }
    }
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
  
  // Touch methods
  getTouchCount() {
    return this.touches.size;
  }
  
  getTouchPosition(identifier = 0) {
    return this.touches.get(identifier)?.copy() || new Vector2(0, 0);
  }
  
  isTouchActive(identifier = 0) {
    return this.touches.has(identifier);
  }
  
  getTouchStartPosition(identifier = 0) {
    return this.touchStartPositions.get(identifier)?.copy() || new Vector2(0, 0);
  }
  
  // Virtual joystick methods
  getVirtualJoystickVector() {
    if (!this.virtualJoystick.active) return new Vector2(0, 0);
    
    const delta = this.virtualJoystick.current.subtract(this.virtualJoystick.center);
    const magnitude = delta.magnitude();
    
    if (magnitude < this.virtualJoystick.deadzone * 50) {
      return new Vector2(0, 0);
    }
    
    return delta.normalize().multiplyByScalar(Math.min(magnitude / 50, 1.0));
  }
  
  // Gamepad methods
  isGamepadConnected() {
    return this.gamepadConnected;
  }
  
  getGamepadCount() {
    return this.gamepads.size;
  }
  
  getGamepadAxis(gamepadIndex = 0, axisIndex) {
    const axes = this.gamepadAxes.get(gamepadIndex);
    return axes ? axes[axisIndex] || 0 : 0;
  }
  
  isGamepadButtonDown(gamepadIndex = 0, buttonIndex) {
    const buttons = this.gamepadButtons.get(gamepadIndex);
    return buttons ? buttons[buttonIndex] || false : false;
  }
  
  isGamepadButtonPressed(gamepadIndex = 0, buttonIndex) {
    // This would need to track previous state for proper pressed detection
    return this.isGamepadButtonDown(gamepadIndex, buttonIndex);
  }
  
  // Update method to be called each frame
  update() {
    this.updateGamepadState();
    
    // Update previous states for proper pressed/released detection
    // Store current states as previous for next frame
    const newPreviousKeys = new Map();
    this.keys.forEach((value, key) => newPreviousKeys.set(key, value));
    this.previousKeys = newPreviousKeys;

    const newPreviousMouseButtons = new Map();
    this.mouseButtons.forEach((value, key) => newPreviousMouseButtons.set(key, value));
    this.previousMouseButtons = newPreviousMouseButtons;
    
    const newPreviousTouches = new Map();
    this.touches.forEach((value, key) => newPreviousTouches.set(key, value));
    this.previousTouches = newPreviousTouches;
  }
}

// ==================== UI SYSTEM ====================

class UISystem {
  constructor() {
    this.elements = [];
    this.focusedElement = null;
    this.hoveredElement = null;
    this.eventBus = new EventBus();
  }
  
  addElement(element) {
    this.elements.push(element);
    return element;
  }
  
  removeElement(element) {
    const index = this.elements.indexOf(element);
    if (index > -1) {
      this.elements.splice(index, 1);
    }
  }
  
  update(deltaTime) {
    for (const element of this.elements) {
      if (element.update) {
        element.update(deltaTime);
      }
    }
  }
  
  draw(ctx) {
    // Sort elements by layer (higher layer = drawn on top)
    const sortedElements = [...this.elements].sort((a, b) => (a.layer || 0) - (b.layer || 0));
    
    for (const element of sortedElements) {
      if (element.visible !== false) {
        element.draw(ctx);
      }
    }
  }
  
  handleInput(inputManager) {
    const mousePos = inputManager.getMousePosition();
    
    // Find hovered element
    let newHovered = null;
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const element = this.elements[i];
      if (element.visible !== false && element.containsPoint(mousePos)) {
        newHovered = element;
        break;
      }
    }
    
    // Handle hover events
    if (newHovered !== this.hoveredElement) {
      if (this.hoveredElement && this.hoveredElement.onMouseLeave) {
        this.hoveredElement.onMouseLeave();
      }
      if (newHovered && newHovered.onMouseEnter) {
        newHovered.onMouseEnter();
      }
      this.hoveredElement = newHovered;
    }
    
    // Handle click events
    if (inputManager.isMouseButtonPressed(0)) {
      if (this.hoveredElement && this.hoveredElement.onClick) {
        this.hoveredElement.onClick();
        this.focusedElement = this.hoveredElement;
      } else {
        this.focusedElement = null;
      }
    }
  }
}

class UIElement {
  constructor(x = 0, y = 0, width = 100, height = 50) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.visible = true;
    this.layer = 0;
    this.onClick = null;
    this.onMouseEnter = null;
    this.onMouseLeave = null;
  }
  
  containsPoint(point) {
    return point.x >= this.x && point.x <= this.x + this.width &&
           point.y >= this.y && point.y <= this.y + this.height;
  }
  
  draw(ctx) {
    // Override in subclasses
  }
  
  update(deltaTime) {
    // Override in subclasses
  }
}

class UIButton extends UIElement {
  constructor(x = 0, y = 0, width = 100, height = 50, text = "Button") {
    super(x, y, width, height);
    this.text = text;
    this.backgroundColor = "#4a90e2";
    this.hoverColor = "#357abd";
    this.textColor = "#ffffff";
    this.fontSize = 16;
    this.isHovered = false;
    this.isPressed = false;
  }
  
  draw(ctx) {
    ctx.save();
    
    // Background
    ctx.fillStyle = this.isHovered ? this.hoverColor : this.backgroundColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Border
    ctx.strokeStyle = "#2c5aa0";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Text
    ctx.fillStyle = this.textColor;
    ctx.font = `${this.fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    
    ctx.restore();
  }
  
  onMouseEnter() {
    this.isHovered = true;
  }
  
  onMouseLeave() {
    this.isHovered = false;
  }
}

class UIText extends UIElement {
  constructor(x = 0, y = 0, text = "Text", fontSize = 16) {
    super(x, y, 0, 0);
    this.text = text;
    this.fontSize = fontSize;
    this.color = "#ffffff";
    this.fontFamily = "Arial";
    this.textAlign = "left";
    this.textBaseline = "top";
    this.maxWidth = null;
    
    // Calculate dimensions
    this.updateDimensions();
  }
  
  updateDimensions() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    
    if (this.maxWidth) {
      // Handle text wrapping
      const words = this.text.split(' ');
      let line = '';
      let lines = [];
      
      for (let word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > this.maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      this.text = lines.join('\n');
      this.height = lines.length * this.fontSize;
      this.width = this.maxWidth;
    } else {
      const metrics = ctx.measureText(this.text);
      this.width = metrics.width;
      this.height = this.fontSize;
    }
  }
  
  draw(ctx) {
    ctx.save();
    
    ctx.fillStyle = this.color;
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    
    if (this.text.includes('\n')) {
      // Multi-line text
      const lines = this.text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const y = this.y + i * this.fontSize;
        ctx.fillText(lines[i], this.x, y);
      }
    } else {
      ctx.fillText(this.text, this.x, this.y);
    }
    
    ctx.restore();
  }
  
  setText(text) {
    this.text = text;
    this.updateDimensions();
  }
}

class UISlider extends UIElement {
  constructor(x = 0, y = 0, width = 200, height = 20, minValue = 0, maxValue = 100, initialValue = 50) {
    super(x, y, width, height);
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.value = initialValue;
    this.isDragging = false;
    this.onValueChange = null;
    
    this.backgroundColor = "#444444";
    this.fillColor = "#4a90e2";
    this.handleColor = "#ffffff";
    this.handleSize = 20;
  }
  
  draw(ctx) {
    ctx.save();
    
    // Background track
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.x, this.y + this.height / 2 - 2, this.width, 4);
    
    // Fill
    const fillWidth = ((this.value - this.minValue) / (this.maxValue - this.minValue)) * this.width;
    ctx.fillStyle = this.fillColor;
    ctx.fillRect(this.x, this.y + this.height / 2 - 2, fillWidth, 4);
    
    // Handle
    const handleX = this.x + fillWidth - this.handleSize / 2;
    ctx.fillStyle = this.handleColor;
    ctx.fillRect(handleX, this.y, this.handleSize, this.height);
    
    ctx.restore();
  }
  
  handleInput(inputManager) {
    if (inputManager.isMouseButtonDown(0)) {
      const mousePos = inputManager.getMousePosition();
      if (this.containsPoint(mousePos)) {
        this.isDragging = true;
      }
    }
    
    if (this.isDragging) {
      if (inputManager.isMouseButtonDown(0)) {
        const mousePos = inputManager.getMousePosition();
        const newValue = this.minValue + ((mousePos.x - this.x) / this.width) * (this.maxValue - this.minValue);
        this.setValue(Math.max(this.minValue, Math.min(this.maxValue, newValue)));
      } else {
        this.isDragging = false;
      }
    }
  }
  
  setValue(value) {
    const oldValue = this.value;
    this.value = Math.max(this.minValue, Math.min(this.maxValue, value));
    
    if (this.value !== oldValue && this.onValueChange) {
      this.onValueChange(this.value);
    }
  }
}

// ==================== PARTICLE SYSTEM ====================

class Particle {
  constructor(x = 0, y = 0) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.acceleration = new Vector2(0, 0);
    this.life = 1.0;
    this.maxLife = 1.0;
    this.size = 4;
    this.color = "#ffffff";
    this.alpha = 1.0;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.gravity = 0;
    this.drag = 0.98;
    this.active = true;
  }
  
  update(deltaTime) {
    if (!this.active) return;
    
    // Update life
    this.life -= deltaTime;
    if (this.life <= 0) {
      this.active = false;
      return;
    }
    
    // Update physics
    this.velocity.add(this.acceleration.multiplyByScalar(deltaTime));
    this.velocity.multiplyByScalar(this.drag);
    this.position.add(this.velocity.multiplyByScalar(deltaTime));
    
    // Apply gravity
    if (this.gravity !== 0) {
      this.velocity.y += this.gravity * deltaTime;
    }
    
    // Update rotation
    this.rotation += this.rotationSpeed * deltaTime;
    
    // Update alpha based on life
    this.alpha = this.life / this.maxLife;
  }
  
  draw(ctx) {
    if (!this.active) return;
    
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    
    ctx.restore();
  }
}

class ParticleEmitter extends Component {
  constructor() {
    super();
    this.particles = [];
    this.maxParticles = 100;
    this.emissionRate = 10; // particles per second
    this.emissionTimer = 0;
    this.emissionRadius = 0;
    this.particleLife = { min: 1.0, max: 2.0 };
    this.particleSize = { min: 2, max: 8 };
    this.particleSpeed = { min: 50, max: 150 };
    this.particleColor = "#ffffff";
    this.gravity = 0;
    this.drag = 0.98;
    this.rotationSpeed = { min: -180, max: 180 };
    this.emissionAngle = { min: 0, max: 360 };
    this.active = true;
    this.oneShot = false;
    this.burstCount = 0;
  }
  
  emitParticle() {
    if (this.particles.length >= this.maxParticles) return;
    
    const particle = new Particle();
    
    // Set position
    if (this.emissionRadius > 0) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * this.emissionRadius;
      particle.position.x = Math.cos(angle) * radius;
      particle.position.y = Math.sin(angle) * radius;
    }
    
    // Set velocity
    const speed = this.particleSpeed.min + Math.random() * (this.particleSpeed.max - this.particleSpeed.min);
    const angle = (this.emissionAngle.min + Math.random() * (this.emissionAngle.max - this.emissionAngle.min)) * Math.PI / 180;
    particle.velocity.x = Math.cos(angle) * speed;
    particle.velocity.y = Math.sin(angle) * speed;
    
    // Set other properties
    particle.life = this.particleLife.min + Math.random() * (this.particleLife.max - this.particleLife.min);
    particle.maxLife = particle.life;
    particle.size = this.particleSize.min + Math.random() * (this.particleSize.max - this.particleSize.min);
    particle.color = this.particleColor;
    particle.gravity = this.gravity;
    particle.drag = this.drag;
    particle.rotationSpeed = this.rotationSpeed.min + Math.random() * (this.rotationSpeed.max - this.rotationSpeed.min);
    
    this.particles.push(particle);
  }
  
  emitBurst(count) {
    for (let i = 0; i < count; i++) {
      this.emitParticle();
    }
  }
  
  update(deltaTime) {
    if (!this.active) return;
    
    // Emit particles
    if (!this.oneShot) {
      this.emissionTimer += deltaTime;
      const emissionInterval = 1.0 / this.emissionRate;
      
      while (this.emissionTimer >= emissionInterval) {
        this.emitParticle();
        this.emissionTimer -= emissionInterval;
      }
    }
    
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(deltaTime);
      
      if (!particle.active) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  draw(ctx) {
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }
  
  // Preset configurations
  setExplosionConfig() {
    this.emissionRate = 50;
    this.particleLife = { min: 0.5, max: 1.5 };
    this.particleSpeed = { min: 100, max: 300 };
    this.emissionAngle = { min: 0, max: 360 };
    this.gravity = 200;
    this.oneShot = true;
    this.burstCount = 100;
  }
  
  setSmokeConfig() {
    this.emissionRate = 5;
    this.particleLife = { min: 2.0, max: 4.0 };
    this.particleSize = { min: 8, max: 20 };
    this.particleSpeed = { min: 20, max: 60 };
    this.particleColor = "#666666";
    this.gravity = -50;
    this.drag = 0.95;
  }
  
  setMagicConfig() {
    this.emissionRate = 15;
    this.particleLife = { min: 1.5, max: 3.0 };
    this.particleSize = { min: 3, max: 8 };
    this.particleSpeed = { min: 30, max: 80 };
    this.particleColor = "#00ffff";
    this.gravity = 0;
    this.rotationSpeed = { min: -360, max: 360 };
  }
}

class AssetManager {
  constructor() {
    this.imageCache = new Map();
    this.audioCache = new Map();
    this.loadedAssets = 0;
    this.totalAssets = 0;
    this.loadingPromises = new Map();
    this.eventBus = new EventBus();
    this.placeholderAssets = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    
    // Named assets
    this.namedImages = new Map();
    this.namedAudio = new Map();
    
    // Create placeholder assets
    this.createPlaceholderAssets();
  }
  
  createPlaceholderAssets() {
    // Create a simple colored rectangle as placeholder image
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Create a magenta/pink placeholder
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('?', 16, 20);
    
    const placeholderImage = new Image();
    placeholderImage.src = canvas.toDataURL();
    this.placeholderAssets.set('image', placeholderImage);
    
    // Create a silent audio placeholder
    const audioContext = new (window.AudioContext || window.webkitAudioContext || function(){})();
    if (audioContext.createBuffer) {
      try {
        const buffer = audioContext.createBuffer(1, 1, 22050);
        const placeholderAudio = document.createElement('audio');
        this.placeholderAssets.set('audio', placeholderAudio);
      } catch (e) {
        // Fallback for environments without audio support
        const placeholderAudio = document.createElement('audio');
        this.placeholderAssets.set('audio', placeholderAudio);
      }
    } else {
      // Simple fallback
      const placeholderAudio = document.createElement('audio');
      this.placeholderAssets.set('audio', placeholderAudio);
    }
  }
  
  // Register a batch of assets by name
  async registerAssets(assets = {}) {
    const tasks = [];
    for (const [name, value] of Object.entries(assets)) {
      tasks.push(this.registerAsset(name, value));
    }
    return Promise.all(tasks);
  }
  
  // Register a single asset by name
  async registerAsset(name, value) {
    if (!name) return;
    // SVG helper object
    if (value && typeof value === 'object' && value.__kind === 'svg' && typeof value.data === 'string') {
      return this.registerSVG(name, value.data);
    }
    // Raw SVG string
    if (typeof value === 'string' && value.trim().startsWith('<svg')) {
      return this.registerSVG(name, value);
    }
    // URL strings: decide by extension
    if (typeof value === 'string') {
      if (/\.(mp3|wav|ogg)(\?.*)?$/i.test(value)) {
        return this.registerAudio(name, value);
      }
      // Image (including external .svg)
      return this.registerImage(name, value);
    }
    // Direct elements
    if (value instanceof HTMLImageElement) {
      this.namedImages.set(name, value);
      this.imageCache.set(name, value);
      this.loadedAssets++;
      return value;
    }
    if (value instanceof HTMLAudioElement) {
      this.namedAudio.set(name, value);
      this.audioCache.set(name, value);
      this.loadedAssets++;
      return value;
    }
    // Unsupported type
    Debug.warn(`Unsupported asset type for '${name}'`);
    return null;
  }
  
  async registerImage(name, src) {
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = () => {
        this.namedImages.set(name, img);
        this.imageCache.set(name, img);
        this.loadedAssets++;
        this.eventBus.emit('asset_loaded', { type: 'image', name, asset: img });
        resolve(img);
      };
      img.onerror = () => {
        Debug.error(`Failed to register image '${name}' from ${src}`);
        const placeholder = this.placeholderAssets.get('image');
        this.namedImages.set(name, placeholder);
        resolve(placeholder);
      };
      img.src = src;
    });
  }
  
  async registerSVG(name, svgString) {
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      return this.registerImage(name, url).then((img) => {
        // Keep URL for cleanup if needed
        img.__objectUrl = url;
        return img;
      });
    } catch (e) {
      Debug.error(`Failed to register SVG '${name}':`, e);
      const placeholder = this.placeholderAssets.get('image');
      this.namedImages.set(name, placeholder);
      return placeholder;
    }
  }
  
  async registerAudio(name, src) {
    const audio = new Audio();
    return new Promise((resolve) => {
      audio.oncanplaythrough = () => {
        this.namedAudio.set(name, audio);
        this.audioCache.set(name, audio);
        this.loadedAssets++;
        this.eventBus.emit('asset_loaded', { type: 'audio', name, asset: audio });
        resolve(audio);
      };
      audio.onerror = () => {
        Debug.error(`Failed to register audio '${name}' from ${src}`);
        const placeholder = this.placeholderAssets.get('audio');
        this.namedAudio.set(name, placeholder);
        resolve(placeholder);
      };
      audio.src = src;
      audio.load();
    });
  }
  
  getNamedImage(name) {
    return this.namedImages.get(name);
  }
  
  getNamedAudio(name) {
    return this.namedAudio.get(name);
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
        this.retryAttempts.delete(path);
        
        Debug.log(`Loaded image: ${path}`);
        this.eventBus.emit('asset_loaded', { type: 'image', path, asset: image });
        resolve(image);
      };
      
      image.onerror = (error) => {
        this.loadingPromises.delete(path);
        
        const retryCount = this.retryAttempts.get(path) || 0;
        
        if (retryCount < this.maxRetries) {
          // Retry loading
          this.retryAttempts.set(path, retryCount + 1);
          Debug.warn(`Retrying to load image: ${path} (attempt ${retryCount + 1}/${this.maxRetries})`);
          
          setTimeout(() => {
            image.src = path;
          }, 1000 * (retryCount + 1)); // Exponential backoff
          
          return;
        }
        
        // Max retries reached, use placeholder
        Debug.error(`Failed to load image after ${this.maxRetries} attempts: ${path}`);
        this.eventBus.emit('asset_failed', { type: 'image', path, error, attempts: retryCount });
        
        // Use placeholder asset
        const placeholder = this.placeholderAssets.get('image');
        this.imageCache.set(path, placeholder);
        this.loadedAssets++;
        
        console.warn(`Asset '${path}' failed to load; using placeholder`);
        resolve(placeholder);
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
        this.retryAttempts.delete(path);
        
        Debug.log(`Loaded audio: ${path}`);
        this.eventBus.emit('asset_loaded', { type: 'audio', path, asset: audio });
        resolve(audio);
      };
      
      audio.onerror = (error) => {
        this.loadingPromises.delete(path);
        
        const retryCount = this.retryAttempts.get(path) || 0;
        
        if (retryCount < this.maxRetries) {
          // Retry loading
          this.retryAttempts.set(path, retryCount + 1);
          Debug.warn(`Retrying to load audio: ${path} (attempt ${retryCount + 1}/${this.maxRetries})`);
          
          setTimeout(() => {
            audio.src = path;
          }, 1000 * (retryCount + 1)); // Exponential backoff
          
          return;
        }
        
        // Max retries reached, use placeholder
        Debug.error(`Failed to load audio after ${this.maxRetries} attempts: ${path}`);
        this.eventBus.emit('asset_failed', { type: 'audio', path, error, attempts: retryCount });
        
        // Use placeholder asset
        const placeholder = this.placeholderAssets.get('audio');
        this.audioCache.set(path, placeholder);
        this.loadedAssets++;
        
        console.warn(`Asset '${path}' failed to load; using placeholder`);
        resolve(placeholder);
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
    this.retryAttempts.clear();
  }
  
  // Asset management methods
  unloadAsset(path, type = 'auto') {
    if (type === 'auto' || type === 'image') {
      this.imageCache.delete(path);
    }
    if (type === 'auto' || type === 'audio') {
      this.audioCache.delete(path);
    }
    this.retryAttempts.delete(path);
    
    Debug.log(`Unloaded asset: ${path}`);
    this.eventBus.emit('asset_unloaded', { type, path });
  }
  
  unloadUnusedAssets() {
    // This would need to track asset usage to implement properly
    // For now, just clear all assets
    this.clear();
    Debug.log('Unloaded all unused assets');
  }
  
  getAssetInfo(path) {
    const info = {
      path,
      image: this.imageCache.has(path),
      audio: this.audioCache.has(path),
      loading: this.loadingPromises.has(path),
      retryAttempts: this.retryAttempts.get(path) || 0
    };
    return info;
  }
  
  getMemoryUsage() {
    // Rough estimation of memory usage
    let imageMemory = 0;
    for (const [path, image] of this.imageCache) {
      imageMemory += (image.width * image.height * 4); // 4 bytes per pixel (RGBA)
    }
    
    return {
      images: this.imageCache.size,
      audio: this.audioCache.size,
      loading: this.loadingPromises.size,
      estimatedMemoryBytes: imageMemory,
      estimatedMemoryMB: (imageMemory / (1024 * 1024)).toFixed(2)
    };
  }
  
  // Event handling
  onAssetLoaded(callback) {
    return this.eventBus.on('asset_loaded', callback);
  }
  
  onAssetFailed(callback) {
    return this.eventBus.on('asset_failed', callback);
  }
  
  onAssetUnloaded(callback) {
    return this.eventBus.on('asset_unloaded', callback);
  }
}

// ==================== SPATIAL PARTITIONING ====================

class Quadtree {
  constructor(bounds, maxObjects = 10, maxDepth = 8, depth = 0) {
    this.bounds = bounds;
    this.maxObjects = maxObjects;
    this.maxDepth = maxDepth;
    this.depth = depth;
    this.objects = [];
    this.nodes = [];
    this.divided = false;
  }
  
  insert(item) {
    if (!this.bounds) return false;
    
    if (!this.intersects(this.bounds, item.bounds)) {
      return false;
    }
    
    if (this.objects.length < this.maxObjects && !this.divided) {
      this.objects.push(item);
      return true;
    }
    
    if (!this.divided) {
      this.subdivide();
    }
    
    // Try to insert into child nodes
    for (const node of this.nodes) {
      if (node.insert(item)) {
        return true;
      }
    }
    
    // If we can't insert into children, add to this node
    this.objects.push(item);
    return true;
  }
  
  subdivide() {
    const x = this.bounds.x;
    const y = this.bounds.y;
    const w = this.bounds.width / 2;
    const h = this.bounds.height / 2;
    
    this.nodes = [
      new Quadtree({ x: x, y: y, width: w, height: h }, this.maxObjects, this.maxDepth, this.depth + 1),
      new Quadtree({ x: x + w, y: y, width: w, height: h }, this.maxObjects, this.maxDepth, this.depth + 1),
      new Quadtree({ x: x, y: y + h, width: w, height: h }, this.maxObjects, this.maxDepth, this.depth + 1),
      new Quadtree({ x: x + w, y: y + h, width: w, height: h }, this.maxObjects, this.maxDepth, this.depth + 1)
    ];
    
    this.divided = true;
  }
  
  retrieve(searchArea) {
    const returnObjects = [];
    
    if (!this.intersects(this.bounds, searchArea)) {
      return returnObjects;
    }
    
    for (const item of this.objects) {
      if (this.intersects(searchArea, item.bounds)) {
        returnObjects.push(item);
      }
    }
    
    if (this.divided) {
      for (const node of this.nodes) {
        returnObjects.push(...node.retrieve(searchArea));
      }
    }
    
    return returnObjects;
  }
  
  intersects(boundsA, boundsB) {
    return !(boundsA.x > boundsB.x + boundsB.width ||
             boundsA.x + boundsA.width < boundsB.x ||
             boundsA.y > boundsB.y + boundsB.height ||
             boundsA.y + boundsA.height < boundsB.y);
  }
  
  clear() {
    this.objects = [];
    this.nodes = [];
    this.divided = false;
  }
  
  getStats() {
    let totalObjects = this.objects.length;
    let totalNodes = 1;
    
    if (this.divided) {
      for (const node of this.nodes) {
        const stats = node.getStats();
        totalObjects += stats.objects;
        totalNodes += stats.nodes;
      }
    }
    
    return { objects: totalObjects, nodes: totalNodes };
  }
}

// QUALITY OF LIFE IMPROVEMENT #6: Enhanced Physics Engine with Layer System
class PhysicsEngine {
  constructor() {
    this.gravity = new Vector2(0, 980);
    this.collisionPairs = new Map();
    this.quadtree = null;
    this.quadtreeBounds = { x: 0, y: 0, width: 2000, height: 2000 };
    this.maxObjectsPerNode = 10;
    this.maxDepth = 8;
  }

  setCollisionRule(layerA, layerB, canCollide) {
    PhysicsLayers.setCollisionRule(layerA, layerB, canCollide);
  }

  update(scene) {
    if (!scene) return;

    const collidableObjects = scene.findGameObjectsWithComponent(Collider);
    
    // Update quadtree
    this.updateQuadtree(collidableObjects);
    
    const currentCollisions = new Set();

    // Use quadtree for optimized collision detection
    for (let i = 0; i < collidableObjects.length; i++) {
      const objA = collidableObjects[i];
      if (!objA.active) continue;

      const colliderA = objA.getComponent(Collider);
      if (!colliderA.enabled) continue;

      // Get potential collision candidates from quadtree
      const candidates = this.getCollisionCandidates(objA);
      
      for (const objB of candidates) {
        if (objA === objB || !objB.active) continue;

        const colliderB = objB.getComponent(Collider);
        if (!colliderB.enabled) continue;

        // Check collision matrix
        if (!PhysicsLayers.canCollide(colliderA.layer, colliderB.layer)) {
          continue;
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
  
  // Quadtree methods
  updateQuadtree(objects) {
    this.quadtree = new Quadtree(this.quadtreeBounds, this.maxObjectsPerNode, this.maxDepth);
    
    for (const obj of objects) {
      if (obj.active) {
        const collider = obj.getComponent(Collider);
        if (collider && collider.enabled) {
          const bounds = collider.getBounds();
          this.quadtree.insert({
            object: obj,
            bounds: bounds
          });
        }
      }
    }
  }
  
  getCollisionCandidates(obj) {
    if (!this.quadtree) return [];
    
    const collider = obj.getComponent(Collider);
    if (!collider) return [];
    
    const bounds = collider.getBounds();
    const searchArea = {
      x: bounds.left,
      y: bounds.top,
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top
    };
    
    const candidates = this.quadtree.retrieve(searchArea);
    return candidates.map(item => item.object);
  }
  
  setQuadtreeBounds(x, y, width, height) {
    this.quadtreeBounds = { x, y, width, height };
  }
  
  setQuadtreeSettings(maxObjects, maxDepth) {
    this.maxObjectsPerNode = maxObjects;
    this.maxDepth = maxDepth;
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
      containerId: null,
      backgroundColor: "#000000",
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

    this.eventBus = new EventBus();

    this.renderer.backgroundColor = this.config.backgroundColor;
  }

  // Allow registering named assets prior to starting the game
  async assetManagement({ assets = {} } = {}) {
    return this.assetManager.registerAssets(assets);
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
    Rigidbody,
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
    // New enhanced features
    Quadtree,
    UISystem,
    UIElement,
    UIButton,
    UIText,
    UISlider,
    Particle,
    ParticleEmitter,
    Timer,
    TimerManager
  };
}

if (typeof window !== "undefined") {
  window.GameEngine = {
    SeedFrames: SeedFrameEngine,
    GameObject,
    Component,
    SpriteRenderer,
    Collider,
    Rigidbody,
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
    // New enhanced features
    Quadtree,
    UISystem,
    UIElement,
    UIButton,
    UIText,
    UISlider,
    Particle,
    ParticleEmitter,
    Timer,
    TimerManager
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
  "Enhanced 2D Game Engine with Advanced Features loaded and ready!"
);
console.log(
  "Features: Animation System, Spatial Partitioning, Touch/Gamepad Input, UI System, Particle System, Enhanced Audio, Scene Serialization, Debug Overlay"
);

// Fallback export to ensure engine is always available
if (typeof window !== "undefined" && !window.GameEngine) {
  window.GameEngine = {
    SeedFrames: SeedFrameEngine,
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
    Quadtree,
    UISystem,
    UIElement,
    UIButton,
    UIText,
    UISlider,
    Particle,
    ParticleEmitter,
    Timer,
    TimerManager
  };
}

// Debug logging to help identify export issues
if (typeof window !== "undefined") {
  console.log("GameEngine exported:", window.GameEngine);
  console.log("SeedFrames available:", window.GameEngine?.SeedFrames);
  console.log("Player classes available:", {
    Player: window.GameEngine?.Player,
    PlatformerPlayer: window.GameEngine?.PlatformerPlayer,
    RacingPlayer: window.GameEngine?.RacingPlayer,
    TopDownPlayer: window.GameEngine?.TopDownPlayer,
    FlyingPlayer: window.GameEngine?.FlyingPlayer
  });
}

// Ensure engine is available immediately
if (typeof window !== "undefined") {
  // Make sure all classes are available
  window.GameEngine = window.GameEngine || {};
  
  // Ensure all required classes are available
  const requiredClasses = {
    SeedFrames: SeedFrameEngine,
    GameObject,
    Component,
    SpriteRenderer,
    Collider,
    Rigidbody,
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
    Quadtree,
    UISystem,
    UIElement,
    UIButton,
    UIText,
    UISlider,
    Particle,
    ParticleEmitter,
    Timer,
    TimerManager
  };
  
  // Merge with existing GameEngine
  Object.assign(window.GameEngine, requiredClasses);
  
  // Emit ready event
  if (window.GameEngine.EventBus) {
    const eventBus = new window.GameEngine.EventBus();
    eventBus.emit('engine_ready');
  }
  
  console.log("Engine ready event emitted");
}
