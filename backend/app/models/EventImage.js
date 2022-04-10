import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";
import fs from 'fs';

class EventImage extends Model { }

EventImage.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    hooks: {
        beforeDestroy: (image) => {
            fs.unlinkSync(`./${image.path}`);
        },
    },
    tableName: "event_images"
});

export default EventImage;
