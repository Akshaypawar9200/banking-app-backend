/* eslint-disable global-require */
// function gcpDecode(options) {
//   console.log(`[GCPDecode] : options Received : ${options}`);
//   const gcpDecodeBase64 = function (req, res, next) {
//     const userInfo = req.get('X-Apigateway-Api-Userinfo');
//     const buff = Buffer.from(userInfo, 'base64');
//     const decodedUserInfo = JSON.parse(buff.toString('ascii'));
//     req.user = decodedUserInfo;
//     console.log(
//       `GCPDecodeLog | userInfo - ${userInfo} | decodedUserInfo - ${decodedUserInfo}`,
//     );
//     next();
//   };
//   gcpDecodeBase64.unless = require('express-unless');
//   return gcpDecodeBase64;
// }


const createSignedURL = async (storage, bucketName, fileLocation, options) => {
  // signedURL options
  if (!options) {
    options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 10 * 60 * 1000, // 30 minutes
      contentType: 'text/csv',
    };
  }

  const bucket = storage.bucket(bucketName);

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(`${fileLocation}`)
    .getSignedUrl(options);
  return url
}


module.exports = { createSignedURL };
