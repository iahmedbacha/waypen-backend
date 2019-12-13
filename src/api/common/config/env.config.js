require('dotenv').config();

module.exports = {
    "PORT": process.env.PORT,
    "JWT_SECRET": process.env.JWT_SECRET,
    "MONGODB_URI": process.env.MONGODB_URI,
    "PERMISSION_LEVELS": {
        "NORMAL_USER": process.env.NORMAL_USER,
        "PAID_USER": process.env.PAID_USER,
        "ADMIN": process.env.ADMIN
    },
    "AZURE_INK_RECOGNIZER_REQUEST_URL": process.env.AZURE_INK_RECOGNIZER_REQUEST_URL,
    "OCP_APIM_SUBSCRIPTION_KEY": process.env.OCP_APIM_SUBSCRIPTION_KEY
};
