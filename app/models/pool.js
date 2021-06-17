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

const denormalBase=new BigNumber(Math.pow(10,10));
const feeBase=new BigNumber(Math.pow(10,6));
const cptBase=new BigNumber(Math.pow(10,10));

/**
 * @function 查询池子列表
 * @param  {number} page         // 分页
 * @param  {number} limit
 * @returns {array} [{}]
 * @author  wss
 */
 exports.getPoolList= async (queryType, accountId,page=1, limit=10) => {
    let query = '';
    let query_count='';
    if (queryType==0){
        let start = (page - 1) * limit;
        let end = limit;
        query_count=queryFormat('select count(*) as count from tb_pool_history limit ?, ?',[start,end]);
        query=queryFormat('select poolID,controllerID,tokenNums,swapFee,cptAmount,denormal from tb_pool_history order by createdAt desc  limit ?, ?', [start,end]);
    }
    else if (queryType==1){
        query = queryFormat('select poolID,controllerID,tokenNums,swapFee,cptAmount,denormal from tb_pool_history where controllerID = ? order by createdAt desc', [accountId]);
    }
    else if (queryType==2){
        query = queryFormat('select poolID,controllerID,tokenNums,swapFee,cptAmount,denormal from tb_pool_history where controllerID <> ? and poolID in (select poolID from tb_liquidity where accountID= ? ) order by createdAt desc', [accountId,accountId]);
    }
    let result= await P(pool, 'query', query);
    console.log(result)
    for (let i=0;i<result.length;i++){
        let r={
            id:result[i].poolID,
            poolAddress:result[i].poolID,
            controller:result[i].controllerID,
            swapFee:result[i].swapFee,
            swaps:[],
            tokens:[],
            tokensList:[],
            totalShares:result[i].cptAmount,
            totalWeight:result[i].denormal,
            finalized: true,
            crp: false,
            publicSwap: true,


        };
        let totalDenormal=new BigNumber(result[i].denormal);
        
        query=queryFormat('select tokenAddress ,tokenName , poolID ,amount ,denormal from tb_pool_token where poolID=? order by tokenIndex',r.id);
        let tokens=await P(pool,'query',query);
        for (let c of tokens){
            let denormal=new BigNumber(c.denormal);
            r.tokens.push({
                id: r.poolID,
                address: c.tokenAddress,
                balance: c.amount,
                decimals: 10,
                denormWeight: denormal,
                num:denormal.multipliedBy(100).dividedToIntegerBy(totalDenormal)
            });
            r.tokensList.push(c.tokenAddress)
        }

        query=queryFormat('select count(1) as count,sum(swapVolume) as totalSwapVolume from tb_pool_swap where poolID=? ',r.id);
        let swapsTotal=await P(pool,'query',query);
        r.swapsCount=swapsTotal[0].count;
        r.swaps.push({poolTotalSwapVolume:swapsTotal[0].totalSwapVolume});
        r.totalSwapVolume=swapsTotal[0].totalSwapVolume;

        query=queryFormat('select count(distinct accountID) as count from tb_liquidity where poolID=? ',r.id);
        let holders=await P(pool,'query',query);
        r.holdersCount=holders[0].count;

        query=queryFormat('select count(1) as count from tb_pool_swap where poolID=? ',r.id);

        result[i]=r;
    }
    if (queryType==0){
        let data_count = await P(pool, 'query', query_count);
        return {
            count: data_count[0].count,
            total_pages: Math.ceil(data_count[0].count / limit),
            current_page: page,
            list: result
        };

    }
    return {
        list: result.length ? result : []
    }
}

/**
 * @function 创建pool
 * @param {string} poolID  // 池子地址
 * @param {string} accountID  // 创建账号地址
 * @param {string} controllerID  // 权限控制账号地址
 * @param {number} tokenNums  // 代币数量
 * @param {number} swapFee  // 交易费
 * @param {string} finalize  // 池子创建结果 1：成功 ，0：创建中
 * @param {number} cptAmount  // 当前池子的cpt数量
 * @param {number} denormal  // 总权重
 * @return {number} // 创建成功的主键ID
 * @author  wss
 */
 exports.createPool= async (poolID, accountID, controllerID, tokenNums,swapFee,finalize,cptAmount,denormal) => {
     console.log(swapFee.replace(/,/g,''))
    let query = queryFormat(`
    insert into tb_pool_history 
    set  poolID = ?, accountID = ?, controllerID = ?, tokenNums = ?, swapFee = ?, finalize = ?, cptAmount = ?, denormal = ?`
    , [poolID, accountID, controllerID, tokenNums,(new BigNumber(swapFee.replace(/,/g,''))).dividedBy(feeBase).toString(),finalize,(new BigNumber(cptAmount.replace(/,/g,''))).dividedBy(cptBase).toString(),(new BigNumber(denormal.replace(/,/g,''))).dividedBy(denormalBase).toString()]);
    let result = await P(pool, 'query', query);
    return result.insertId
 }

 /**
 * @function 创建pool_token
 * @param  {number} tokenIndex //代币索引
 * @param  {string} tokenAddress  //代币地址
 * @param  {string} tokenName  //代币简称
 * @param {string} poolID  // 池子地址
 * @param {number} amount  // 代币数量
 * @param {number} denormal  // 代币权重
 * @return {number} 
 * @author  wss
 */
  exports.createPoolToken= async (tokenIndex, tokenAddress, tokenName, poolID,amount,denormal) => {
    let query = queryFormat(`
    insert into tb_pool_token 
    set  tokenIndex = ?, tokenAddress = ?, tokenName = ?, poolID = ?, amount = ?, denormal = ?, createdAt =  now()`, [tokenIndex, tokenAddress, tokenName, poolID,amount,denormal]);
    let result = await P(pool, 'query', query);
    return result.insertId
 }


/**
 * @function 更新pool_token
 * @param  
 * @param  
 * @return {number} 
 * @author  wss
 */
   exports.updatePoolToken= async (amount, poolID, tokenAddress) => {
    let query = queryFormat(`
    update tb_pool_token 
    set  amount = ? where poolID = ? and tokenAddress = ?`, [amount, poolID, tokenAddress]);
    await P(pool, 'query', query);
 }

/**
 * @function 变更流动性
 * @param  
 * @param  
 * @return {number} 
 * @author  wss
 */
   exports.updateLiq= async (poolID, accountID, amount, addType) => {
    let query = queryFormat(`
    insert into tb_liquidity 
    set  poolID = ?, accountID = ?, amount = ?, addType = ?,  createdAt =  now()`, [poolID, accountID, amount, addType]);
    let result = await P(pool, 'query', query);
    return result.insertId
 }

 /**
 * @function 更新pool的cpt数量
 * @param  
 * @param  
 * @return {number} 
 * @author  wss
 */
  exports.updatePoolAmount= async (poolID, addType, amount) => {
    let query = queryFormat(`
    update tb_pool_history 
    set  cptAmount = cptAmount `+(addType==1?`+`:`-`)+` ? where poolID = ?`, [ amount, poolID]);
    console.log(query);
    await P(pool, 'query', query);
 }
