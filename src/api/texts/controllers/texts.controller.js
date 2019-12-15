const TextModel = require('../models/texts.model');

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    var textData = {
        user: req.query.userId ? req.query.userId : req.jwt.userId
    };
    TextModel.list(limit, page, textData)
        .then((result) => {
            res.status(200).json({result: result});
        })
};

exports.getById = (req, res) => {
    TextModel.findById(req.params.textId)
        .then((result) => {
            res.status(200).json({result: result});
        });
};

exports.insert = (req, res) => {
    var textData = {
        designation: req.body.designation,
        content: req.body.content,
        language: req.body.language,
        user: req.jwt.userId
    };
    TextModel.createText(textData)
        .then((result) => {
            res.status(201).json({id: result._id});
        });
};

exports.patchById = (req, res) => {
    TextModel.patchText(req.params.textId, req.body)
        .then((result) => {
            res.status(204).json({result: result});
        });
};

exports.removeById = (req, res) => {
    TextModel.removeById(req.params.textId)
        .then((result)=>{
            res.status(204).json({result: result});
        });
};

exports.insertDefault = (req, res) => {
    var textData1 = {
        designation: "Sport",
        content: "Sport includes all forms of competitive physical activity or games",
        language: "en-US",
        user: req.userId
    };
    var textData2 = {
        designation: "Education",
        content: "Education is the process of facilitating learning, or the acquisition of knowledge, skills, values, beliefs, and habits",
        language: "en-US",
        user: req.userId
    };
    TextModel.createText(textData1);
    TextModel.createText(textData2);
    res.status(201).json({id: req.userId});
};