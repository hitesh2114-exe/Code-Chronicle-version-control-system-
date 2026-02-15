const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/allUsers', userController.getAllUser);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.get('/userProfile/:id', userController.getUserProfile);
userRouter.put('/addNewRepo/:id', userController.addNewRepo);
userRouter.put('/deleteRepoIdFromProfile/:id', userController.deleteRepoIdFromProfile);
userRouter.put('/updateProfile/:id', userController.updateUserProfile);
userRouter.delete('/deleteProfile/:id', userController.deleteUserProfile);

module.exports = userRouter;