var dimensions = {
  width: 0,

  height: 0,

  /**
   *
   * @returns {number} width of the window
   */
  getWidth: function () {
    if (window.innerWidth) {
      return window.innerWidth;
    }
    if (document.documentElement && document.documentElement.clientWidth) {
      return document.documentElement.clientWidth;
    }
    if (document.body) {
      return document.body.clientWidth;
    }
    return 0;
  },

  /**

   * @returns {number} height of the window
   */
  getHeight: function () {
    if (window.innerWidth) {
      return window.innerHeight;
    }
    if (document.documentElement && document.documentElement.clientHeight) {
      return document.documentElement.clientHeight;
    }
    if (document.body) {
      return document.body.clientHeight;
    }
    return 0;
  },

  /**

   * @returns {boolean} true if the canvas was resized
   */
  update: function () {
    var curW = this.getWidth();
    var curH = this.getHeight();
    if (curW != this.width || curH != this.height) {
      this.width = curW;
      this.height = curH;
      return true;
    } else {
      return false;
    }
  },
};
