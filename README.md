# ZLBBS-CMS

## 一、准备工作

### 1、技术架构

flask+vue3

### 2、创建项目

#### 2.1、安装 nvm 工具，管理 node 版本

```
# 安装16.13.0版本的的node.js
nvm install 16.13.0
# 查看所有node版本
nvm list
# 切换npm版本
nvm use 16.13.0
# 如果node安装包很慢，需要设置一下cnpm淘宝源，以后用cnpm代替npm
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

#### 2.2、npm 安装 vue-cli，并使用 vue-cli 创建 vue3 项目

```
# 全局安装vue-cli，所有同node版本的项目均可使用
cnpm install -g @vue/cli
# 用命令行在当前目录创建项目
vue create [项目名称]
# 创建一个`package.json`文件用来保存项目中用到的包（创建vue项目时自动创建）
# cnpm init
```

#### 2.3、启动 vue3 服务

```
cnpm run serve
```

VUE BUG 提醒:`注意无法使用cnpm安装element-plus，需用npm`
导致报错：Cannot read properties of null (reading ‘isCE‘)

```
# cnpm install xx
cnpm install element-plus --save
```

### 3、git 版本管理

```
# 切换到项目目录，初始化本地仓库
cd zlbbs-cms
# 初始化本地仓库，并创建远程仓库连接
git init
git remote add <远程主机名，一般为origin> <远程仓库地址>
# 创建并切换分支，如果本地还没有分支，提交之后自动创建master分支
git checkout -b <分支名>
git add .
# 提交版本到本地，提交之后才能`git branch`查询分支
git commit -m "创建项目xxx"
git push <远程主机名> <本地分支名>:[远程分支名，可省略默认远程与本地分支名相同]
```

### 4、VScode 简单配置 Eslint + Prettier

`所有步骤完成后重启VScode`

#### 4.1、VScode 安装`ESLint`与`Prettier-CodeFormatter`插件

#### 4.2、npm 安装 eslint

```
cnpm install eslint-plugin-vue --save-dev
# 如果报错可补充安装
# cnmp install eslint --save-dev
```

#### 4.3、创建`.eslintrc.js`文件，配置规则

```
module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  rules: {
    // 解决prettier与eslint规则冲突
    indent: 0,
    'space-before-function-paren': 0,
    // 关闭组件命名规则
    'vue/multi-word-component-names': 'off'
  }
}
```

#### 4.4、创建`.prettierrc`文件，配置规则

```
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none"
}
```

### 5、安装 ElementPlus

```
# 安装到生产依赖（--save 线上）
cnpm install element-plus --save
# 采用完全引入方式
# main.js导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
```

## 二、项目编写

### 1、整体页面构造

Element-plus

- Container 布局容器：搭建页面基本结构
- Navigation 导航->Menu 菜单导航组件->Icon 图标组件
  备注：element-plus Icon 图标不够用的时候，使用阿里“icontfont”[font-class 或 symbol 方式引用]

### 2、路由

Vue Router

#### 2.1、路由配置

- src 目录下新建 router.js 文件
- 导入组件、配置路由与组件的映射关系、创建路由实例并导出
- main.js 文件中注册路由实例

#### 2.2、组件使用路由（根据组件的属性而定）
