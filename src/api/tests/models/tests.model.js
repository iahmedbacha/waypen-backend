const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const testSchema = new Schema({
    designation: String,
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    handwriting: {
        language: String,
        version: Number,
        strokes: [{
            id: Number,
            points: String,
        }]
    },
    recognitionUnits: [{
        alternates: [{
            recognizedString: String
        }],
        recognizedText: String,
    }],
    recognitionAnalysis: {
        analysis: [{
            character: String,
            accuracy: Number,
        }]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Text'
    }
});

testSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
testSchema.set('toJSON', {
    virtuals: true
});

testSchema.findById = function (cb) {
    return this.model('Tests').find({id: this.id}, cb);
};

const Test = mongoose.model('Tests', testSchema);

exports.findById = (id) => {
    return Test.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            delete result.handwriting;
            delete result.recognitionUnits;
            delete result.user;
            delete result.text;
            return result;
        });
};

exports.createTest = (testData) => {
    const test = new Test(testData);
    return test.save();
};

exports.list = (perPage, page, testData) => {
    return new Promise((resolve, reject) => {
        Test.find(testData)
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, tests) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(tests);
                }
            })
    });
};

exports.patchTest = (id, testData) => {
    return new Promise((resolve, reject) => {
        Test.findById(id, function (err, test) {
            if (err) reject(err);
            for (let i in testData) {
                test[i] = testData[i];
            }
            test.save(function (err, updatedText) {
                if (err) return reject(err);
                resolve(updatedText);
            });
        });
    })
};

exports.removeById = (testId) => {
    return new Promise((resolve, reject) => {
        Test.deleteOne({_id: testId}, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(err);
            }
        });
    });
};
