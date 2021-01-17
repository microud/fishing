# Fishing

Fishing 是一个使用装饰器来实现 HTTP API 请求封装的库，基于 `axios` 实现，兼容浏览器端与 Node 端。

在这里，网络请求像钓鱼一样，通过装饰器表明鱼儿的样子，便能得到自己想要的了。

## Features

- [x] 使用装饰器进行定义
- [x] 支持文件上传
- [ ] 统一配置 axios 实例

## Installation

```bash
# use npm
npm i -S fishing-request
# or use yarn
yarn add fishing-request
```

## Usage

### Decorator

#### @FishPond()

FishPond() 是一个属性装饰器，顾名思义，这是你即将使用的「鱼塘」，它用于指明类中的某个属性的值（string 类型）为整个类中请求的 Base URL。

```typescript
class DemoRequest {
  @FishPond()
  base: string;
}
```

此装饰器可以省略，如果不提供鱼塘，那么每次请求便依赖 URL 完整了。

#### FishRequest(config: AxiosRequestConfig)

`FishRequest()` 是一个方法装饰器，是最基础的请求方法。传入平时习惯使用的 axios 请求参数即可。

```typescript
class DemoRequest {
  @FishPond()
  base = 'http://127.0.0.1';

  @FishRequest({ url: '/basic' })
  async basicRequest(): Promise<AxiosResponse> { return; }
}
```

##### 请求参数

**FishHeaders()**

使用 `FishHeaders()` 标记的参数，会被作为此次请求的 Header，如果是上传文件的请求，则会将该对象与 FormData 的请求头进行合并。

**FishParams**

使用 `FishParams()` 标记的参数，会对 URL 进行处理，替换掉对应的占位符：

```typescript
import { FishRequest } from './decorators';

class DemoRequest {
  @FishRequest({ url: 'http://127.0.0.1/user/:id' })
  async paramRequest(@FishParams() param: { id: string }): Promise<AxiosResponse> { return; }
}
```

**FishQuery()**

使用 `FishQuery()` 标记的参数会处理为 axios 的 `params`，也就是一次 HTTP 请求中的 QueryString。

**FishBody(contentType: string)**

`FishBody()` 中的参数会被作为请求中的请求体，它的参数用于决定此次请求的 `Content-Type`，目前支持的值有：

- text 
- json 请求头为 `application/json`，且将参数对象转为 JSON 字符串
- form：以 `FormData` 的形式发送请求，也可以用于上传文件

**FishResponse(dataType: string)**

在使用时可以通过 `FishResponse()` 标记参数并将相应数据进行处理，以返回处理过的响应数据。如果不进行标记，则返回值为原始的 axios 响应对象。

```typescript
class DemoRequest {
  async getMethod(@FishResponse() response: AxiosResponse<any>): Promise<string> {
    return response.data.msg;
  }
}
```

与 `FishBody()` 类似的，`FishResponse()` 也支持通过不同的参数返回不同的数据类型。

#### FishGet()

`FishGet()` 是对 `FishRequest()` GET 方法的封装，旨在简化方法的定义，它支持两种形式的重载：

- FishGet(url: string, config: AxiosRequestConfig)
- FishGet(config: AxiosRequestConfig)

除此之外，使用装饰器定义参数等与 `FishRequest()` 完全一致。

更多的使用用例，可以查看 `test/` 目录下的测试 Demo。
