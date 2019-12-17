const Request = require('request');

const TestModel = require('../models/tests.model');
const TextModel = require('../../texts/models/texts.model');
const AZURE_INK_RECOGNIZER_REQUEST_URL = require('../../common/config/env.config').AZURE_INK_RECOGNIZER_REQUEST_URL;
const OCP_APIM_SUBSCRIPTION_KEY = require('../../common/config/env.config').OCP_APIM_SUBSCRIPTION_KEY;

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    let testData = {
        user: req.query.userId ? req.query.userId : req.jwt.userId
    };
    TestModel.list(limit, page, testData)
        .then((result) => {
            res.status(200).json({result: result});
        })
};

exports.getById = (req, res) => {
    TestModel.findById(req.params.testId)
        .then((result) => {
            res.status(200).json({result: result});
        });
};

exports.insert = (req, res) => {
    const handwriting = req.body.handwriting;
    const options = {
        url: AZURE_INK_RECOGNIZER_REQUEST_URL,
        headers: {
            'Ocp-Apim-Subscription-Key': OCP_APIM_SUBSCRIPTION_KEY
        },
        body: JSON.stringify(handwriting)
    };
    Request.put(options, (error, response, body) => {
        const recognitionUnits = JSON.parse(body).recognitionUnits.filter(recognitionUnit => recognitionUnit.category === "inkWord");
        TextModel.findById(req.body.textId).then((result) => {
            const words = result.content.split(' ');
            const characters = result.content.split('').filter(char => char !== ' ').filter((value, index, self) => self.indexOf(value) === index);
            const count = [];
            for (let i = 0; i < characters.length; i++) {
                count.push({
                    character: characters[i],
                    positive: 0,
                    negative: 0,
                })
            }
            for (let i = 0; i < Math.min(words.length, recognitionUnits.length); i++) {
                const candidates = recognitionUnits[i].alternates.filter(alternate => alternate.recognizedString.length === words[i].length).map(alternate => alternate.recognizedString);
                candidates.push(recognitionUnits[i].recognizedText);
                for (let j = 0; j < words[i].length; j++) {
                    let positive = 0;
                    let negative = 0;
                    for (let k = 0; k < candidates.length; k++) {
                        if (candidates[k].charAt(j) !== words[i].charAt(j)) {
                            negative++;
                        }
                        else {
                            positive++;
                        }
                    }
                    count.map(element => {
                        if (element.character === words[i].charAt(j)) {
                            element.positive += positive;
                            element.negative += negative;
                        }
                    });
                }
            }
            const recognitionAnalysis = {
                analysis: []
            };
            count.map(element => {
                recognitionAnalysis.analysis.push({
                    character: element.character,
                    accuracy: element.positive + element.negative === 0 ? 0 : element.positive/(element.positive + element.negative),
                })
            });
            let positive = 0;
            let negative = 0;
            count.map(element => {
                positive += element.positive;
                negative += element.negative;
            });
            const score = positive + negative === 0 ? 0 : positive / (positive + negative);
            const testData = {
                designation: req.body.designation,
                score: score,
                handwriting: handwriting,
                recognitionUnits: recognitionUnits,
                recognitionAnalysis: recognitionAnalysis,
                user: req.jwt.userId,
                text: req.body.textId
            };
            TestModel.createTest(testData)
                .then((result) => {
                    result = result.toJSON();
                    delete result.__v;
                    delete result.handwriting;
                    delete result.recognitionUnits;
                    delete result.user;
                    delete result.text;
                    res.status(201).json({result: result});
                });
        });
    });
};

exports.patchById = (req, res) => {
    TestModel.patchTest(req.params.testId, req.body)
        .then((result) => {
            res.status(204).json({result: result});
        });
};

exports.removeById = (req, res) => {
    TestModel.removeById(req.params.testId)
        .then((result)=>{
            res.status(204).json({result: result});
        });
};
