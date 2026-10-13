# 春日列车 · SAKURA RAIL

纯静态的樱花铁路微缩展厅。HTML、CSS、JavaScript 和 Three.js 全部随文件提供，无需后端、数据库、API 密钥、npm 安装或构建。所有资源使用相对路径，支持 GitHub Pages 的仓库子路径。

## 部署到 GitHub Pages

1. 新建一个 GitHub 仓库，把本目录中的所有文件上传到仓库根目录。根目录应直接包含 `index.html`，不要再套一层 `sakura-rail` 文件夹，也不要只上传 ZIP。
2. 进入仓库 **Settings → Pages**。
3. 在 **Build and deployment → Source** 选择 **Deploy from a branch**。
4. 选择你上传文件的分支（通常为 `main`），目录选择 **/ (root)**，点击 **Save**。
5. 等部署完成后，打开 Pages 页面显示的地址，通常为 `https://你的用户名.github.io/仓库名/`。

`.nojekyll` 用于直接发布静态文件。请一并上传；如果网页上传工具未显示它，可以在 GitHub 仓库中单独创建这个空文件。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 文件

- `index.html`：页面入口，支持直接双击打开，也支持 GitHub Pages。
- `app.bundle.js`：已打包的浏览器脚本，包含 Three.js 和全部场景代码，页面实际加载此文件。
- `sakura.css`：透明毛玻璃界面、响应式布局、夜间样式。
- `main.js`：相机、控制按钮、昼夜切换与动画循环。
- `scene.js`：卡通材质、樱花树、轨道和车站。
- `train.js`：机车、车厢、车轮和蒸汽。
- `particles.js`：飘落花瓣与地面落花。
- `vendor/`：本地 Three.js 及 OrbitControls。

## 操作与本地预览

拖动旋转、滚轮缩放；手机支持单指旋转、双指缩放。出发按钮控制列车，☀ / ☾ 切换光景，✿ 控制花瓣。空格出发或暂停，R 复位，N 切换昼夜。

完整解压后直接双击 `index.html` 即可本地运行，无需启动服务器。浏览器加载的是预先打包的普通脚本，不再依赖 `file://` 下会被拦截的模块导入。也可以通过任意静态 HTTP 服务器预览，或部署到 GitHub Pages。

`main.js`、`scene.js`、`train.js`、`particles.js` 和 `vendor/` 保留为可编辑源码。修改这些源码后，需要重新生成 `app.bundle.js` 才会在页面生效；只使用或部署本包不需要任何构建步骤。

需要支持 WebGL 的现代浏览器。Three.js 0.170.0 使用 MIT 许可证，见 `vendor/LICENSE.three.txt`。场景与界面为原创代码，无游戏原始素材。
