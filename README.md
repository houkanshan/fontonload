# fontonload

[![Build Status](https://magnum.travis-ci.com/houkanshan/fontonload.svg?token=jqtussTxt3duXbPxyhA7&branch=master)](https://magnum.travis-ci.com/houkanshan/fontonload)

Cross browser detecting web font loading, without using timer (setTimeout / setInterval).


[中文 TODO]

## Usage

1. Patch your font with the `patch.ttf` file,
  which include a blank graph(non-spacing and no-marking)
  on [U+FFFD](http://www.fileformat.info/info/unicode/char/fffd/index.htm)
2. Declare the `@font-face` in your CSS.
3. Load the library.

```javascript
FontOnload('fontname', {
  eotFile: './fonts/fontname.eot'
, success: function() {
  }
, fail: function() {
  }
})
```

You can check the [demo page](http://houkanshan.github.io/fontonload/demo)
to see if it works.

## How it Works

1. It use the [CSS Font Loading Module](http://dev.w3.org/csswg/css-font-loading/)
when supported.
2. For these browser which can auto trigger `scroll` event after height/width decreased,
it use scroller element to detect the font loading.
See *smhn's* [article](http://smnh.me/web-font-loading-detection-without-timers/) for more detail.
3. For IE 6–9, which don't trigger `scroll` event.
I found that they don't have FOUT if the font file is in cache, so the code just preload the eot font
to make sure the font file is in cache.
4. It exclude the browser which don't support web font
(BlackBerry 5/6, Opera Mini, Windows Phone 7/7.5)


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
