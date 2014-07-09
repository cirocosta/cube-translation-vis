# \<cube-translation-vis\>

> Shows a very simple visualization of the commands passed to the 3d scene (exposes them to the handler).

```html
<cube-transvis width="200" handler="onMove(dir)"></cube-transvis>
```

![Imgur](http://i.imgur.com/5tWrKyl.png)


```sh
$ bower install cube-translation-vis
```

## Attributes

|   attr   |                                desc                               |
| -------- | ----------------------------------------------------------------- |
| width    | the number os pixels to set the width (automatically setc height) |
| handler  | function to be called on every move - exposes a 'direction' event |
| debounce | the time to be passed to the debounce function. defaults 500      |

## Dependencies

This depends entirely on angular, tween.js and three.js. Go check those projects, they're awesome :smile:
