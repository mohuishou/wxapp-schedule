const days = ["一", "二", "三", "四", "五", "六", "日"];
const dayMap = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "日"
};
const firstColWidth = 25
const header = {
  size: 10,
  height: 50,
  bg: "#f5f5f5",
  color: "#555",
  lineColor: "#d0d0d0"
};
const colHeader = {
  size: 10,
  width: 25,
  bg: "#f5f5f5",
  color: "#555",
  lineColor: "#d0d0d0"
}
const courseStyle = {
  color: "#fff",
  size: 10,
  top: 5
}
// title set
const titleStyle = {
  size: 20,
  height: 50,
  color: "#000",
  bg: "#f5f5f5"
};
/**
 * 微信小程序Canvas课程表，用于展示或者是分享图
 * @class Schdule
 */
export default class Schedule {
  /**
   * 对象初始化
   * @param {Object} options 参数 
   */
  constructor(options) {
    // 必要参数，canvas id，长宽
    ["id", "width", "height"].forEach(e => {
      this.optionCheck(e, options)
    }, this)

    // 不必要参数
    // 日期
    this.days = options.days || days

    // 标题，第一列，第一行样式设置
    this.titleStyle = options.titleStyle || titleStyle
    this.colHeader = options.colHeader || colHeader
    this.header = options.header

    // 课程宽度
    this.courseWidth = options.courseWidth || ((this.width - this.colHeader.width) / this.days.length)
    this.courseHeight = options.courseHeight || ((this.height - this.header.height) / this.days.length)
    // 设置首行文字大小
    if (!('header' in options) || !options.header) {
      this.header = header
      this.header.size = this.courseWidth / 2 - 10
    }
    // 课程样式
    this.courseStyle = options.courseStyle || courseStyle

    // 一天多少节课
    this.sessions = options.sessions || 13

    // 获取canvas对象
    this.ctx = wx.createCanvasContext(this.id);

    // 
    this.startY = 0

    // 
    this.options = options
  }

  /**
   * 参数校验
   * @param {String} props 属性 
   * @param {Object} option 参数
   */
  optionCheck(props, option) {
    if (!(props in option)) {
      throw "缺少" + props
    }
    this[props] = option[props]
  }

  /**
   * 保存临时图片到相册
   * @param {String} path 
   */
  saveImage(path) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: res => resolve(res),
        fail: res => reject(res)
      });
    });
  }

  /**
   * canvas 转临时图片
   */
  canvasToImg() {
    let id = this.id
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvasId: id,
        success: res => resolve(res.tempFilePath),
        fail: res => reject(res)
      });
    });
  }

  /**
   * 绘制背景色
   * @param {String} bg 背景色 
   */
  drawBg(bg = "#f8f8f5") {
    this.ctx.rect(0, 0, this.width, height);
    this.ctx.setFillStyle(bg);
    this.ctx.fill();
  }

  /**
   * 绘制首行
   */
  drawHeader() {
    const ctx = this.ctx
    ctx.setFillStyle(this.header.bg);
    ctx.fillRect(0, this.startY, this.width, this.header.height);
    ctx.setStrokeStyle(this.header.lineColor);
    ctx.setLineWidth(1);
    ctx.setTextAlign("center");
    ctx.setFillStyle(this.header.color);
    ctx.setFontSize(this.header.size);
    for (let i = 0; i < this.days.length; i++) {
      ctx.beginPath();
      ctx.moveTo(this.colHeader.width + i * this.courseWidth, this.startY);
      ctx.lineTo(this.colHeader.width + i * this.courseWidth, this.startY + this.header.height);
      ctx.stroke();
      ctx.closePath();
      ctx.fillText(
        "周" + days[i],
        (this.header.width + this.colHeader.width) / 2 + i * this.courseWidth,
        this.startY + (this.header.height + this.header.size) / 2
      );
    }
  }

  /**
   * 绘制第一列
   */
  drawFirstCol() {
    const ctx = this.ctx
    ctx.setFillStyle(this.header.bg);
    ctx.fillRect(0, this.startY, this.colHeader.width, this.height);
    ctx.setStrokeStyle(this.header.lineColor);
    ctx.setLineWidth(1);
    ctx.setTextAlign("center");
    ctx.setFillStyle(this.header.color);
    ctx.setFontSize(this.header.size);
    for (let i = 0; i <= this.sessions; i++) {
      ctx.beginPath();
      ctx.moveTo(0, this.courseHeight * i + this.startY);
      ctx.lineTo(this.colHeader.width, this.courseHeight * i + this.startY);
      ctx.stroke();
      ctx.closePath();
      if (i == this.sessions) continue;
      ctx.fillText(
        i + 1,
        this.colHeader.width / 2,
        this.courseHeight * (i + 0.5) + this.startY + this.header.size / 2
      );
    }
  }
  /**
   * 绘制课程
   * @param {Object} course 课程
   */
  drawCourse(course) {
    const ctx = this.ctx
    // 定位
    let x = this.colHeader.width + this.getCourseDayX(course.day) * this.courseWidth;
    let y = (course.sessionArr[0] - 1) * this.courseHeight + this.startY;
    ctx.setFillStyle(course.bg_color);
    // 绘制背景
    ctx.fillRect(x, y, this.courseWidth, this.courseHeight * course.sessionArr.length);
    // 绘制文字
    y = y + this.courseStyle.top;
    y = this.drawText(ctx, course.course_name, x, y, 4, this.courseStyle);
    this.drawText(ctx, "@" + course.address, x, y, 4, this.courseStyle);
  }
  /**
   * 获取课程的偏移位置
   * @param {Number} day 周几，1 = 周一 
   */
  getCourseDayX(day) {
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i] === dayMap[day]) {
        return i
      }
    }
    throw "课程时间和设置不匹配！"
  }
  drawText(ctx, str, x, y, len, style) {
    str = str.trim();
    ctx.setFillStyle(style.color);
    ctx.setTextAlign("center");
    ctx.setFontSize(style.size);
    for (let i = 0; i < str.length / len; i++) {
      y = y + style.size * 1.5;
      ctx.fillText(
        str.substr(i * len, len),
        x + this.courseWidth / 2,
        y
      );
    }
    return y;
  }
  download(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            reject(res);
          }
        },
        fail: res => reject(res)
      });
    });
  }

  log() {
    console.log(this.options)
  }
}