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
route(页面触发)-> router.js(路由与组件的映射)找到对应组件-> 路由出口<router-view />渲染找到的组件

#### 2.1、路由配置

- src 目录下新建 router.js 文件
- 导入组件、配置路由与组件的映射关系、创建路由实例并导出
- main.js 文件中注册路由实例

#### 2.2、组件使用路由（根据组件的属性而定）

#### 2.3、获取用户身份（是否登录、是否员工）

es6 语法，单例模式....（需学习“单例”）
CMS 后台管理系统：需要能够判断用户是否登录<有用户信息>，且是员工<is_staff=1>才能访问
前后端分离开发环境是不同的域：比如前端是 localhost:8080，后台是 localhost:5000, 这种属于 ip 不同的跨域

- token 与用户信息都存在 localstore 中, 所以需要将后台登录成功后的 localstore 信息复制到 cms 前端 localstore 中，便于测试

### 3、网络请求

```
cnpm install axios --save
cnpm install qs --save
```

**axios 网络请求库**
_设置基础域名 baseurl, 设置拦截器(将 token 写入请求头)_
**qs 参数序列化和解析库**
_qs.parse()是将 URL 解析成对象的形式_
qs.parse("username='admin'&password='admin'") // Object { username: "admin", password: "admin" }
_qs.stringify()是将对象 序列化成 URL 的形式，以&进行拼接_
qs.stringify({username:'admin', password:'admin'}) //username=admin&password=admin

### 4、轮播图上传

#### 4.1、Element-plus

- el-space 间距组件
  ps: 为子组件添加统一间距

```
<el-space direction="vertical" :size="20" style="width: 100%">
```

- el-dialog 弹框
  ps: el-form 弹出表单对话框，默认不显示，为按钮添加点击事件切换显示
- el-upload 上传组件
  ps: action 属性表示组件发送的请求，并未经过 axios，如果不设置 header-jwt 就不会通过身份验证
  bug: `show-file-list`属性: 是否显示已上传文件列表，如果不设置为 false，影响布局

#### 4.2、后端解决跨域问题

注册跨域解决方案-cors，resources 允许访问的路由，origins 为允许访问的域名

```python
from flask_cors import CORS
cors = CORS()
cors.init_app(app, resources={r"/cmsapi/*": {"origins": "*"}})
```

排除 cmsapi 蓝图的 csrf 的验证

```python
from flask_wtf import CSRFProtect
csrf = CSRFProtect()
csrf.exempt(cmsapi_bp)
```

#### 4.3、axios 请求头问题

新版本 header.common.Authorization ==> header.Authorization

```
config.headers['Authorization'] = 'Bearer ' + token
```

#### 5、轮播图表格

- el-table Table 表格组件
  prop 属性，绑定行字段值，label 属性，显示的页面表头名称
- el-table-column 表格列组件
  对行进行操作--> template 具名插槽模板，可以自定义显示内容

```
<el-table-column fixed="right" label="Operations" width="120">
  <template #default>
      <el-button link type="primary" size="small" @click="handleClick"
        >Detail</el-button>
  </template>
</el-table-column>
```

对行进行操作--> template+scope 具名插槽模板，scope.row.x 可以获取整行的值

```
<el-table-column label="图片">
  <template #default="scope">
    <el-image
      :src="this.$http.server_host + scope.row.image_url"
      style="width: 100px; height: 60px"
    />
  </template>
</el-table-column>
```

#### 5.1、轮播图添加、删除、编辑

**未分页**:列表增(unshift、push)、删(splice)、改(splice)

```
// 新增
let data = res.data
this.banners.unshift(data)  # 列表中添加元素到开头
// 删除
this.deleteIndex = 2
this.banners.splice(this.deleteIndex, 1)  # 列表中删除索引为2的元素
// 编辑
this.editIndex = 2
let data = res.data
this.banners.splice(this.editIndex, 1, data)  # 替换索引为2的元素（先删除后插入）
```

**分页**:列表增、删、改
初步想法：重新请求当前页数据，特别地，删除操作判断当前页是否还有数据，如果没有，则请求前一页数据

#### 5.2、分页

- el-pagination 分页组件
  分页组件居中对齐

```
<div style="display: flex; justify-content: center">
  <el-pagination
    background
    layout="prev, pager, next"
    :total="count"
    :current-page="page"
    @current-change="onPageChange"
  />
</div>
```
