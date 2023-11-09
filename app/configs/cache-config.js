DEFAULT_CACHE_CONFIG = Object.freeze({
    // You can over ride stdTTL in cache.set(key,object,stdTTL)
    // stdTTL: 20, // expiry in 20 seconds(testing)
    stdTTL: 24 * 60 * 60, // 1 day expiry
    checkperiod: 12 * 60 * 60, // Keep checking every 12 hours
    useClones: true,
    deleteOnExpire: true,
    enableLegacyCallbacks: false,
    maxKeys: 200
})

module.exports = { DEFAULT_CACHE_CONFIG }