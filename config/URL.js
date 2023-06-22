
// url set will be based on condition
const isDevelopment = process.env.NODE_ENV === 'development';
const frontEndURL = isDevelopment ? process.env.FRONT_DEVELOPMENT_HOST_URL : process.env.FRONT_PRODUCTION_HOST_URL
const serverURL = isDevelopment ? process.env.SERVER_DEVELOPMENT_HOST_URL : process.env.SERVER_PRODUCTION_HOST_URL


module.exports = {
    FRONT_END_URL: frontEndURL,
    SERVER_URL: serverURL
};