// Copyright 2021. wss authors.
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

const config = global.config;
const P = require(global.config.info.DIR + '/utils/promise').P;
const logger = require(global.config.info.DIR + '/utils/logger').logger;
const dbhelper = require(global.config.info.DIR + '/utils/dbhelper');
const pool = dbhelper.pool;
const queryFormat = dbhelper.queryFormat;


/**
 * @function 查询代币详情
 * @returns {array} [{
 *              tokenAddress:  // 代币地址
 *              tokenName:     // 代币名称
 *              price:         // usd价格
 *            }]
 * @author  wss
 */
 exports.getTokenList= async () => {
    let query = queryFormat('select tokenAddress as address,tokenName as name ,price,symbol,decimals,precisions as \'precision\',color,hasIcon,logoURL from tb_tokenPrice order by createdAt desc', []);
    let data= await P(pool, 'query', query);
    return {
        data: data.length ? data : []
    }
  }