import mongoose from "mongoose";
import {Document, CallbackWithoutResultAndOptionalError} from "mongoose";

interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    favorite?: boolean;
}

const {Schema, model} = mongoose;

let contactSchema = new Schema<IContact>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        favorite: {
            type: Boolean,
            default: false
        }
    }
);

interface ErrorStatus extends Error {
    status?: number
    code: number
}

let handleErrors = (error: ErrorStatus, next: (error?: ErrorStatus) => void): void => {
    if (error instanceof Error) {
        error.status = 400;
        let {name, code} = error;
        if (code === 11000 || name === 'MongoServerError') {
            error.status = 409;
        }
        return next(error);
    }
    next();
};
contactSchema.post("findOneAndUpdate", handleErrors);
contactSchema.post("updateOne", handleErrors);
contactSchema.post("save", handleErrors);
const Contact = model('contact', contactSchema);

export default Contact;