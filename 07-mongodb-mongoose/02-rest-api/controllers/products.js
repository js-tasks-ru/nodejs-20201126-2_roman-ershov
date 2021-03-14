const Product = require('../models/Product');
const {ObjectID} = require('mongodb');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.query.subcategory;

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
  const products = await Product.find().limit(20);

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!ObjectID.isValid(productId)) {
    ctx.throw(400, 'invalid product id');
  } else {
    const product = await Product.findById(ObjectID(productId));

    if (product) {
      ctx.body = {product: product};
    } else {
      ctx.throw(404, `no product with ${productId} id`);
    }
  }
};

