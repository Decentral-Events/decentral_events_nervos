// config the dotenv
import './load_dotenv.js';

// import dependencies
import express from 'express';
import User from "./models/User.js";
import Event from "./models/Event.js";
import EventImage from "./models/EventImage.js";
import Reservation from "./models/Reservation.js";
import sequelize from './database.js';
import authRouter from './routes/auth.js';
import eventRouter from './routes/event.js';
import userRouter from './routes/user.js';
import reservationRouter from './routes/reservation.js';
import web3listener from './web3_listener.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';

// define the variables
const PORT = process.env.PORT || 8000;

// setup app
const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(cors());

// static files
app.use('/uploads', express.static('uploads'));

// define the model relationships
User.hasMany(Reservation, { as: "reservations" });
Event.hasMany(Reservation, { as: "reservations" });
Reservation.belongsTo(User);
Reservation.belongsTo(Event);
Event.hasMany(EventImage, { as: "images", onDelete: "cascade" });
EventImage.belongsTo(Event);

// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use('/reservation', reservationRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// connect to database and start the server
sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.")
    return sequelize.sync({ force: true });
}).then(() => {
    console.log("Synced models with database");
    web3listener();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error)
});
