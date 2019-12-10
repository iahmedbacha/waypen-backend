require('dotenv').config();

module.exports = {
    "PORT": process.env.PORT,
    "JWT_SECRET": process.env.JWT_SECRET,
    "ENVIRONMENT": process.env.ENVIRONMENT,
    "MONGODB_URI": process.env.MONGODB_URI,
    "PERMISSION_LEVELS": {
        "NORMAL_USER": process.env.NORMAL_USER,
        "PAID_USER": process.env.PAID_USER,
        "ADMIN": process.env.ADMIN
    }
};
