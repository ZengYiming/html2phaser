
import 'style/main.scss';
import 'style/reset.scss';

import Boot from './states/boot';
import Boot2 from './states/boot2';


//import Html2phaser from '../h2p/index';
import Html2phaser from 'dist/js/html2phaser.js';

//require('js/vendor/phaser.min.js');

function bootGame() {
    var h2p = new Html2phaser({
        src: document.body,
        spriteClass: 'h2p_sprite',
        ignoreClass: 'h2p_ignore',
        spriteName: 'h2p_name',
        logging: false,
    });
    h2p.create().then(function(game) {
        game.state.add('boot', new Boot());
        game.state.start('boot');
    });
}
function bootGame2() {
    var h2p = new Html2phaser({
        src: document.querySelector('#mydiv'),
        spriteClass: 'h2p_sprite',
        ignoreClass: 'h2p_ignore',
        spriteName: 'h2p_name',
        logging: false,
    });
    h2p.create().then(function(game) {
        game.state.add('boot', new Boot2());
        game.state.start('boot');
    });
}
document.querySelector('#mydiv').addEventListener('click', function(e) {
    if(window.location.pathname === '/bodydemo.html') {
        bootGame();
    } else if(window.location.pathname === '/elementdemo.html') {
        bootGame2();
    }
})
