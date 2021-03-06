'use strict';

const request = require('request');
const path = require('path');
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

// Returns a Promise object which resolves to a stream.
function uploadByURL(url, bucket, fileName) {
	return new Promise((resolve, reject) => {
		request(url)
			.on('response', (response) => { response.pause(); resolve(response); })
			.on('error', (reject));
	}).then((response) => {
		return storage.upload({ Bucket:bucket, Key:fileName, Body:response }) //putObject did not work for streams due to Sigv4
			.promise();
	})
		.catch((error) => { return { error }; }); // TODO: Add more detailed error handling. - statusCode etc.
}

exports.upload = function (url) {
	return uploadByURL(url, config.bucket_name, path.basename(url));
};

/**
 *
 * function _uploadFile(incomingFd, incomingFileStream, handleProgress, s3ClientOpts, done) {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
  var s3ManagedUpload = _buildS3Client(s3ClientOpts)
  .upload(_stripKeysWithUndefinedValues({
    Bucket: s3ClientOpts.bucket,
    Key: incomingFd.replace(/^\/+/, ''),//« remove any leading slashes
    Body: incomingFileStream,
    ContentType: mime.lookup(incomingFd)//« advisory; makes things nicer in the S3 dashboard
  }), (err, rawS3ResponseData)=>{
    if (err) {
      return done(err);
    } else {
      return done(undefined, {
        rawS3ResponseData
      });
    }
  });//_∏_

  s3ManagedUpload.on('httpUploadProgress', (event)=>{
    // console.log('upload progress');
    let written = _.isNumber(event.loaded) ? event.loaded : 0;
    let total = _.isNumber(event.total) ? event.total : undefined;
    let handledSuccessfully = handleProgress(_stripKeysWithUndefinedValues({
      name: incomingFileStream.filename || incomingFd,
      fd: incomingFd,
      written,
      total,
      percent: total ? (written / total) : undefined
    }));
    if (!handledSuccessfully) {
      s3ManagedUpload.abort();
    }
  });//œ

}//ƒ

//for future exploration:

//https://github.com/IBM-Cloud/node-file-upload-S3/blob/master/server.js
//https://github.com/balderdashy/skipper-s3/blob/master/index.js
 */
