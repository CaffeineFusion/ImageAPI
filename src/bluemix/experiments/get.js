'use strict';

const Storage = require('ibm-cos-sdk');

const config = require('./../config.json');
const key = require('./../keys/ibm_storage.json');

const s3Config = {
	endpoint: 's3.au-syd.cloud-object-storage.appdomain.cloud',
	apiKeyId: key.apikey,
	ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
	serviceInstanceId: key.resource_instance_id,
};

let storage = new Storage.S3(s3Config);

/**
 * Returns a Signed URL to access the uploaded file
 * TODO: set expiry date to match the bucket's expiry rules for files
 */
function getURL(fileName, bucketName) {
	let params = { Bucket: bucketName, Key: fileName, Expires: 600 };
	return new Promise((resolve, reject) => {
		storage.getSignedUrl('getObject', params, function(err, url) { // Doesn't work with SigV4 :(
			if (err) reject(err);
			else resolve(url);
		});
	});
}

exports.get = function (fileName) {
	return getURL(fileName, config.bucket_name);
};


/*
HMAC Requirements:
- All requests must have an x-amz-date header with the date in %Y%m%dT%H%M%SZ format.
- Any request that has a payload (object uploads, deleting multiple objects, etc.) must provide a x-amz-content-sha256 header with a SHA256 hash of the payload contents.
- ACLs (other than public-read) are unsupported.

 */
