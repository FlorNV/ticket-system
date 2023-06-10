import { Request, Response } from "express"
import { User } from '../entities/User'

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
        user.firstname = firstname
        user.lastname = lastname
        
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