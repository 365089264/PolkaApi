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
const BigNumber = require('bignumber.js');

/**
 * @function 变更流动性
 * @param  
 * @param  
 * @return {number} 
 * @author  wss
 */
 exports.batchSwapExact= async (swaps,accountId,tokenIn,tokenOut) => {
    var result=false;
    for (let i=0;i<swaps.length;i++){
        result=false;
        let query = queryFormat(`
        insert into tb_pool_swap 
        set  poolID = ?, transferID = ?, tokenIn = ?, amountIn = ?, tokenOut = ? , amountOut= ? , swapVolume = ? , createdAt =  now()`, [swaps[i].poolID, accountId, tokenIn, swaps[i].amountIn,tokenOut, swaps[i].amountOut, swaps[i].swapVolume]);
        await P(pool, 'query', query);
        result=true;
    }
    return result;
 }