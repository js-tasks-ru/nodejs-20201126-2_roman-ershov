const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
   const {product: productId, phone, address} = ctx.request.body;
   const {id: userId} = ctx.user;
   const order = await Order.create({user: userId, product: productId, phone, address});
   const product = await Product.findById(productId);
   const user = await User.findById(userId);

   await sendMail({
      template: 'order-confirmation',
      locals: {
         id: order.id,
         product: {
            title: product.title,
         },
      },
      to: user.email,
      subject: 'Спасибо за заказ',
   });
   ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
   const {id} = ctx.user;
   const orders = await Order.find({user: id}).populate('products');

   ctx.body = {orders: orders.map(mapOrder)};
};
