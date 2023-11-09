const { isEmpty, isArray } = require("lodash")
const { isPositiveInteger } = require("./number")
const errors = require("throw.js");
const { isEmptyString } = require("./string");
const { Op } = require("sequelize");
const { log } = require("winston");



const parseLimitAndOffset = (query) => {

    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",query)
    let limit = query.limit
    let page = query.page

    if (limit === undefined) {
        return
    }

    if (page === undefined) {
        page = 1
    }

    limit = +limit
    page = +page

    if (!isPositiveInteger(limit)) {
        throw new errors.BadRequest("Limit should be a valid positive integer")
    }
    if (!isPositiveInteger(page)) {
        throw new errors.BadRequest("Page should be a valid positive integer")
    }

    let offset = (page - 1) * limit

    return { limit, offset }
}

// TODO: @Niranjan changed to body from req.body
const unmarshalBody = (body) => {
    if (isEmpty(body)) {
        throw new errors.BadRequest("Request body cannot be empty")
    }

    return body
}

/**
 * Parses and constructs Sequelize query conditions based on query parameters and filters.
 * @param {Object} queryParams - The query parameters containing filtering criteria.
 * @param {Object} filters - A map of filter functions corresponding to query parameters.
 * @param {Object} [where={}] - Optional existing Sequelize `where` object for appending conditions.
 * @returns {Object} - Sequelize `where` object with parsed and applied conditions.
 */
const parseFilterQueries = (queryParams, filters, where = {}) => {
    // If queryParams is falsy, return the existing 'where' object as is
    if (!queryParams) {
        return { where };
    }

    // Initialize arrays for AND and OR conditions based on the existing 'where' object
    let andArray = where[Op.and] || [];
    let orArray = where[Op.or] || [];

    // Extract 'or' fields from queryParams
    const orFields = queryParams["or"];
    // Keep track of processed fields to prevent duplicates
    let fieldAdded = {};

    // Process 'or' fields if present in queryParams
    if (orFields) {
        // Convert 'orFields' to an array, if not already
        const orFieldsArray = isArray(orFields) ? orFields : orFields.split(",");

        // Iterate through 'orFields' and apply filters to the OR array
        for (const key of orFieldsArray) {
            if (queryParams[key] && filters[key]) {
                orArray.push(filters[key](queryParams[key]));
                fieldAdded[key] = 1; // Mark field as processed
            }
        }
    }

    // Iterate through remaining keys in queryParams and apply filters to the AND array
    for (const key of Object.keys(queryParams)) {
        if (!fieldAdded[key] && filters[key]) {
            andArray.push(filters[key](queryParams[key]));
        }
    }

    // Set updated AND and OR arrays back to the 'where' object
    if (andArray.length > 0) {
        where[Op.and] = andArray;
    }
    if (orArray.length > 0) {
        where[Op.or] = orArray;
    }

    // Return the updated 'where' object with applied conditions
    return { where };
};

/**
 * Parses and validates the 'fields' query parameter to extract and map allowed fields.
 * @param {object} queryParams - The query parameters object.
 * @param {object} allowedFields - The mapping of allowed fields.
 * @returns {array|undefined} An array of selected fields or undefined if no valid fields are found.
 */
const parseSelectFields = (queryParams, allowedFields) => {
    const fields = queryParams["fields"]
    if (!fields || (!isArray(fields) && isEmptyString(fields))) {
        return undefined
    }
    const selectArray = []
    // Convert 'fields' to an array if it's a string
    const fieldArray = isArray(fields) ? fields : fields.split(",");
    for (const field of fieldArray) {
        if (allowedFields[field]) {
            selectArray.push(allowedFields[field])
        }
    }
    if (selectArray.length === 0) {
        return undefined
    }
    return selectArray
}

module.exports = { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }