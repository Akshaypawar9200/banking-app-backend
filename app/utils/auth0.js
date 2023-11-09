const axios = require('axios')
const { BadRequest } = require('throw.js');

const AUTH0_BASE_URL = `https://innovation.auth0.com`

const changePassword = async (authUser) => {
  const response = await axios.post(`${AUTH0_BASE_URL}/dbconnections/change_password`, authUser)
  return response
}

const verifyUserAuth = async (authUser) => {
  try {
    const response = await axios.post(`${AUTH0_BASE_URL}/oauth/token`, authUser)
    return response
  } catch (error) {
    console.log(error);
    if (error?.response.data?.error_description) {
      throw new BadRequest(error.response.data.error_description)
    }
    throw error
  }
}
module.exports = { changePassword, verifyUserAuth }