// Copyright 2020. wss authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';

const Router = require('koa-router');
const config = global.config;
const Token = require('./controllers/token');
const Pool = require('./controllers/pool');
const Swap = require('./controllers/swap');
const router = new Router();
router.prefix('/api/' + config.info.API_VERSION);

router
  // 获取币种列表
  .get('/token/currency/list', Token.getTokenList)
  // 获取池子列表
  .get('/pool/poollist', Pool.getPoolList)
   // 获取池子信息
   .get('/pool/details', Pool.getPoolDetails)
  // 获取个人池子币种列表
  .get('/pool/mypool/list', Pool.getMyPoolList)
  // 获取流动池列表
  .get('/pool/myliq/list', Pool.getMyLiq)
  // 创建pool
  .post('/pool/create',Pool.createPool)
  // 创建token
  .post('/pool/createPoolToken',Pool.createPoolToken)
  //更新token
  .post('/pool/updatePoolToken',Pool.updatePoolToken)
  //初始化流动性
  .post('/pool/initLiq',Pool.initLiq)
  //添加流动性
  .post('/pool/joinPool',Pool.joinPool)
  //删除流动性
  .post('/pool/exitPool',Pool.exitPool)
  //删除流动性
  .post('/pool/exitPool',Swap.batchSwapExact)
module.exports = router;
