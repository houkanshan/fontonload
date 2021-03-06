;(function(win) {
  var defaults = {
        timeout: 3000
      , eotFile: ''
      , testChar: '\ufffd'
      }
    , doc = win.document
    , ua = navigator.userAgent
    , unsupportRe = /(IEMobile\/[0-9])|(BlackBerry*.+Version\/[0-6])|(Opera Mini)|(Firefox\/[0-3]\.)/i
    , unsupport = unsupportRe.test(ua)
    , supportAutoScroll = !/msie [6-9]/i.test(ua)
    , supportFontsLoading = ('fonts' in doc)
    , ie9 = /msie 9/i.test(ua)
    , errorMeasure = 'MeasureFailed'
    , errorTimeout = 'Timeout'
    , errorUnsupport = 'Unsupport'

  var testStyle = [
        'position:absolute'
      , 'top:-1000px'
      , 'height:1px', 'width:1px'
      , 'overflow:hidden'
      , 'font:12px/1 arial'
      ].join(';')
    , testFontFamily = '{f},arial'

  function createTestScroller(testChar) {
    var scroller = doc.createElement('div');
    scroller.style.cssText = testStyle
    doc.body.appendChild(scroller)
    scroller.appendChild(doc.createTextNode(testChar))
    return scroller
  }

  function defer(f) { setTimeout(f, 1) }

  function FontOnload(options) {
    var opts = {}
    opts.timeout = options.timeout || defaults.timeout
    opts.eotFile = options.eotFile
    opts.testChar = options.testChar || defaults.testChar
    this.options = opts
  }

  var proto = FontOnload.prototype
  proto.load = function(fontname, success, fail) {
    if (unsupport) { return fail && fail(new Error(errorUnsupport)) }

    var args = [].slice.apply(arguments)
      , self = this
      , timer

    args[1] = function() {
      if (!timer) { return } // already ran
      clearTimeout(timer)
      timer = null
      success && success() /*jshint -W030 */
      self.scroller && doc.body.removeChild(self.scroller) /*jshint -W030 */
    }
    args[2] = function(e) {
      if (!timer) { return } // already ran
      clearTimeout(timer)
      timer = null
      fail && fail(e) /*jshint -W030 */
      self.scroller && doc.body.removeChild(self.scroller) /*jshint -W030 */
    }

    timer = setTimeout(function() {
      args[2](new Error(errorTimeout))
    }, this.options.timeout)

    if (supportFontsLoading) {
      this.loadingDetectByBrowser.apply(this, args)
    } else if (supportAutoScroll) {
      this.loadingDetectByScroll.apply(this, args)
    } else {
      this.loadingDetectByPreload.apply(this, args)
    }
  }

  proto.loadingDetectByBrowser = function(fontname, success, fail) {
    doc.fonts.load('1em ' + fontname).then(success, fail)
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

  var iframeHtml =  ''
+ '<head><script></script>'
+ '<style>'
+   '@font-face {'
+     'font-family: {font};'
+     'src: url("{path}?#iefix") format("embedded-opentype");'
+     'font-weight: normal;'
+     'font-style: normal;'
+   '}'
+   'body { font: 12px/1 {font},arial; }'
+ '</style>'
+ '</head>'
+ '<body>'
+ '{testChar}'
+ (ie9 ? '<img src="{path}?#iefix"/>' : '<img src="{path}"/>')
+ '</body>'

  proto.loadingDetectByPreload = function(fontname, success, fail) {
    var iframe = doc.createElement('iframe')
      , html = iframeHtml.replace(/{font}/g, fontname)
          .replace(/{path}/g, this.options.eotFile)
          .replace('{testChar}', this.options.testChar)
    iframe.style.cssText = testStyle

    var self = this
    function onload () {
      doc.body.removeChild(iframe)
      var scroller = self.scroller = createTestScroller(self.options.testChar)
        , scrollWidth = scroller.scrollWidth
      scroller.style.fontFamily = testFontFamily.replace('{f}', fontname)
      defer(function() {
        scroller.scrollWidth !== scrollWidth
          ? success() : fail(new Error(errorMeasure)) /*jshint -W030 */
      })
    }

    if (iframe.attachEvent) {
      iframe.attachEvent('onload', onload)
    } else {
      iframe.onload = onload
    }

    doc.body.appendChild(iframe)
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(html)
    defer(function() {
      iframe.contentWindow.document.close()
    })
  }

  win.FontOnload = function(fontname, options) {
    var fontonload = new FontOnload(options)
    fontonload.load(fontname , options.success, options.fail)
  }
}(this))
