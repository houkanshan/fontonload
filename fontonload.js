;(function(win) {
  var defaults = {
        timeout: 2000
      , eotFile: ''
      , testChar: '\ufffd'
      }
    , doc = win.document
    , ua = navigator.userAgent
    , unsupportRe = /(IEMobile\/[0-9])|(BlackBerry*.+Version\/[0-6])|(Opera Mini)|(Firefox\/[0-3]\.)/i
    , unsupport = unsupportRe.test(ua)
    , supportAutoScroll = !/msie [6-9]/i.test(ua)
    , supportFontsLoading = ('fonts' in doc)

  var testStyle = [
        'position:absolute'
      , 'top:-1000px'
      , 'height:1px', 'width:1px'
      , 'overflow:hidden'
      , 'font:12px/1 arial'
      ].join(';')
    , testFontFamily = '{f},arial'

  function createTestScroller(testChar) {
    var scroller = document.createElement('div');
    scroller.style.cssText = testStyle
    document.body.appendChild(scroller)
    scroller.appendChild(document.createTextNode(testChar))
    return scroller
  }

  function FontOnload(options) {
    var opts = {}
    opts.timeout = options.timeout || defaults.timeout
    opts.eotFile = options.eotFile
    opts.testChar = options.testChar || defaults.testChar
    this.options = opts
  }

  var proto = FontOnload.prototype
  proto.load = function(fontname, success, fail) {
    if (unsupport) { return fail && fail() }

    var args = [].slice.apply(arguments)
      , self = this
      , timer

    args[1] = function() {
      if (!timer) { return } // already ran
      clearTimeout(timer)
      timer = null
      success && success() /*jshint -W030 */
      self.scroller && document.body.removeChild(self.scroller) /*jshint -W030 */
    }
    args[2] = function() {
      if (!timer) { return } // already ran
      clearTimeout(timer)
      timer = null
      fail && fail() /*jshint -W030 */
      self.scroller && document.body.removeChild(self.scroller) /*jshint -W030 */
    }

    timer = setTimeout(args[2], this.options.timeout)

    if (supportFontsLoading) {
      this.loadingDetectByBrowser.apply(this, args)
    } else if (supportAutoScroll) {
      this.loadingDetectByScroll.apply(this, args)
    } else {
      this.loadingDetectByPreload.apply(this, args)
    }
  }

  proto.loadingDetectByBrowser = function(fontname, success, fail) {
    document.fonts.load('1em ' + fontname).then(success, fail)
  }

  proto.loadingDetectByScroll = function(fontname, success, fail) {
    var scroller = this.scroller = createTestScroller(this.options.testChar)
    scroller.scrollLeft = scroller.scrollWidth - 1
    scroller.style.fontFamily = testFontFamily.replace('{f}', fontname)

    if(scroller.scrollLeft === 0) { return success() } // Firefox may use cache.
    scroller.onscroll = function() {
      if(scroller.scrollLeft === 0) {  return success() }
    }
  }

  proto.loadingDetectByPreload = function(fontname, success, fail) {
    var loader = new Image()
      , self = this
    loader.onabort = loader.onload = loader.onerror = function() {
      var scroller = self.scroller = createTestScroller(self.options.testChar)
      var scrollWidth = scroller.scrollWidth
      scroller.style.fontFamily = testFontFamily.replace('{f}', fontname)
      setTimeout(function() {
        scroller.scrollWidth !== scrollWidth ? success() : fail() /*jshint -W030 */
      }, 1)
    }
    loader.src = this.options.eotFile
  }

  win.FontOnload = function(fontname, options) {
    var fontonload = new FontOnload(options)
    fontonload.load(fontname , options.success, options.fail)
  }
}(this))
