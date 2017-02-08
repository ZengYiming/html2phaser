import star_url from 'images/star.png';
import dude_url from 'images/dude.png';

class Boot extends Phaser.State {

    constructor() {
        super();
    }

    init() {
        this.game.input.maxPointers = 1;
        this.game.load.crossOrigin = 'anonymous';
        this.game.renderer.renderSession.roundPixels = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.forceOrientation(false, true);
        
        this.stage.backgroundColor = window.getComputedStyle(document.body)['background-color'];
        this.world.resize(this.game.h2p_data.world_w, this.game.h2p_data.world_h);
        //console.log(this.game.h2p_data);
    }

    preload() {
        var self = this;
        self.game.load.image('bg', self.game.h2p_data.bg_uri);
        this.game.camera.y = this.game.h2p_data.scroll_y * this.game.dpr;
        this.game.camera.x = this.game.h2p_data.scroll_x * this.game.dpr;

        //preload h2p sprite
        this.game.h2p_data.nodes.forEach(function(node) {
            self.game.load.image(node.name, node.dataUrl);
        });

        this.game.load.image('star', star_url);
        this.game.load.spritesheet('dude', dude_url, 32, 48);
    }

    create() {
        var self = this;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bg = this.game.add.image(0, 0, 'bg');
        this.bg.width = this.game.world.width;

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        //create h2p sprite
        this.game.h2p_data.nodes.forEach(function(node) {
            this[node.name] = this.game.add.sprite(node.bounds.left * this.game.dpr, node.bounds.top * this.game.dpr, node.name);
            if(/^platform\w*/.test(node.name)) {
                this.platforms.add(this[node.name]);
            }
        }, this)
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.checkCollision.down', false);
        this.platforms.setAll('body.checkCollision.right', false);
        this.platforms.setAll('body.checkCollision.left', false);
        
        this.game.physics.arcade.enable(this.can_move);
        this.can_move.body.collideWorldBounds = true;
        this.can_move.body.drag = {x: 200, y:0};
        this.can_move.body.bounce.x = 0.5;

        this.player = this.game.add.sprite(this.world.centerX * 0.5, this.camera.y, 'dude', 4);
        this.player.scale.set(2);
        this.player.anchor.set(0.5, 1);
        this.game.physics.arcade.enable(this.player);
        //this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.body.onWorldBounds = new Phaser.Signal();
        this.player.body.onWorldBounds.add(function(player, up, down, left, right) {
            if(down) {
                self.startFlag = true;
            }
        })
        this.player.update = function() {
            if(!self.followFlag && this.y > self.camera.y + self.camera.height / 2) {
                self.followFlag = true;
                self.camera.follow(this);
            }
        }
        
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.stars = this.game.add.group();

        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        for (var i = 0; i < 8; i++)
        {
            var star = this.stars.create(this.world.width * (i + 1)/9, this.camera.y, 'star');
            star.anchor.set(0.5);
            star.scale.set(2);
            star.body.gravity.y = 300;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
            star.body.collideWorldBounds = true;
        }

        setTimeout(this.game.h2p_data.show, 500)
    }

    update() {
        if(!this.startFlag) return;
        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.collide(this.stars, this.platforms);
        this.game.physics.arcade.collide(this.player, this.stars, this.collectStar, null, this);
        this.game.physics.arcade.collide(this.player, this.can_move);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }
        
        if (this.cursors.up.isDown && (this.player.body.touching.down || this.player.body.onFloor()))
        {
            this.player.body.velocity.y = -300;
        }
    }

    collectStar(player, star) {
        star.kill();
    }

}

export default Boot;
