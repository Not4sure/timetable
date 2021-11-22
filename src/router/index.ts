import {Router} from "express"
import { body } from 'express-validator'
import lessonController from '../controllers/lesson-controller'
import accountController from '../controllers/account-controller'
import divisionController from '../controllers/division-controller'
import subjectController from '../controllers/subject-controller'
import authMiddleware from '../middlewares/auth-middleware'

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
router.get('/subject/:id', subjectController.getSubject)
router.get('/account/:id', authMiddleware, accountController.getAccount)

export default router