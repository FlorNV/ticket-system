import { Request, Response } from "express"
import { User } from '../entities/User'

// -------- Agregar para jwt
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const jwtSecret = 'somesecrettoken';
const jwtRefreshTokenSecret = 'somesecrettokenrefresh';
let refreshTokens: (string | undefined)[] = [];


const createToken = (user: User) => {
  // Se crean el jwt y refresh token
  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {expiresIn: '20s'});
  const refreshToken = jwt.sign({ email: user.email }, jwtRefreshTokenSecret, {expiresIn: '90d'});
  
  refreshTokens.push(refreshToken);
  return {
      token,
      refreshToken
  }
}
// --------

interface UserBody {
    firstname: string
    lastname: string
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find()
        return res.status(200).json({
            data: users
        })
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error.message
            })
        }        
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params
    
    try {
        const user = await User.findOneBy({ id: parseInt(id) })

        if(!user) return res.status(404).json({
            message: 'User not found'
        })

        res.status(200).json({
            data: user
        })
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error.message
            })
        }        
    }
}

export const createUser = async (req: Request<{}, {}, UserBody>, res: Response) => {
    const { firstname, lastname } = req.body
    
    try {
        const user = new User()
        user.email = firstname
        user.password = lastname
        
        await user.save()

        return res.status(201).json({
            data: user
        })
    } catch (error) {
        if(error instanceof Error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            })
        }        
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = req.body

    try {
        const user = await User.findOneBy({ id: parseInt(id) })

        if(!user) return res.status(404).json({
            message: 'User not found'                
        })

        await User.update({ id: parseInt(id) }, data)
        return res.sendStatus(204)
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error.message
            })
        }        
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await User.delete({ id: parseInt(id) })

        if(result.affected === 0) return res.status(404).json({
            message: 'User not found'
        })
        
        return res.sendStatus(204)
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error.message
            })
        }        
    }
}

export const signUp = async (req: Request, res: Response ): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ msg: "Please. Send your email and password" });
    }
  
    const user = await User.findOneBy({ email: req.body.email });
    if (user) {
      return res.status(400).json({ msg: "The User already Exists" });
    }
  
  
    const newUser = new User();
    newUser.email = req.body.email;
    newUser.password = await createHash(req.body.password);
    await newUser.save();
    return res.status(201).json(newUser);
}

export const signIn = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ msg: "Please. Send your email and password" });
    }
  
    const user = await User.findOneBy({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ msg: "The User does not exists" });
    }
  
    const isMatch = await comparePassword(user, req.body.password);
    if (isMatch) {
      return res.status(400).json({ credentials: createToken(user) });
    }
  
    return res.status(400).json({
      msg: "The email or password are incorrect"
    });
}

const comparePassword = async (user: User, password: string ): Promise<Boolean> => {
    return await bcrypt.compare(password, user.password);
}

export const protectedEndpoint = async (req: Request, res: Response): Promise<Response> => {
  
    return res.status(200).json({ msg: 'ok'});
}

const createHash = async (password: string ): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Create new access token from refresh token
export const refresh = async (req: Request, res: Response): Promise<any>  => {
    // const refreshToken = req.header("x-auth-token");
  
    const refreshToken = req.body.refresh;
  
  
    // If token is not provided, send error message
    if (!refreshToken) {
      res.status(401).json({
        errors: [
          {
            msg: "Token not found",
          },
        ],
      });
    }
  
    console.log(refreshTokens);
    // If token does not exist, send error message
    if (!refreshTokens.includes(refreshToken)) {
      res.status(403).json({
        errors: [
          {
            msg: "Invalid refresh token",
          },
        ],
      });
    }
  
  
    try {
      const user = jwt.verify(refreshToken, jwtRefreshTokenSecret);
      // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
      const { email } = <any>user;
  
      const userFound = <User> await User.findOneBy({ email: email });
      if (!userFound) {
        return res.status(400).json({ msg: "The User does not exists" });
      }
  
      const accessToken = jwt.sign({ id: userFound.id, email: userFound.email }, jwtSecret, {expiresIn: '120s'});
  
      res.json({ accessToken });
    } catch (error) {
      res.status(403).json({
        errors: [
          {
            msg: "Invalid token",
          },
        ],
      });
    }
}