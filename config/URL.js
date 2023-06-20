
// url set will be based on condition
const isDevelopment = process.env.NODE_ENV === 'development';
const URL = isDevelopment ? process.env.DEVELOPMENT_HOST_URL : process.env.PRODUCTION_HOST_URL


module.exports = URL;