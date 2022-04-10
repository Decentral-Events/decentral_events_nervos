import { Router } from "express";
import { onlyAuthorized } from "../protection_middlewares.js";
import sequelize from '../database.js';
import { Op } from "sequelize";
import { paginate, validate } from "../middlewares.js";

const { Reservation, Event, EventImage } = sequelize.models;

const router = Router();

router.get('/event/:id', onlyAuthorized, async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Event not found!" });
    res.json({
        isReserved: Boolean(await Reservation.findOne({
            where: {
                eventId: id,
                userId: user.id
            }
        }))
    });
});

router.get('/past', onlyAuthorized, paginate(10), validate, async (req, res) => {
    const { user } = req;
    const { limit, offset } = req.query;
    const now = new Date().getTime() / 1000 | 0;
    const total = await Reservation.count({
        where: {
            userId: user.id,
            cancelled: false
        },
        include: [{
            model: Event,
            where: {
                endTime: {
                    [Op.lt]: now
                },
            },
            required: true
        }]
    });
    const totalPages = Math.ceil(total / limit);
    const reservations = await Reservation.findAll({
        where: {
            userId: user.id,
            cancelled: false
        },
        include: [{
            model: Event,
            where: {
                endTime: {
                    [Op.lt]: now
                },
            },
            include: [{ model: EventImage, as: 'images', attributes: ['id', 'path'] }],
            required: true
        }],
        limit,
        offset
    });
    res.json({ reservations, totalPages });
});

router.get('/ongoing', onlyAuthorized, paginate(10), validate, async (req, res) => {
    const { user } = req;
    const { limit, offset } = req.query;
    const now = new Date().getTime() / 1000 | 0;
    const total = await Reservation.count({
        where: {
            userId: user.id,
            cancelled: false
        },
        include: [{
            model: Event,
            where: {
                endTime: {
                    [Op.gt]: now
                },
                startTime: {
                    [Op.lt]: now
                },
            },
            required: true
        }]
    });
    const totalPages = Math.ceil(total / limit);
    const reservations = await Reservation.findAll({
        where: {
            userId: user.id,
            cancelled: false
        },
        include: [{
            model: Event,
            where: {
                endTime: {
                    [Op.gt]: now
                },
                startTime: {
                    [Op.lt]: now
                },
            },
            include: [{ model: EventImage, as: 'images', attributes: ['id', 'path'] }],
            required: true
        }],
        limit,
        offset
    });
    res.json({ reservations, totalPages });
});


router.get('/future', onlyAuthorized, paginate(10), validate, async (req, res) => {
    const { user } = req;
    const { limit, offset } = req.query;
    const now = new Date().getTime() / 1000 | 0;
    const total = await Reservation.count({
        where: {
            userId: user.id,
            cancelled: false
        },
        include: [{
            model: Event,
            where: {
                startTime: {
                    [Op.gt]: now
                },
            },
            required: true
        }]
    });
    const totalPages = Math.ceil(total / limit);
    const reservations = await Reservation.findAll({
        where: {
            userId: user.id,
            cancelled: false
        },
        include: [{
            model: Event,
            where: {
                startTime: {
                    [Op.gt]: now
                },
            },
            include: [{ model: EventImage, as: 'images', attributes: ['id', 'path'] }],
            required: true
        }],
        limit,
        offset
    });
    res.json({ reservations, totalPages });
});

router.get('/cancelled', onlyAuthorized, paginate(10), validate, async (req, res) => {
    const { user } = req;
    const { limit, offset } = req.query;
    const now = new Date().getTime() / 1000 | 0;
    const total = await Reservation.count({
        where: {
            userId: user.id,
            cancelled: true
        },
        include: [{
            model: Event,
            required: true
        }]
    });
    const totalPages = Math.ceil(total / limit);
    const reservations = await Reservation.findAll({
        where: {
            userId: user.id,
            cancelled: true
        },
        include: [{
            model: Event,
            include: [{ model: EventImage, as: 'images', attributes: ['id', 'path'] }],
            required: true
        }],
        limit,
        offset
    });
    res.json({ reservations, totalPages });
});

export default router;