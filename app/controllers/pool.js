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
const Pool = require('../models/pool');
const ERROR_CODE = 1000;


/**
 * @function 获取所有池子信息
 * @author wss
 */
 exports.getPoolList = async(ctx)=>{
    let limit = ctx.query.limit || 10;
    let page = ctx.query.page || 1;
    if (typeof page == 'string') page = parseInt(page);
    if (typeof limit == 'string') limit = parseInt(limit);
    let result=await Pool.getPoolList(0,'',page,limit);
    return ctx.body=new rData(ctx,'GET_POOL_LIST',result);
}

/**
 * @function 获取单个池子信息
 * @author wss
 */
 exports.getPoolDetails = async(ctx)=>{
    let poolID = ctx.query.poolID;
    let result=await Pool.getPoolDetails(poolID);
    return ctx.body=new rData(ctx,'GET_POOL',result.data);
}

/**
 * @function 获取所有代币信息
 * @author wss
 */
 exports.getMyPoolList = async(ctx)=>{
    let  accountId  = ctx.query.accountId;
    let result=await Pool.getPoolList(1,accountId);
    return ctx.body=new rData(ctx,'GET_POOL_LIST',result.list);
}

/**
 * @function 获取所有代币信息
 * @author wss
 */
 exports.getMyLiq = async(ctx)=>{
    let  accountId  = ctx.query.accountId;
    let result=await Pool.getPoolList(2,accountId);
    return ctx.body=new rData(ctx,'GET_POOL_LIST',result.list);
}

/**
 * @function 提交创建池子信息
 * @author wss
 */
 exports.createPool = async(ctx)=>{
    let { poolID, accountID, controllerID, tokenNums,swapFee,finalize,cptAmount,denormal } = ctx.request.body;
    let result=await Pool.createPool(poolID, accountID, controllerID, tokenNums,swapFee,finalize,cptAmount,denormal);
    if (!result) {
        // 提交失败
        //await Pool.Failed(tx_info.trans_id);
        throw new eError(ctx, ERROR_CODE + 7);
      }
    return ctx.body = new rData(ctx, 'CREATE_POOL');
}


/**
 * @function 添加池子代币信息
 * @author wss
 */
 exports.createPoolToken = async(ctx)=>{
    let { tokens ,poolID} = ctx.request.body;
    for (var i = 0; i < tokens.length; i ++) {
        let result=await Pool.createPoolToken(i, tokens[i].address, tokens[i].name, poolID,tokens[i].amounts,tokens[i].weights);
        if (!result) {
            // 提交失败
            //await Pool.Failed(tx_info.trans_id);
            throw new eError(ctx, ERROR_CODE + 7);
        }
    }
    
    return ctx.body = new rData(ctx, 'CREATE_POOLTOKEN');
}

/**
 * @function 修改池子代币信息
 * @author wss
 */
 exports.updatePoolToken = async(ctx)=>{
    let { tokens } = ctx.request.body;
    for (var i = 0; i < tokens.length; i ++) {
        await Pool.updatePoolToken(tokens[i].amount, tokens[i].poolID, tokens[i].tokenAddress);
    }
    return ctx.body = new rData(ctx, 'UPDATE_POOLTOKEN');
}

/**
 * @function 初始化流动性
 * @author wss
 */
 exports.initLiq = async(ctx)=>{
    let { poolID, accountID } = ctx.request.body;
    let result=await Pool.updateLiq(poolID, accountID, 100,0);
    if (!result) {
        // 提交失败
        //await Pool.Failed(tx_info.trans_id);
        throw new eError(ctx, ERROR_CODE + 7);
      }
    return ctx.body = new rData(ctx, 'INIT_LIQ');
}

/**
 * @function 添加流动性
 * @author wss
 */
 exports.joinPool = async(ctx)=>{
    let { poolID, accountID, amount } = ctx.request.body;
    let result=await Pool.updateLiq(poolID, accountID, amount,1);
    if (!result) {
        // 提交失败
        //await Pool.Failed(tx_info.trans_id);
        throw new eError(ctx, ERROR_CODE + 7);
    }
    Pool.updatePoolAmount(poolID, 1, amount)
    return ctx.body = new rData(ctx, 'JOIN_LIQ');
}

/**
 * @function 删除流动性
 * @author wss
 */
 exports.exitPool = async(ctx)=>{
    let { poolID, accountID, amount } = ctx.request.body;
    let result=await Pool.updateLiq(poolID, accountID, amount,-1);
    if (!result) {
        // 提交失败
        //await Pool.Failed(tx_info.trans_id);
        throw new eError(ctx, ERROR_CODE + 7);
    }
    Pool.updatePoolAmount(poolID, -1, amount)
    return ctx.body = new rData(ctx, 'EXIT_LIQ');
}

