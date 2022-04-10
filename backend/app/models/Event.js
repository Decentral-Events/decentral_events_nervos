import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Event extends Model { }

Event.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    startTime: {
        type: DataTypes.INTEGER
    },
    endTime: {
        type: DataTypes.INTEGER
    },
    tokensRequired: {
        type: DataTypes.STRING
    },
    validationRequired: {
        type: DataTypes.INTEGER
    },
    transactionHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    maxBookings: {
        type: DataTypes.INTEGER
    },
    totalBookings: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastBlock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    tableName: 'events'
});

export default Event;