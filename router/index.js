const Router = require('express').Router;
const userController = require('../controllers/user-controller')
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 22}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/changepassword', userController.changePassword)

router.get('/refresh', userController.refresh);


router.post('/resend-activation', userController.resendActivation)
router.get('/activate/:link', userController.activate);

router.post('/resetpasslink', userController.resetPassLink)
router.post('/resetpassword', userController.resetpassword)

router.get('/health', userController.health);

router.get('/user/:id', authMiddleware,  userController.getUsers);



module.exports = router;