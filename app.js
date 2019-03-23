// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

const bodyParser = require('koa-bodyparser');
// 导入controller middleware:
const controller = require('./controller');
let templating = require('./templating');
const isProduction = process.env.NODE_ENV === 'production';

// 创建一个Koa对象表示web app本身:
const app = new Koa();

//1
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

//2
//在生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。而在开发环境下，我们希望koa能顺带处理静态文件
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

//3
//必须再router前注册到app对象
app.use(bodyParser());

//4
//判断当前环境是否是production环境。如果是，就使用缓存，如果不是，就关闭缓存
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

//5
// add router middleware:
app.use(controller());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');