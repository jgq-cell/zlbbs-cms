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

### 4、安装 ElementPlus

```
# 安装到生产依赖（--save 线上）
cnpm install element-plus --save
# 采用完全引入方式
# main.js导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
```

### 四、项目编写
