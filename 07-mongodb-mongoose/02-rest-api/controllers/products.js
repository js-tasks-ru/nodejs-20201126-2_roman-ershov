const Product = require('../models/Product');
const {ObjectID} = require('mongodb');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.request.query.subcategory;

  if (subcategoryId) {
    try {
      const productsBySubcategory = await Product.find({subcategory: ObjectID(subcategoryId)});

      ctx.body = {products: productsBySubcategory};
    } catch (e) {
      ctx.res.statusCode = 400;
      ctx.res.end();
    }
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  try {
    const product = await Product.find({_id: ObjectID(productId)});

    if (product.length) {
      ctx.body = {product: product[0]};
    } else {
      ctx.res.statusCode = 404;
      ctx.res.end();
    }
  } catch (e) {
    ctx.res.statusCode = 400;
    ctx.res.end();
  }
};

