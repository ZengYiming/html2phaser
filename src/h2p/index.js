//import h2c from '../h2c/core';
var h2c = require('../h2c/core');

/*
 * @param options = {
 *  src: document.body,
 *  spriteClass: 'h2p_sprite',
 *  ignoreClass: 'h2p_ignore',
 *  spriteName: 'h2p_name',
 *  logging: false,
 *
 * }
 */

var ww = document.documentElement.getBoundingClientRect().width;
var wh = window.innerHeight;

class Html2phaser {

    constructor(options) {
        options = options || {};
        this.src = options.src && options.src.nodeType === 1 ? options.src : document.body; 
        this.spriteClass = typeof options.spriteClass !== "string" ? 'h2p_sprite' : options.spriteClass;
        this.ignoreClass = typeof options.ignoreClass !== "string" ? 'h2p_ignore' : options.ignoreClass;
        this.spriteName = typeof options.spriteName !== "string" ? 'h2p_name' : options.spriteName;
        this.logging = !!options.logging;
        this.dpr = window.devicePixelRatio || 1;
        this.srcIsRoot = this.src === document.documentElement|| this.src === document.body;
        this.width = this.srcIsRoot ? window.innerWidth : this.src.offsetWidth;
        this.height = this.srcIsRoot ? window.innerHeight: this.src.offsetHeight;
        this.scroll_height = this.srcIsRoot ? Math.max(document.body.clientHeight, this.height) : this.src.scrollHeight;
        this.scroll_width = this.srcIsRoot ? Math.max(document.body.clientWidth, this.width) : this.src.scrollWidth;
    }

    create() {
        return h2c(this.src, {
            spriteClass: this.spriteClass,
            ignoreClass: this.ignoreClass,
            logging: this.logging,
            dpr: this.dpr,
            useCORS: true,
        }).then((function(result) {
            //result = {canvas, spriteNodes, bounds}
            var data = result.canvas.toDataURL('image/png');
            this.gameData = {
                bg_uri: data, 
                world_w: this.scroll_width * this.dpr, 
                world_h: this.scroll_height * this.dpr, 
                scroll_y: Math.max(this.src.scrollTop, 0), 
                scroll_x: Math.max(this.src.scrollLeft, 0), 
                nodes: [],
                show: (function() {
                    while(this.src.firstChild) {
                        this.src.removeChild(this.src.firstChild);
                    }
                    this.src.appendChild(this.base_el);
                    setTimeout((function() {
                        this.base_el.style = "visibility:visible;";
                    }).bind(this), 200)
                }).bind(this)
            }

            return new Promise((function(resolve) {
                if(result.spriteNodes && result.spriteNodes.length) {
                    this.gameData.nodes = result.spriteNodes;
                    var index = 0;
                    var len = result.spriteNodes.length;
                    var srcNodes = document.querySelectorAll('.h2p_sprite');
                    result.spriteNodes.forEach(function(node) {
                        this.getSpriteImage(node.node).then((function(subResult) {
                            node.dataUrl = subResult.dataUrl;
                            node.name = node.node.dataset[this.spriteName];
                            //node.bounds = subResult.bounds;
                            node.bounds = {
                                top: Math.max(subResult.bounds.top - result.bounds.top, 0),
                                left: Math.max(subResult.bounds.left - result.bounds.left, 0),
                                width: subResult.bounds.width,
                                height: subResult.bounds.height
                            };
                            if(len === ++index) {
                                this.initGame(resolve);
                            }
                        }).bind(this));
                    },this)
                } else {
                    this.initGame(resolve);
                }
            }).bind(this))
        }).bind(this));
    }

    initGame(resolve) {
        this.base_el = document.createElement('div');
        this.base_el.style = `width:${this.width}px;height:${this.height}px;visibility:hidden;`;
        
        var game = new Phaser.Game(this.width * this.dpr, this.height * this.dpr, Phaser.AUTO, this.base_el);

        game.world_ratio = game.native_x / game.native_y;
        game.dpr = this.dpr;
        game.h2p_data = this.gameData;

        resolve(game);
    }

    getSpriteImage(node) {
        return h2c(node, {
            dpr: this.dpr,
            useCORS: true,
        }).then(function(result) {
            var dataUrl = result.canvas.toDataURL('image/png');
            return {
                dataUrl: dataUrl,
                bounds: result.bounds
            }
        })
    }
}

module.exports = Html2phaser;
