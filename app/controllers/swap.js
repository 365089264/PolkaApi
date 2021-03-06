// Copyright 2018. box.la authors.
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
const eError = require(global.config.info.DIR + '/utils/error');
const logger = require(global.config.info.DIR + '/utils/logger').logger;
const rData = require(global.config.info.DIR + '/utils/rdata');
const Swap = require('../models/swap');
const ERROR_CODE = 1000;

/**
 * @function 交易
 * @author wss
 */
 exports.batchSwapExact = async(ctx)=>{
    let { swaps,tokenIn,tokenOut } = ctx.request.body;
    let result=await Swap.batchSwapExact(swaps,tokenIn,tokenOut );
    if (!result) {
        // 提交失败
        throw new eError(ctx, ERROR_CODE + 7);
    }
    return ctx.body = new rData(ctx, 'BatchSwapExact');
}