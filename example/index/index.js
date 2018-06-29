const app = getApp()
import Schedule from "../schedule.js"
let s
Page({
  data: {},
  save() {
    s.canvasToImg().then(path => {
      s.saveImage(path)
    })
  },
  onLoad: function () {
    s = new Schedule({
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
    console.log('代码片段是一种迷你、可分享的小程序或小游戏项目，可用于分享小程序和小游戏的开发经验、展示组件和 API 的使用、复现开发问题和 Bug 等。可点击以下链接查看代码片段的详细文档：')
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html')
  },
})