import createError from '../helpers/createError';
import Contact from '../models/contact';
import {Request, Response} from "express";

type controllerCt = {
    getAll: (req: Request, res: Response) => Promise<void | never>
    getById: (req: Request, res: Response) => Promise<void | never>
    addContact: (req: Request, res: Response) => Promise<void | never>
    updateById: (req: Request, res: Response) => Promise<void | never>
    updateFavoriteById: (req: Request, res: Response) => Promise<void | never>
    deleteById: (req: Request, res: Response) => Promise<void | never>
}
let controllerContacts: controllerCt = {
    getAll: async (req: Request, res: Response): Promise<void | never> => {
        let list = await Contact.find();
        res.json(list)
    },
    getById: async (req: Request, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let result = await Contact.findById(id);
        if (!result) {
            throw createError(404);
        }
        res.json(result)
    },
    addContact: async (req: Request, res: Response): Promise<void | never> => {

        let newModel = new Contact(req.body);
        let result = await newModel.save();
        res.status(201).json(result)
    },
    updateById: async (req: Request, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let result = await Contact.findOneAndUpdate({"_id": id}, req.body, {new: true});
        if (!result) {
            throw createError(404);
        }
        res.json(result)
    },
    deleteById: async (req: Request, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let result = await Contact.findByIdAndRemove({"_id": id});
        if (!result) {
            throw createError(404);
        }

        res.json(result)

    },
    updateFavoriteById: async (req: Request, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let {favorite} = req.body;
        let result = await Contact.findOneAndUpdate({"_id": id}, {favorite: favorite}, {new: true});

        if (!result) {
            throw createError(404);
        }
        res.json(result)

    },
};


export default controllerContacts;