import {createError} from '../helpers/index'
import Contact from '../models/contact';
import {Request, Response, NextFunction} from "express";

interface ErrorStatus extends Error {
    status?: number,
    kind?: string,
    value?: string,
    path?: string,
}

const validateBody = (req: Request, res: Response, next: NextFunction): void => {
    let newContact = new Contact(req.body);
    let error = newContact.validateSync();
    if (error) {
        for (let field in error.errors) {
            let errorField: ErrorStatus = error.errors[field];
            if (errorField.kind === 'required') {
                return next(createError(400, `missing required ${field} field`));
            } else {
                return next(createError(400, errorField.message));
            }
        }
    }
    next();
};
export default validateBody;