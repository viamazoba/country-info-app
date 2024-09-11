import { Router } from 'express'
import { body, param } from 'express-validator'
import { CountryController } from '../controllers/Country.controller'
// import { handleInputErrors } from '../middleware/validation'
// import { TaskController } from '../controllers/Task.controller'
// import { validateProjectExist } from '../middleware/project'

const router = Router()


router.get('/', CountryController.getAllAvailableCountries)
router.get('/country', CountryController.getCountryByCode)


export default router