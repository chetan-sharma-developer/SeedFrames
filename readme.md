# 🎮 SeedFrames - Advanced 2D Web Game Engine

A powerful, feature-rich 2D game engine built with vanilla JavaScript, designed for rapid game development with a focus on developer experience and code clarity.

## 🌟 Features

### **Core Engine**

- **Component-Based Architecture** - Build complex game objects through composition
- **Scene Management** - Seamless scene transitions and management
- **Fixed Timestep Game Loop** - Consistent physics and rendering at 60 FPS
- **Advanced Physics** - AABB collision detection with layer-based filtering
- **Asset Management** - Efficient loading and caching of images and audio
- **Input System** - Comprehensive keyboard and mouse input handling


### **Quality of Life Improvements**

- **Fluent API** - Chainable GameObject creation for cleaner code
- **Enhanced getComponent()** - Supports inheritance for better component relationships
- **Timer System** - Scene-integrated setTimeout/setInterval that respects game state
- **State Machine** - Clean finite state machines for complex behavior
- **Physics Layers** - Collision matrix system for organized interactions
- **Tilemap Support** - Efficient level creation and collision detection


### **Multi-Genre Player System**

- **Platformer Player** - Jump mechanics, coyote time, variable jump height
- **Racing Player** - Realistic steering, acceleration, and drift physics
- **Top-Down Player** - 8-directional movement with smooth controls
- **Flying Player** - Momentum-based flight with lift mechanics
- **Side-Scroller Player** - Classic horizontal movement patterns


## 🚀 Quick Start

### **1. Basic Setup**

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Game</title>
</head>
<body>
    <div id="game-container"></div>
    <script src="./seedframes.js"></script>
    <script>
        // Your game code here
    </script>
</body>
</html>
```


### **2. Create Your First Game**

```javascript
// Initialize engine
const engine = new GameEngine.Engine({
    width: 800,
    height: 600,
    containerId: 'game-container',
    backgroundColor: '#87CEEB'
});

// Create scene
const gameScene = engine.createScene('MainScene');

// Create player using fluent API
const player = gameScene.createGameObject('Player')
    .at(100, 300)
    .withColor('#4a90e2', 32, 48)
    .withCollider('box', 32, 48, true, 'Player')
    .withPlatformerPlayer({
        speed: 200,
        jumpForce: 400,
        onJump: () => console.log('Jump!')
    })
    .build();

// Create platform
const platform = gameScene.createGameObject('Platform')
    .at(200, 400)
    .withColor('#ffffff', 200, 40)
    .withCollider('box', 200, 40, false, 'Platform')
    .build();

// Setup physics
engine.physicsEngine.setCollisionRule('Player', 'Platform', true);

// Start game
gameScene.camera.follow(player);
engine.sceneManager.add('main', gameScene);
engine.sceneManager.load('main');
engine.start();
```


## 🏗️ Engine Architecture

### **Component System**

The engine uses a composition-based architecture where GameObjects are containers for Components that define behavior.

```javascript
// Base component
class MyComponent extends GameEngine.Component {
    constructor() {
        super();
        this.myProperty = 'value';
    }

    awake() {
        // Called when component is added
    }

    start() {
        // Called before first update
    }

    update(deltaTime) {
        // Called every frame
    }

    onCollisionEnter(other) {
        // Called when collision starts
    }
}

// Usage
gameObject.addComponent(new MyComponent());
const comp = gameObject.getComponent(MyComponent);
```


### **Scene Management**

Organize your game into scenes for different levels or screens:

```javascript
// Create multiple scenes
const menuScene = engine.createScene('Menu');
const gameScene = engine.createScene('Game');
const gameOverScene = engine.createScene('GameOver');

// Add scenes to manager
engine.sceneManager.add('menu', menuScene);
engine.sceneManager.add('game', gameScene);
engine.sceneManager.add('gameOver', gameOverScene);

// Switch between scenes
engine.sceneManager.load('game');
```


### **Physics Layers**

Organize collision detection with layer-based rules:

```javascript
// Define what can collide with what
engine.physicsEngine.setCollisionRule('Player', 'Enemy', true);
engine.physicsEngine.setCollisionRule('Player', 'Collectible', true);
engine.physicsEngine.setCollisionRule('PlayerBullet', 'Enemy', true);
engine.physicsEngine.setCollisionRule('PlayerBullet', 'Environment', false);

// Create objects with specific layers
.withCollider('box', 32, 32, false, 'Player')    // Solid player
.withCollider('box', 16, 16, true, 'Collectible') // Trigger collectible
```


## 🎯 Player System Guide

### **Platformer Player**

Perfect for Mario-style games with precise jumping mechanics:

```javascript
const player = gameScene.createGameObject('Player')
    .withPlatformerPlayer({
        speed: 200,
        jumpForce: 450,
        gravity: 980,
        coyoteTime: 0.1,        // Grace period for jumping after leaving ground
        jumpBufferTime: 0.1,    // Input buffer for responsive controls
        onJump: () => playSound('jump'),
        onLanding: () => playSound('land')
    })
    .build();
```


### **Racing Player**

For top-down or side-view racing games:

```javascript
const car = gameScene.createGameObject('RaceCar')
    .withRacingPlayer({
        maxSpeed: 400,
        acceleration: 600,
        steeringSpeed: 120,
        brakingForce: 800,
        upKey: 'ArrowUp',
        downKey: 'ArrowDown',
        leftKey: 'ArrowLeft',
        rightKey: 'ArrowRight'
    })
    .build();
```


### **Custom Input Configuration**

```javascript
const player = gameScene.createGameObject('Player')
    .withTopDownPlayer({
        speed: 250,
        upKey: 'KeyW',
        downKey: 'KeyS',
        leftKey: 'KeyA',
        rightKey: 'KeyD',
        action1Key: 'Space',
        action2Key: 'KeyE'
    })
    .build();
```


## 🔄 State Machine System

Clean up complex behavior with finite state machines:

```javascript
// Define states
class IdleState extends GameEngine.State {
    constructor() { super('idle'); }
    
    enter() {
        console.log('Entering idle state');
    }
    
    update(deltaTime) {
        if (this.stateMachine.gameObject.getComponent(GameEngine.Player).velocity.magnitude() > 10) {
            this.transitionTo('moving');
        }
    }
}

class MovingState extends GameEngine.State {
    constructor() { super('moving'); }
    
    update(deltaTime) {
        if (this.stateMachine.gameObject.getComponent(GameEngine.Player).velocity.magnitude() < 10) {
            this.transitionTo('idle');
        }
    }
}

// Add to GameObject
const fsm = gameObject.addComponent(new GameEngine.StateMachine('idle'));
fsm.addState('idle', new IdleState())
   .addState('moving', new MovingState());
```


## ⏱️ Timer System

Scene-integrated timers that respect game pause state:

```javascript
// One-time delay
scene.setTimeout(() => {
    console.log('This runs after 2 seconds');
}, 2.0);

// Repeating timer
const spawnTimer = scene.setInterval(() => {
    spawnEnemy();
}, 5.0);

// Clear timer
scene.clearTimer(spawnTimer);
```


## 🗺️ Tilemap System

Efficient level creation and collision:

```javascript
// Create tilemap
const level = gameScene.createGameObject('Level')
    .withTilemap(32, 32) // 32x32 pixel tiles
    .build();

const tilemap = level.getComponent(GameEngine.Tilemap);

// Load level data
tilemap.loadFromArray([
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 2, 0, 1,
    1, 1, 1, 1, 1
], 5, 4); // 5 width, 4 height

// Set collision layer (0 = passable, 1 = solid)
tilemap.setCollisionLayer([
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1
]);

// Check collision at world position
if (tilemap.checkCollisionAt(worldX, worldY, playerWidth, playerHeight)) {
    console.log('Collision detected!');
}
```


## 🎨 Advanced Game Objects

### **Collectible System**

```javascript
class Collectible extends GameEngine.Component {
    constructor(value = 100, type = 'coin') {
        super();
        this.value = value;
        this.type = type;
        this.collected = false;
    }

    onCollisionEnter(other) {
        if (this.collected) return;
        
        const player = other.getComponent(GameEngine.Player);
        if (player) {
            this.collected = true;
            Game.addScore(this.value);
            this.gameObject.destroy();
        }
    }
}

// Create collectible
const coin = gameScene.createGameObject('Coin')
    .at(300, 200)
    .withColor('#ffd700', 16, 16)
    .withCollider('box', 16, 16, true, 'Collectible')
    .withComponent(new Collectible(100, 'coin'))
    .build();
```


### **Enemy AI**

```javascript
class EnemyAI extends GameEngine.Component {
    constructor(speed = 100, detectionRange = 150) {
        super();
        this.speed = speed;
        this.detectionRange = detectionRange;
        this.player = null;
        this.state = 'patrol';
    }

    start() {
        this.player = this.gameObject.scene.findGameObjectWithComponent(GameEngine.Player);
    }

    update(deltaTime) {
        if (!this.player) return;

        const distance = this.gameObject.transform.position.distance(
            this.player.transform.position
        );

        if (distance < this.detectionRange) {
            this.chasePlayer(deltaTime);
        } else {
            this.patrol(deltaTime);
        }
    }

    chasePlayer(deltaTime) {
        const direction = this.player.transform.position
            .subtract(this.gameObject.transform.position)
            .normalize();
        
        const movement = direction.multiplyByScalar(this.speed * deltaTime);
        this.gameObject.transform.position = this.gameObject.transform.position.add(movement);
    }

    patrol(deltaTime) {
        // Implement patrol logic
    }
}
```


## 🔧 API Reference

### **Engine Class**

```javascript
const engine = new GameEngine.Engine(config);

// Methods
engine.start()                    // Start the game loop
engine.stop()                     // Stop the game loop  
engine.pause()                    // Pause the game
engine.resume()                   // Resume the game
engine.createScene(name)          // Create new scene
engine.resize(width, height)      // Resize canvas
engine.setDebugMode(enabled)      // Toggle debug rendering
engine.getFPS()                   // Get current FPS
```


### **Scene Class**

```javascript
const scene = new GameEngine.Scene(name);

// Fluent API
scene.createGameObject(name)      // Returns GameObjectBuilder
scene.addGameObject(gameObject)   // Add existing GameObject
scene.removeGameObject(obj)       // Remove GameObject
scene.findGameObject(name)        // Find by name
scene.setTimeout(callback, delay) // Scene timer
scene.setInterval(callback, delay)// Repeating timer
```


### **GameObject Class**

```javascript
const obj = new GameEngine.GameObject(name);

// Component management
obj.addComponent(component)       // Add component
obj.getComponent(ComponentClass)  // Get component (supports inheritance)
obj.removeComponent(ComponentClass) // Remove component
obj.sendMessage(msg, data)        // Send message to all components
obj.setActive(active)             // Enable/disable object
obj.destroy()                     // Destroy object
```


### **Player Classes**

All player classes inherit from the base `Player` class:

```javascript
// Available player types
GameEngine.Player              // Base class
GameEngine.PlatformerPlayer    // Platformer movement
GameEngine.RacingPlayer        // Racing mechanics
GameEngine.TopDownPlayer       // Top-down movement
GameEngine.FlyingPlayer        // Flying controls
```


## 🐛 Troubleshooting

### **Common Issues**

**Player not jumping:**

- Ensure `inputManager.update()` is called in game loop
- Check if player is grounded with ground detection component
- Verify jump key configuration

**Collisions not working:**

- Check physics layer rules with `setCollisionRule()`
- Ensure colliders have correct `isTrigger` setting
- Verify collision callbacks are implemented

**Sprites not loading:**

- Check console for image loading errors
- Ensure image paths are correct
- Use `setColor()` for solid color rectangles during development

**Performance issues:**

- Enable frustum culling (automatic)
- Use physics layers to reduce collision checks
- Limit the number of GameObjects in scenes


### **Debug Mode**

Enable debug mode to see collision bounds and performance stats:

```javascript
const engine = new GameEngine.Engine({
    debug: true  // Shows collision boxes and render stats
});

// Or toggle at runtime
engine.setDebugMode(true);
GameEngine.Debug.enabled = true;
```


## 📁 Project Structure

```
my-game/
├── seedframes.js          # The game engine
├── index.html            # Main game file
├── assets/               # Game assets
│   ├── images/
│   ├── sounds/
│   └── levels/
├── src/                  # Your game code
│   ├── components/       # Custom components
│   ├── scenes/          # Scene definitions
│   └── game.js          # Main game logic
└── README.md
```


## 🎮 Example Games

### **Complete Platformer**

See `examples/platformer/` - Features state machines, multiple enemy types, collectibles, and advanced physics.

### **Racing Game**

See `examples/racing/` - Demonstrates vehicle physics, track collision, and lap timing.

### **Top-Down Adventure**

See `examples/adventure/` - Shows inventory system, NPCs, and scene transitions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow the component-based architecture
- Add debug logging for new features
- Include examples for new components
- Maintain backward compatibility
- Write clear documentation


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Unity's component system
- Built with modern JavaScript ES6+ features
- Designed for educational and commercial use
- Community-driven development


## 📚 Advanced Topics

### **Custom Components**

Create reusable components for your game:

```javascript
class Health extends GameEngine.Component {
    constructor(maxHealth = 100) {
        super();
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }

    takeDamage(amount) {
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        if (this.currentHealth === 0) {
            this.gameObject.sendMessage('death');
        }
    }

    heal(amount) {
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    }
}
```


### **Save System**

Implement game state persistence:

```javascript
class SaveManager {
    static saveGame(data) {
        localStorage.setItem('gameData', JSON.stringify(data));
    }

    static loadGame() {
        const data = localStorage.getItem('gameData');
        return data ? JSON.parse(data) : null;
    }
}
```


### **Audio System**

Enhanced audio management:

```javascript
// Add audio to GameObject
const audioSource = gameObject.addComponent(new GameEngine.AudioSource(
    'assets/sounds/jump.wav',
    0.8,    // volume
    false   // loop
));

// Play sound
audioSource.play();
```

**SeedFrames** - Plant the seeds of your next great game! 🌱🎮

