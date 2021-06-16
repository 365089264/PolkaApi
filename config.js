'use strict';

exports.info = {
  DIR: __dirname,
  APP_NAME: 'service_user',
  APP_DIR: __dirname + '/app/',
  LOG_DIR: __dirname + '/log/',
  ENV: "dev",
  PORT: 5001,
  API_VERSION: 'v1',
  FIXED: 8
};

// 数据库配置
exports.mysql = {
  host: '8.210.86.149',
  user: 'test',
  password: 'Welcome_1',  
  database: 'plasmnet',
  port: 3306
};


