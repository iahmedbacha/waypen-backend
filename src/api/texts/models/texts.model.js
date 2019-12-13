const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const textSchema = new Schema({
    designation: String,
    content: String,
    language: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

textSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
textSchema.set('toJSON', {
    virtuals: true
});

textSchema.findById = function (cb) {
    return this.model('Texts').find({id: this.id}, cb);
};

const Text = mongoose.model('Texts', textSchema);

exports.findById = (id) => {
    return Text.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createText = (textData) => {
    const text = new Text(textData);
    return text.save();
};

exports.list = (perPage, page, textData) => {
    return new Promise((resolve, reject) => {
        Text.find(textData)
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, texts) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(texts);
                }
            })
    });
};

exports.patchText = (id, textData) => {
    return new Promise((resolve, reject) => {
        Text.findById(id, function (err, text) {
            if (err) reject(err);
            for (let i in textData) {
                text[i] = textData[i];
            }
            text.save(function (err, updatedText) {
                if (err) return reject(err);
                resolve(updatedText);
            });
        });
    })
};

exports.removeById = (textId) => {
    return new Promise((resolve, reject) => {
        Text.deleteOne({_id: textId}, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(err);
            }
        });
    });
};
