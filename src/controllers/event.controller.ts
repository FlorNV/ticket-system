import { Request, Response } from 'express';
import { Event } from '../entities/Event'

interface EventBody {
    type: string
    name: string
    date: Date
    gps: string
}

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find()

        return res.status(200).json({
            data: events
        })
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

export const getEvent = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const event = await Event.findOneBy({ id: parseInt(id)})

        if(!event) return res.status(404).json({
            message: 'Event not found'
        })

        res.status(200).json({
            data: event
        })
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

export const createEvent = async (req: Request<{}, {}, EventBody>, res: Response) => {
    const { type, name, date, gps } = req.body

    try {
        const event = new Event()
        event.type = type
        event.name = name
        event.date = date
        event.gps = gps

        await event.save()

        return res.status(201).json({
            data: event
        })
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params
    const body = req.body

    try {
        const event = await Event.findOneBy({ id: parseInt(id) })

        if(!event) return res.status(404).json({
            message: 'Event not found'
        })

        await Event.update({ id: parseInt(id) }, body)

        return res.sendStatus(204)
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const result = await Event.delete({ id: parseInt(id) })

        if(result.affected === 0) res.status(404).json({
            message: 'Event not found'
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