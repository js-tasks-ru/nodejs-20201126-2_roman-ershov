const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  if (query) {
    const products = await Product.find({$text: {$search: query}});

    ctx.body = {products};
  } else {
    ctx.body = {products: []};
  }
};
