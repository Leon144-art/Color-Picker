# Color Analyser

一款轻量级、无依赖的网页颜色工具，集成专业显示器测试功能。提供交互式 HSV/HSL 色轮、实时色彩显示、一键复制，以及完整的显示器校准测试套件（黑位/白位、灰阶、几何、锐度、均匀性等），可用于色彩设计和显示器调校。基于纯静态文件构建，可直接在本地打开或部署到任意服务器。

## 开发说明

本项目使用AI工具辅助开发，包括：
- **GitHub Copilot** - 代码生成和自动补全
- **GPT Code X** - 代码优化和调试
- 所有代码均经过人工审核和测试，但可能仍存在少量问题。

## 功能特性

### 🎨 Color Picker（颜色选择器）
- 原生颜色选择器，自动保存上次选择的颜色
- 交互式画布色轮
  - **HSV 模式**：角度控制色相，半径控制饱和度，滑块调节明度
  - **HSL 模式**：角度控制色相，半径控制饱和度，滑块调节亮度
- 多格式实时显示：HEX、RGB、HSV/HSL
- 一键复制到剪贴板（支持降级处理）
- 可选壁纸背景，支持缓存和模糊/叠加效果调节

### 🖥️ Monitor Test（显示器测试）
- **Solid Color Tests（纯色测试）**：基础 RGB/CMY + 黑白色块，支持自定义颜色
**在线访问**
- https://leon144-art.github.io/Color-Analyser/
  - White Saturation - 白位饱和度（235-255 高光细节）
  - 32-Step Grayscale - 32 阶灰阶测试
  - Grayscale/RGB Gradients - 色带检测
- **Geometry & Sharpness（几何与锐度）**：
  - Sharpness & Pixel Grid - 像素级棋盘锐度测试
  - Geometry & Circles - 几何变形检测（网格 + 正圆）
  - Color Bars (SMPTE) - 标准 SMPTE 75% 彩条
  - Uniformity (50% Gray) - 均匀性测试（脏屏/漏光检测）
  - Dead Pixel Check - 坏点检测（点击切换 5 种颜色）
- 全屏测试模式，支持 ESC 快速退出
- 悬停提示显示每个测试的用途和最佳实践

### ⚙️ 技术特性
- 零配置使用，纯前端实现（HTML/CSS/ES6 模块）
- 组件化架构，模板驱动渲染
- 无外部依赖，适合离线使用

## 快速开始

**在线访问**
- https://leon144-art.github.io/Color-Picker/

**本地使用**
- 直接在现代浏览器中打开 `index.html`

**本地服务器**
- 使用Python启动：`python3 -m http.server 8080`，然后访问 `http://localhost:8080/`

**使用说明**

*Color Picker 模式*
- 通过色轮或原生选择器调整颜色，色彩预览和数值会实时更新
- 应用会自动记住上次选择的颜色
- 点击 RGB 数值即可一键复制

*Monitor Test 模式*
- 点击测试卡片进入全屏测试模式
- 悬停卡片查看测试说明和最佳实践
- Dead Pixel Check 测试中点击屏幕切换颜色
- 按 ESC 键退出任意测试

## 壁纸背景配置

在 `js/app.js` 中可以自定义壁纸设置：

```javascript
import { initWallpaper } from './components/wallpaper.js';
const wallpaper = initWallpaper(document.body, {
  enabled: true,        // 启用壁纸
  ttlHours: 24,        // 缓存时间（小时）
  blur: 7,             // 模糊程度

## 浏览器兼容性

需要支持 ES6 模块的现代浏览器（Chrome 61+, Firefox 60+, Safari 11+, Edge 16+）。如果直接从文件系统打开时遇到模块导入错误，请使用本地服务器运行。
// 动态控制示例
// wallpaper.setEnabled(false);           // 禁用壁纸
// wallpaper.refresh();                   // 刷新壁纸
// wallpaper.setOptions({ blur: 5 });     // 调整模糊度
```

## 浏览器兼容性

需要支持ES模块的现代浏览器。如果直接从文件系统打开时遇到模块导入错误，请使用本地服务器运行。

## LICENSE

MIT — 请参阅`LICENSE`。
