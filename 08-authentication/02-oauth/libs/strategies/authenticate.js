const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
   try {
      if (!email) {
         done(null, false, 'Не указан email');
      } else {
         const user = await User.findOne({email});

         done(null, user || await User.create({displayName, email}));
      }
   } catch (err) {
      done(err);
   }
};
