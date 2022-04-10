import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Reservation extends Model { }

Reservation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    totalValidators: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    attended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    unstaked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    cancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastBlock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'reservations'
});

export default Reservation;