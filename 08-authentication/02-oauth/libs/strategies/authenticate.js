const User = require('../../models/User');

class ValidationError extends Error {
   constructor(errors) {
      super();
      this.name = 'ValidationError';
      this.errors = errors;
   }
}

module.exports = async function authenticate(strategy, email, displayName, done) {
   try {
      if (!email) {
         done(null, false, 'Не указан email');
      } else {
         const user = await User.findOneAndUpdate(
            {email},
            {email, displayName},
            {
               new: true,
               upsert: true,
            },
         );

         done(null, user);
      }
   } catch (err) {
      done(new ValidationError({email: {message: 'Некорректный email.'}}));
   }
};
