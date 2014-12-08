;(function(win) {

  var defaults = {
        timeout: 2000
      , success: function() {}
      , fail: function() {}
      }
    , doc = win.document

  function FontOnload(options) {
    var opts = {}
    opts.timeout = options.timeout || defaults.timeout
    opts.success = options.success || defaults.success
    opts.fail = options.fail || defaults.fail
    this.options = opts

    this.supportFontsLoading = ('fonts' in doc)
    this.supportAutoScroll = !/ie [6-8]/i.test(navigate.userAgent)

  }

  var proto = FontOnload.prototype
  proto.load = function() {
    var self = this
    if (supportFontsLoading) {
      this.loadingDetectByBrowser(fontname)
    } else if (supportAutoScroll){
      this.loadingDetectByScroll(fontname)
    } else {
      this.loadingDetectByPreload(fontname)
    }

    this.timer = setTimeout(function() {
      self.options.error()
    }, this.options.timeout)
  }

  proto.loadingDetectByBrowser = function() {
  }

  proto.loadingDetectByScroll = function() {
  }

  proto.loadingDetectByPreload = function() {
  }

  return function(fontname, options) {
    var fontonload = new FontOnload(options)
    fontonload.load(fontname)
  }

}(this))
