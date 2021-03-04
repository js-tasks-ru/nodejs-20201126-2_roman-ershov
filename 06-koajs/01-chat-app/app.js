const path = require('path');
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

const router = new Router();

router.get('/subscribe', async (ctx, next) => {
   const message = await new Promise( (resolve) => {
      ctx.app.on('publish', (message) => {
         if (message) {
            resolve(message);
         }
      });
   });

   ctx.res.statusCode = 200;
   ctx.res.end(message);
});

router.post('/publish', async (ctx, next) => {
   ctx.app.emit('publish', ctx.request.body.message);
   ctx.res.statusCode = 200;
   ctx.res.end('ok');
});

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());
app.use(router.routes());

module.exports = app;
