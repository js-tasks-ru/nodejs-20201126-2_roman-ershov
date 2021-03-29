const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
   const {product: productId, phone, address} = ctx.request.body;
   const order = await Order.create({user: ctx.user, product: productId, phone, address});
   const product = await Product.findById(productId);

   await sendMail({
      template: 'order-confirmation',
      locals: {
         id: order.id,
         product: {
            title: product.title,
         },
      },
      to: ctx.user.email,
      subject: 'Спасибо за заказ',
   });
   ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
   const orders = await Order.find({user: ctx.user}).populate('products');
   ctx.body = {orders: orders.map(mapOrder)};
};
