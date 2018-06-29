"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var days = ["一", "二", "三", "四", "五", "六", "日"];
var dayMap = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "日"
};
var firstColWidth = 25;
var header = {
  size: 10,
  height: 50,
  bg: "#f5f5f5",
  color: "#555",
  lineColor: "#d0d0d0"
};
var colHeader = {
  size: 10,
  width: 25,
  bg: "#f5f5f5",
  color: "#555",
  lineColor: "#d0d0d0"
};
var courseStyle = {
  color: "#fff",
  size: 10,
  top: 5
  // title set
};var titleStyle = {
  size: 20,
  height: 50,
  color: "#000",
  bg: "#f5f5f5"
};
/**
 * 微信小程序Canvas课程表，用于展示或者是分享图
 * @class Schdule
 */

var Schedule = function () {
  /**
   * 对象初始化
   * @param {Object} options 参数 
   */
  function Schedule(options) {
    var _this = this;

    _classCallCheck(this, Schedule);

    // 必要参数，canvas id，长宽
    ["id", "width", "height"].forEach(function (e) {
      _this.optionCheck(e, options);
    }, this);

    this.title = options.title || '';

    // 不必要参数
    // 日期
    this.days = options.days || days;

    // 标题，第一列，第一行样式设置
    this.titleStyle = options.titleStyle || titleStyle;
    this.colHeader = options.colHeader || colHeader;
    this.header = options.header || header;

    // 一天多少节课
    this.sessions = options.sessions || 13;

    // 课程宽度
    this.courseWidth = options.courseWidth || (this.width - this.colHeader.width) / this.days.length;
    if (options.courseHeight) {
      this.courseHeight = options.courseHeight;
    } else if (this.title != '') {
      this.courseHeight = (this.height - this.titleStyle.height - this.header.height) / this.sessions;
    } else {
      this.courseHeight = (this.height - this.header.height) / this.sessions;
    }

    // 设置首行文字大小
    if (!('header' in options) || !options.header) {
      this.header = header;
      this.header.size = this.courseWidth / 2 - 10;
    }
    // 课程样式
    this.courseStyle = options.courseStyle || courseStyle;

    // 获取canvas对象
    this.ctx = wx.createCanvasContext(this.id);

    // 
    this.startY = 0;

    // 
    this.options = options;
  }

  /**
   * 参数校验
   * @param {String} props 属性 
   * @param {Object} option 参数
   */


  _createClass(Schedule, [{
    key: "optionCheck",
    value: function optionCheck(props, option) {
      if (!(props in option)) {
        console.error("缺少" + props);
        throw "缺少" + props;
      }
      this[props] = option[props];
    }

    /**
     * 绘制课程表
     * courses = [
     *  {
     *    name:  '', // 课程名,
     *    address: '', // 课程地址,
     *    bg: '#000', //课程背景色,
     *    sessionArr: [1,2,3], // 上课节次
     *    day: 1, // 周几上课
     *  }
     * ]
     * @param {Array} courses 课程表
     */

  }, {
    key: "drawSchedule",
    value: function drawSchedule(courses) {
      var _this2 = this;

      var ctx = this.ctx;
      if (this.title) {
        this.drawTitle();
      }

      // 绘制第一行
      this.drawHeader();
      this.startY += this.header.height;

      // 第一列
      this.drawFirstCol();

      // 获得课程,绘制课程
      courses.forEach(function (course) {
        _this2.drawCourse(course);
      });

      ctx.draw();
    }

    /**
     * 保存临时图片到相册
     * @param {String} path 
     */

  }, {
    key: "saveImage",
    value: function saveImage(path) {
      return new Promise(function (resolve, reject) {
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function success(res) {
            return resolve(res);
          },
          fail: function fail(res) {
            return reject(res);
          }
        });
      });
    }

    /**
     * canvas 转临时图片
     * @return path
     */

  }, {
    key: "canvasToImg",
    value: function canvasToImg() {
      var id = this.id;
      return new Promise(function (resolve, reject) {
        wx.canvasToTempFilePath({
          canvasId: id,
          success: function success(res) {
            return resolve(res.tempFilePath);
          },
          fail: function fail(res) {
            return reject(res);
          }
        });
      });
    }
  }, {
    key: "drawTitle",
    value: function drawTitle() {
      var ctx = this.ctx;
      // 绘制标题
      ctx.setFillStyle(this.header.bg);
      ctx.fillRect(0, 0, this.width, this.titleStyle.height);
      ctx.beginPath();
      ctx.moveTo(0, this.titleStyle.height);
      ctx.lineTo(this.width, this.titleStyle.height);
      ctx.setStrokeStyle(this.header.lineColor);
      ctx.stroke();
      ctx.closePath();
      this.drawText(ctx, this.title, (this.width - this.courseWidth) / 2, this.startY, 20, titleStyle);
      this.startY += this.titleStyle.height;
    }

    /**
     * 绘制背景色
     * @param {String} bg 背景色 
     */

  }, {
    key: "drawBg",
    value: function drawBg() {
      var bg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#f8f8f5";

      this.ctx.rect(0, 0, this.width, this.height);
      this.ctx.setFillStyle(bg);
      this.ctx.fill();
    }

    /**
     * 绘制首行
     */

  }, {
    key: "drawHeader",
    value: function drawHeader() {
      var ctx = this.ctx;
      ctx.setFillStyle(this.header.bg);
      ctx.fillRect(0, this.startY, this.width, this.header.height);
      ctx.setStrokeStyle(this.header.lineColor);
      ctx.setLineWidth(1);
      ctx.setTextAlign("center");
      ctx.setFillStyle(this.header.color);
      ctx.setFontSize(this.header.size);
      for (var i = 0; i < this.days.length; i++) {
        ctx.beginPath();
        ctx.moveTo(this.colHeader.width + i * this.courseWidth, this.startY);
        ctx.lineTo(this.colHeader.width + i * this.courseWidth, this.startY + this.header.height);
        ctx.stroke();
        ctx.closePath();
        ctx.fillText("周" + days[i], this.colHeader.width + this.courseWidth / 2 + i * this.courseWidth, this.startY + (this.header.height + this.header.size) / 2);
      }
    }

    /**
     * 绘制第一列
     */

  }, {
    key: "drawFirstCol",
    value: function drawFirstCol() {
      var ctx = this.ctx;
      ctx.setFillStyle(this.header.bg);
      ctx.fillRect(0, this.startY, this.colHeader.width, this.height);
      ctx.setStrokeStyle(this.header.lineColor);
      ctx.setLineWidth(1);
      ctx.setTextAlign("center");
      ctx.setFillStyle(this.header.color);
      ctx.setFontSize(this.header.size);
      for (var i = 0; i <= this.sessions; i++) {
        ctx.beginPath();
        ctx.moveTo(0, this.courseHeight * i + this.startY);
        ctx.lineTo(this.colHeader.width, this.courseHeight * i + this.startY);
        ctx.stroke();
        ctx.closePath();
        if (i == this.sessions) continue;
        ctx.fillText(i + 1, this.colHeader.width / 2, this.courseHeight * (i + 0.5) + this.startY + this.header.size / 2);
      }
    }
    /**
     * 绘制课程
     * @param {Object} course 课程
     */

  }, {
    key: "drawCourse",
    value: function drawCourse(course) {
      var ctx = this.ctx;
      // 定位
      var x = this.colHeader.width + this.getCourseDayX(course.day) * this.courseWidth;
      var y = (course.sessionArr[0] - 1) * this.courseHeight + this.startY;
      ctx.setFillStyle(course.bg);
      // 绘制背景
      ctx.fillRect(x, y, this.courseWidth, this.courseHeight * course.sessionArr.length);
      // 绘制文字
      y = y + this.courseStyle.top;
      y = this.drawText(ctx, course.name, x, y, 4, this.courseStyle);
      this.drawText(ctx, "@" + course.address, x, y, 4, this.courseStyle);
    }
    /**
     * 获取课程的偏移位置
     * @param {Number} day 周几，1 = 周一 
     */

  }, {
    key: "getCourseDayX",
    value: function getCourseDayX(day) {
      for (var i = 0; i < this.days.length; i++) {
        if (this.days[i] === dayMap[day]) {
          return i;
        }
      }
      throw "课程时间和设置不匹配！";
    }
  }, {
    key: "drawText",
    value: function drawText(ctx, str, x, y, len, style) {
      str = str.trim();
      ctx.setFillStyle(style.color);
      ctx.setTextAlign("center");
      ctx.setFontSize(style.size);
      for (var i = 0; i < str.length / len; i++) {
        y = y + style.size * 1.5;
        ctx.fillText(str.substr(i * len, len), x + this.courseWidth / 2, y);
      }
      return y;
    }
  }, {
    key: "download",
    value: function download(url) {
      return new Promise(function (resolve, reject) {
        wx.downloadFile({
          url: url,
          success: function success(res) {
            if (res.statusCode === 200) {
              resolve(res.tempFilePath);
            } else {
              reject(res);
            }
          },
          fail: function fail(res) {
            return reject(res);
          }
        });
      });
    }
  }, {
    key: "log",
    value: function log() {
      console.log(this.options);
    }
  }]);

  return Schedule;
}();

exports.default = Schedule;
