const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

router.post('/register', async (req, res) => {
    const email = req.body.email;

    try {
        if (await User.findOne({email})) {
            return res.status(400).send({error: 'User already exists'});
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({id: user.id})
        });
    } catch (error) {
        return res.status(400).send({error: 'Registrator failed'})
    }
});

router.post('/authenticate', async (req, res) => {
   const { email, password } = req.body;

   const user = await User.findOne({email}).select('+password');

   if (!user)
       return res.status(400).send({error: 'User not found'});

   if (!await bcrypt.compare(password, user.password))
       return res.status(400).send({error: 'Invalid password'});

   user.password = undefined;

   return res.send({
       user,
       token: generateToken({id: user.id})
   });
});

router.post('/forgot-password', async (req, res) => {
   const { email } = req.body;

   try {
        const user = await User.findOne({email});

       if (!user)
           return res.status(400).send({error: 'User not found'});

       const token = crypto.randomBytes(20).toString('hex');

       const now = new Date();
       now.setHours(now.getHours() + 1);

       await User.findByIdAndUpdate(user.id, {
           '$set': {
               passwordResetToken: token,
               passwordResetExpires: now
           }
       });

       mailer.sendMail({
           to: 'juliogontier10@gmail.com',
           from: 'julinn_cesar@hotmail.com',
           template: 'auth/forgot_password',
           context: token
       }, (err) => {
               if (err)
                   return res.status(400).send({error: 'Cannot send forgot password email'});

               return res.send();
           }
       )
   } catch(error) {
       return res.status(400).send({message: 'Error on forgot password, try again'});
   }
});

module.exports = (app) => {
    app.use('/auth', router)
};