# ****************************************************************
# Copyright 2022. wss authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# *****************************************************************

#池子创建记录
drop table if exists `tb_pool_history`;
CREATE  TABLE `tb_pool_history` (
    id                  int(10) PRIMARY KEY AUTO_INCREMENT                  comment '自增ID, 主键',
    poolID              varchar(60) NOT NULL                                comment '池子ID',
    accountID           varchar(60) NOT NULL                                comment '创建账号',
    controllerID        varchar(60) NOT NULL                                comment '池子所有权的账号',
    tokenNums           int(10) NOT NULL                                    comment '代币种类数量',
    swapFee             bigint(20) NOT NULL                                 comment '交易费',
    finalize            tinyint(1) NOT NULL DEFAULT 0                       comment '是否创建成功 0-创建中 1-创建成功',
    cptAmount           int(10) NOT NULL                                    comment '总流动性cpt的数量',
    denormal            bigint(20) NOT NULL                                 comment '代币权重',
    createdAt           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP        comment '申请创建时间'

)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#池子代币列表
drop table if exists `tb_pool_token`;
CREATE  TABLE `tb_pool_token` (
    id                  int(10) PRIMARY KEY AUTO_INCREMENT                  comment '自增ID, 主键',
    tokenIndex          int(10) NOT NULL                                    comment '代币索引号',
    tokenAddress        varchar(60) NOT NULL                                comment '代币地址',
    tokenName           varchar(10) NOT NULL                                comment '代币名称',
    poolID              varchar(60) NOT NULL                                comment '池子ID',
    amount              bigint(20) NOT NULL                                 comment '代币数量',
    denormal            bigint(20) NOT NULL                                 comment '代币权重',
    createdAt           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP        comment '创建时间'
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#池子流动性详情
drop table if exists `tb_liquidity`;
CREATE  TABLE `tb_liquidity` (
    id                  int(10) PRIMARY KEY AUTO_INCREMENT                  comment '自增ID, 主键',
    poolID              varchar(60) NOT NULL                                comment '池子ID',
    accountID           varchar(60) NOT NULL                                comment '用户账号',
    amount              bigint(20) NOT NULL                                 comment 'cpt数量',
    addType             tinyint(1) NOT NULL DEFAULT 0                       comment '0-初始化流动性 1-添加流动性  -1-删除流动性',
    createdAt           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP        comment '创建时间'
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#池子兑换详情
drop table if exists `tb_pool_swap`;
CREATE  TABLE `tb_pool_swap` (
    id                  int(10) PRIMARY KEY AUTO_INCREMENT                  comment '自增ID, 主键',
    poolID              varchar(60) NOT NULL                                comment '池子ID',
    transferID          varchar(60) NOT NULL                                comment '交易账号',
    tokenIn             varchar(60) NOT NULL                                comment '添加的代币',
    amountIn            bigint(20) NOT NULL                                 comment '添加数量',
    tokenOut            varchar(60) NOT NULL                                comment '取走的代币',
    amountOut           bigint(20) NOT NULL                                 comment '取走数量',
    swapVolume          decimal(20,10)  NOT NULL                            comment '交易费用',
    createdAt           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP        comment '创建时间'
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


#代币对应usd价格
drop table if exists `tb_tokenPrice`;
CREATE  TABLE `tb_tokenPrice` (
    id                  int(10) PRIMARY KEY AUTO_INCREMENT                  comment '自增ID, 主键',
    tokenAddress        varchar(60) NOT NULL                                comment '代币地址',
    tokenName           varchar(10) NOT NULL                                comment '代币名称',
    symbol              varchar(10) NOT NULL                                comment '代币简称',
    price               decimal(20,10)  NOT NULL                            comment '代币的usd价值',
    color               varchar(10) NOT NULL                                comment '颜色',
    createdAt           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP        comment '创建时间'
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
