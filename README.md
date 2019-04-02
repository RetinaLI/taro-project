# 车联网平台微信小程序
>Taro + Taro UI

## 开始步骤

### 1. 安装 taro
本项目基于taro开发，[参考这里](https://taro.aotu.io/)
```bash
npm install -g @tarojs/cli
```

### 2. 安装开发依赖
```bash
npm install
```

### 3. 编译源代码
```bash
  + 小程序编译：npm run build:weapp -- --watch
  + H5编译：npm run build:h5 -- --watch
```

### 4.导入至开发者工具

编译完成后会生成`dist`目录，开发者工具本地开发目录指向`dist`目录。

  + 小程序编译会生成`dist`目录
  + H5编译会生成`h5-dist`目录
  + H5打包会生成`h5-build-dist`目录

**切记： 取消勾选`项目-->开启ES6转ES5`，否则代码运行报错。**

### 5. Taro更新
```bash
  + 更新Taro cli工具： i -g @tarojs/cli@latest
  + 更新项目中 Taro 相关的依赖： taro update project
```


### 6.百度坐标转腾讯-谷歌-高德插件: gcoord——[GitHub参考文档](https://github.com/hujiulong/gcoord)
###### 地理坐标系转换工具，支持WGS84/GCJ02/BD09等常用坐标系互转
**用法:**
+ 百度地图采用的经纬度坐标BD09;
+ google中国地图、soso地图、aliyun地图、mapabc地图、腾讯和高德地图GCJ02;

  ```
    + 导入
    import gcoord from 'gcoord';
    + 用法
    let result = gcoord.transform(
      [longitude, latitude],  // 坐标[经度, 纬度]两个位置不可变
      gcoord.BD09,            // 当前坐标系（百度）
      gcoord.GCJ02            // 目标坐标（腾讯）
    );
  ```
## 注意事项

### 1. 缩紧为两个空格。切记 切记
### 2. 请求后台禁止直接使用`Taro.request`或`ajaxProvider.request`，必须封装进一个service才可使用
### 3. 能单独构成一个独立的模块，就抽取成组件存在
### 4. 图片等静态资源需要import引用才能使用
### 5. 重新渲染组件用this.setState(),不能直接使用this.state.carId