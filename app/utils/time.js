const { isNotEmpty } = require("./string");

const ONE_SECOND_IN_MILLISECONDS = 1000
const ONE_MINUTE_IN_MILLISECONDS = ONE_SECOND_IN_MILLISECONDS * 60
const ONE_HOUR_IN_MILLISECONDS = ONE_MINUTE_IN_MILLISECONDS * 60

// this is a test function to check aynsc await behavior in different scenarios
const delay = async (ms) => {
  new Promise(resolve => setTimeout(resolve, ms))
}

function isDateValidAndInPast(date) {
  if (isNotEmpty(date)) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false
    }
    date = new Date(date)
  }
  return (
    date instanceof Date &&
    !isNaN(date) &&
    date < new Date()
  );
}

module.exports = {
  isDateValidAndInPast, delay,
  ONE_HOUR_IN_MILLISECONDS, ONE_MINUTE_IN_MILLISECONDS, ONE_SECOND_IN_MILLISECONDS
}