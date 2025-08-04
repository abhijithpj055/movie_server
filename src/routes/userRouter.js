const express=require('express')
const router=express.Router()

const {registerController, 
    loginController,
    logoutController,
    updateUserController,
    deleteUserController,
    deleteAnyUserController,
  getAllUsersController,
  getUserByIdController,
  getUserActivityController}
    =require("../controllers/userController")

const {protect,admin}=require('../middlewares/authMiddleware')

router.post('/register',registerController)
router.post('/login',loginController)

router.put('/update-user',protect,updateUserController)
router.delete('/delete-own-account',protect,deleteUserController)
router.post('/logout', logoutController);

router.delete('/admin/delete-user/:id', protect, admin, deleteAnyUserController);
router.get('/admin/all-users', protect, admin, getAllUsersController);
// Accessible by admin or user
router.get('/userbyid/:id', protect, getUserByIdController);

// Authenticated user accessing their own activity
router.get('/my-activity', protect, getUserActivityController);



module.exports=router