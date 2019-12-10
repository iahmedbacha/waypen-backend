require('dotenv').config();

module.exports = {
    "PORT": process.env.PORT,
    "APP_ENDPOINT": process.env.APP_ENDPOINT,
    "API_ENDPOINT": process.env.API_ENDPOINT,
    "JWT_SECRET": process.env.JWT_SECRET,
    "JWT_EXPIRATION_IN_SECONDS": process.env.JWT_EXPIRATION_IN_SECONDS,
    "ENVIRONMENT": process.env.ENVIRONMENT,
    "PERMISSION_LEVELS": {
        "NORMAL_USER": process.env.NORMAL_USER,
        "PAID_USER": process.env.PAID_USER,
        "ADMIN": process.env.ADMIN
    }
};
