import { Router } from 'express';
import { body } from 'express-validator';
import sequelize from '../database.js';
import { files, paginate, validate } from '../middlewares.js';
import { Op } from 'sequelize';
import { saveFile } from '../helpers.js';
import { onlyAdmin, onlyAuthorized } from '../protection_middlewares.js';
import updateObj from '../updateObj.js';

const { Event, EventImage } = sequelize.models;

const router = Router();

// get all the events
router.get("/", paginate(10), validate, async (req, res) => {
    let { date, draft, search, future, past, ongoing } = req.query;
    const { limit, offset } = req.query;
    date = parseInt(date);
    console.log(search);
    const nowTimestamp = new Date().getTime() / 1000 | 0;
    if (date && date < nowTimestamp - 3600 * 24) { }
    // return res.status(400).json({ message: "date cannot be of before today" });
    let where;
    if (date) {
        where = Object.assign({}, {
            startTime: {
                [Op.gte]: future ? Math.max(date, nowTimestamp) : date,
                [Op.lt]: date + 3600 * 24
            },
            draft: Boolean(draft)
        }, search ? {
            name: sequelize.where(sequelize.fn("LOWER", sequelize.col('name')), 'LIKE', `%${search.toLowerCase()}%`)
        } : {});
        if (past) {
            where.endTime = {
                [Op.lt]: nowTimestamp
            }
        }
        if (ongoing) {
            where.endTime = {
                [Op.gt]: nowTimestamp
            }
            where.startTime[Op.lt] = Math.min(nowTimestamp, date + 3600 * 24);
        }
        console.log(where)
    } else {
        where = Object.assign({}, {
            endTime: {
                [Op.gt]: nowTimestamp
            },
            draft: Boolean(draft)
        }, search ? {
            name: sequelize.where(sequelize.fn("LOWER", sequelize.col('name')), 'LIKE', `%${search.toLowerCase()}%`)
        } : {});
    }
    const total = (await Event.findAndCountAll({ where })).count;
    console.log(total)
    const totalPages = Math.ceil(total / limit);
    const events = await Event.findAll({
        where,
        include: { model: EventImage, as: 'images' },
        limit,
        offset,
        order: [['startTime', 'ASC']]
    });
    return res.json({ events, totalPages });
});

// get a event
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findOne({
        where: { id },
        include: {
            model: EventImage,
            attributes: ['id', 'path'],
            as: "images"
        }
    });
    if (!event) return res.status(404).json({ message: "event not found" });
    res.json({ event });
});

// publish a event
router.post(
    "/:id",
    body("description").isLength({ min: 4 }),
    files("images", "image", 1, 4),
    validate,
    async (req, res) => {
        const { id } = req.params;
        const { description } = req.body;
        const { images } = req.files;
        const event = await Event.findOne({ where: { id } });
        if (!event) return res.status(404).json({ message: "event not found" });
        if (!event.draft) return res.status(400).json({ message: "event is already created" });
        for (const image of images) {
            const filename = saveFile(`./uploads/events/${id}`, image);
            const path = `/uploads/events/${id}/${filename}`;
            const eventImage = await EventImage.create({ path });
            await event.addImage(eventImage);
        }
        event.draft = false;
        event.description = description;
        event.save();
        res.json({
            event: {
                ...event.toJSON(),
                images: await event.getImages({
                    attributes: ['id', 'path']
                })
            }
        });
    });

// add new images to a published event
router.post("/:id/images",
    files("images", "image", 1, 4),
    validate,
    async (req, res) => {
        const { id } = req.params;
        const { images } = req.files;
        const event = await Event.findOne({ where: { id } });
        if (!event) return res.status(404).json({ message: "Event not found" });
        if (event.draft) return res.status(400).json({ message: "Event is still draft" });
        for (const image of images) {
            const filename = saveFile(`./uploads/events/${id}`, image);
            const path = `/uploads/events/${id}/${filename}`;
            const eventImage = await EventImage.create({ path });
            await event.addImage(eventImage);
        }
        res.json({
            event: {
                ...event.toJSON(),
                images: await event.getImages({
                    attributes: ['id', 'path']
                })
            }
        });
    });

// update published event
router.put(
    "/:id",
    async (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;
        const event = await Event.findOne({ where: { id } });
        if (!event) return res.status(404).json({ message: "Event not found" });
        if (event.draft) return res.status(400).json({ message: "Event is still draft" });
        const [done, errors] = await updateObj(event, { name, description }, {
            name: {
                type: "string",
                validate: (name) => name.length < 2
            },
            description: {
                type: "string",
                validate: (description) => description.length < 4
            }
        });
        if (errors.length !== 0)
            return res.status(400).json({ errors });
        res.json({ event });
    });

// delete all the images of a event
router.delete("/:id/images", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findOne({ where: { id } });
    if (!event) return res.status(404).json({ message: "Event not found" });
    await EventImage.destroy({ where: { Event_id: id }, individualHooks: true });
    res.json({ message: "Images deleted" });
});

// delete a image
router.delete("/:id/images/:imageId", async (req, res) => {
    const { id, imageId } = req.params;
    const event = await Event.findOne({ where: { id } });
    if (!event) return res.status(404).json({ message: "Event not found" });
    const image = (await event.getImages({ where: { id: imageId } }))[0];
    if (!image) return res.status(404).json({ message: "Image not found" });
    await EventImage.destroy({ where: { id: imageId }, individualHooks: true });
    res.json({ message: "Image deleted" });
});

export default router;