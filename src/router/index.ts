import express, {Router} from "express"
import { body } from 'express-validator'
import lessonController from '../controllers/lesson-controller'
import accountController from '../controllers/account-controller'
import divisionController from '../controllers/division-controller'
import subjectController from '../controllers/subject-controller'
import authMiddleware from '../middlewares/auth-middleware'
import ApiError from "../exceptions/api-error";

const router = Router()

// router.post(
//     '/signup',
//     body('email').isEmail(),
//     body('password').isLength({ min: 3, max: 32 }),
//     lessonController.registration,
// )

router.get('/lesson/:id', lessonController.getLesson)
router.get('/lessons/:divisionId', lessonController.getLessonsByDivision)
router.get('/lessons/:divisionId/:week', lessonController.getLessonsByDivision)


router.get('/division/:id', divisionController.getDivision)
router.get('/divisions', divisionController.getAllDivisions)
router.post('/division', authMiddleware, divisionController.createDivision)


router.get('/subject/:id', subjectController.getSubject)

router.get('/account/:id', authMiddleware, accountController.getAccount)
router.post('/login', accountController.login)

router.post('/lecturer', authMiddleware, accountController.createAccount)
router.post('/hui', lessonController.JSON)
// todo: remove
router.use('*', (req: express.Request, res: express.Response, next: express.NextFunction) => next(new ApiError(400, 'Не туда')) )

export default router
