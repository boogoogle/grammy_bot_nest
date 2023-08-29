## Note
1. 测试用的Alchemy账号是私人的，如果需要看log，请更换为自己的
2. 数据库使用 sqlite， 插入、查询会有妥协
3. 代码结构为初学者水平，没什么特殊设计，不要多想。。。


```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

### Before test

run local Ethereum Node

```bash
$ npm run hre

```

```bash
# unit tests
$ pnpm run test

# e2e tests 没写
$ pnpm run test:e2e

# test coverage 没写
$ pnpm run test:cov
```
