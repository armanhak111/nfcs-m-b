const Router = require('express').Router;
const userController = require('../controllers/user-controller')
const additionalController = require('../controllers/additional-controller')

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
// router.get('/user',userController.getCurrentUser)

router.get('/refresh', userController.refresh);


router.post('/resend-activation', userController.resendActivation)
router.get('/activate/:link', userController.activate);

router.post('/resetpasslink', userController.resetPassLink)
router.post('/resetpassword', userController.resetpassword)

router.get('/health', userController.health);

router.get('/user', authMiddleware,  userController.getUsers);

router.put('/change/name', authMiddleware,  userController.changeName);



router.post('/contact', 
        body('name').isString(),
        body('email').isEmail(),
        body('inquiry').isString(),
        body('message').isString(),
        additionalController.contact);

router.post('/analytics/order', authMiddleware,  additionalController.order);
router.get('/analytics', authMiddleware,  additionalController.getAnalytics);
router.delete('/analytics/delete', authMiddleware,  additionalController.deleteAnalytics);


module.exports = router;