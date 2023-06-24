import { Router } from 'express'
import passport from 'passport'
import { 
    createUser, 
    deleteUser, 
    getUser, 
    getUsers, 
    updateUser, signIn, signUp, protectedEndpoint, refresh
} from '../controllers/user.controller'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

//Agregar para jwt
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/token', refresh);
router.post('/protected', 
passport.authenticate('jwt', { session: false }), 
protectedEndpoint);

export default router;