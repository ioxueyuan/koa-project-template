//自动创建出表结构
const model = require('./model.js');
model.sync();

console.log('init db ok.');
// process.exit(0);