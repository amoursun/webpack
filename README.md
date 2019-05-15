# webpack
webpack dev prod 学习

## 特点

- webpack 一个适用于真实项目开发配置
- Router 做了基本权限处理，跳转，以及一个更好的组织项目模块的路由配置函数
- mobx 处理数据流，简单易用
- axios 基于模块组织 api 接口
- 基于路由和组件的按需加载模块
- 业务场景模块抽离

## 文件目录

```
├── node_modules:                   模块文件夹
|   └── ...
├── _mocker_:                       mock接口数据
├── build:                          webpack配置文件
|   ├── env:                        环境变量配置
|   ├── index:                      调用webpack入口文件
|   ├── webpack.base.config:        webpack通用配置
|   ├── webpack.dev.config:         webpack开发配置
|   ├── webpack.dll.config:         webpack公共依赖库打包
|   └── webpack.prod.config:        webpack生产配置
├── dest:                           打包生成目录
├── src:                            开发目录
|   ├── api:                        API配置，axios封装
|   ├── components:                 公共组件
|   ├── layouts:                    布局组件
|   ├── routes:                     项目路由
|   ├── module:                     模块文件
|   ├── node_modules:               公共资源文件
|   ├── store:                      mobx store文件
|   ├── App.js:                     初始入口文件
|   ├── index.js:                   入口文件
|   └── style.min.less:             样式
├── .babelrc                        babel配置文件
├── .editorconfig                   不通操作系统编码格式统一
├── .eslintignore                   eslint忽略
├── .eslintrc.json                  eslint
├── .gitignore                      git忽略文件
├── package.json                    项目依赖 npm
├── postcss.config.js               postcss 插件配置
└── README.MD                       项目信息
```

## 技术栈

- react 16.8.x
- react-dom
- react-router-dom 5.xx
- react-loadable
- mobx 数据流
- webpack 4.xx
- axios 异步请求
- antd ui
- mock 模拟接口数据
- echarts

## 开发环境

- git clone https://github.com/ganyanlins/webpack.git
- npm i -dd
- npm run build:dll
- npm run dev

## 生产环境

- npm run build
