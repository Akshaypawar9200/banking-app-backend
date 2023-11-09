const setXTotalCountHeader = (res, count) => {
    res.set('X-Total-Count', count)
}

module.exports = { setXTotalCountHeader }