# wxapp-schedule 小程序课程表组件

wxapp-schedule 是从[We川大](https://github.com/mohuishou/scuplus-wechat)当中抽象出来的课程表图片生成组件，使用canvas绘制

**如果有点帮助的话，别忘了点个star**

## Example 
- example文件夹 [example](example)
- 直接点击打开代码片段  [wechatide://minicode/3FFtexmB7qFW](wechatide://minicode/3FFtexmB7qFW)

# install
直接复制dist文件夹的`schedule.js`到相应使用位置

# use
```javascript
let s = new Schedule({
    id: "schedule",
    width: 375,
    height: 1000,
    title: "测试课程表"
})
s.drawBg()
s.drawSchedule([{
    day: 1,
    sessionArr: [1, 2, 3],
    address: "lalalal",
    name: "测试课程",
    bg: "#f07c82"
}])
```

## option
```javascript
{
    id: "", //必选 canvas id
    width: 0, //必选 canvas width
    height: 0, //必选 canvas height
    title: "", // 可选，课程表标题
    titleStyle: { // 可选，标题样式
        size: 20, // 字体大小
        height: 50, // 高度
        color: "#000", // 字体颜色
        bg: "#f5f5f5" // 背景颜色
    },
    days: ["一", "二", "三", "四", "五", "六", "日"], // 可选，一周时间安排，适应不同学校
    colHeader: { // 可选，第一列样式
        size: 10, // 字体大小
        width: 25, // 宽度
        bg: "#f5f5f5", // 背景色
        color: "#555", // 字体颜色
        lineColor: "#d0d0d0" // 间隔线颜色
    },
    header: { // 可选，第一行样式
        size: 10, // 字体大小
        height: 50, // 高度
        bg: "#f5f5f5", // 背景色
        color: "#555", // 字体颜色
        lineColor: "#d0d0d0" // 间隔线颜色
    },
    sessions: 13, // 可选，一天多少节课，
    courseWidth: , // 可选，每节课宽度，默认自适应
    courseHeight: , // 可选，每节课高度，默认自适应
    courseStyle: { // 可选，课程样式
        color: "#fff", // 字体颜色
        size: 10, // 自已大小
        top: 5 // padding top
    },
}
```

## api
```javascript
/**
 * 绘制背景色
 * @param {String} bg 背景色 
 */
drawBg(bg = "#f8f8f5")

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
drawSchedule(courses)

/**
 * 保存临时图片到相册
 * @param {String} path 图片地址
 */
saveImage(path)

/**
 * canvas 转临时图片
 * @return path
 */
canvasToImg()
``` 

# preview
![](./img/example.png)