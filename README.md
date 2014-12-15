# fontonload

[![Build Status](https://img.shields.io/travis/houkanshan/fontonload/master.svg)](https://travis-ci.org/houkanshan/fontonload)

[中文TODO](http://houkanshan.github.io/)

## Usage

1. Patch your font with the `patch.ttf` file,
  which include a blank graph(non-spacing and no-marking)
  on [U+FFFD](http://www.fileformat.info/info/unicode/char/fffd/index.htm)
2. Declare the `@font-face` in your CSS.
3. Load the library.

```
FontOnload('fontname', {
  eotFile: './fonts/fontname.eot'
, success: function() {
  }
, fail: function() {

  }
})
```

## How it Works

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


