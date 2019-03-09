# FCM即时消息接入注意事项
1. 消息分为：通知消息和数据消息，共两种
2. fcm需要基于service worker，所以网站需要支持https，本地开发localhost除外
3. 监控令牌的刷新更换（网页应用删除令牌或用户删除浏览器缓存时会导致令牌丢失）
4. 令牌更换时，及时请求后台api，进行令牌更换设置，避免令牌更换无法接收消息

## 消息格式说明
> 通知消息格式
```angular2html
{
  "from": "958747888222",
  "priority": "normal",
  "notification": {
    "title": "更新提醒",
    "body": "应用更新了"
  }
}
```
> 数据消息格式
```angular2html
{
  "data": {
    "body": "应用更新了",
    "title": "更新提醒",
    "type": "301"
  },
  "from": "958747888222",
  "priority": "normal"
}
```
> 消息格式注意：如何区分通知消息还是数据消息？依据是，数据中包含notification
字段的数据被认为是通知消息，不包含notification字段的数据被认为是数据消息，依照欧本富
系统而言，不管是通知消息还是数据消息都会包含一个title和body

## 商家端、平台端消息类型说明


