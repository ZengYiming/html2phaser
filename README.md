# html2phaser
html2phaser is Based on html2canvas. Transform dom element to phaser sprite。

### Examples ###

    $ npm run dev

* http://127.0.0.1:8989/bodydemo.html
* http://127.0.0.1:8989/elementdemo.html

### Usage ###

``` 
import Boot from './states/boot';

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
```

