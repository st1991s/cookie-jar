const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const cors = require('koa-cors')
const fs = require('fs')
const path = require('path')
const views = require('koa-views')
// const formidable = require('formidable')

const koaBody = require('koa-body')({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'public')
  }
})

app.use(cors())
app.use(require('koa-static')('./public'))
app.use(views(path.join(__dirname, './view'), { extension: 'pug' }))

router.get('/', async (ctx) => {
  await ctx.render('index.pug')
})

router.post('/', koaBody, async ( ctx ) => {
  console.log(ctx.request.body.files.uploadfile)
let imageName = ctx.request.body.files.uploadfile.name
fs.rename(ctx.request.body.files.uploadfile.path, path.join(__dirname, 'public/images/') + ctx.request.body.files.uploadfile.name, () => {
  console.log('图片上传ok')
})

ctx.set('Content-Type', 'image/png')
ctx.body = {
  text: '图片上传成功',
  imageUrl: `http://localhost:8080/images/${imageName}`
}
})


app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8080)
console.log('[demo] start-quick is starting at port 8080')