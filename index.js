'use strict';
const url = require('url');
//const uuid = require('uuidv4');
const request = require('request');
//const rp = require('request-promise');

const config = require('./config.json');

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
	projectId: config.project_id,
	keyFilename: config.keys.cloud_storage.path
});

/**
 * verifyURL - confirm that the URL can be reached.
 * @param  {string} url
 * @return {Promise}    Promise resolves to the url or rejects with a JSON object as error.
 *
 * TODO: Add in more specific error messages for rejection and parsing errors:: {url, error:'invalidURL', message:'URL could not be parsed. Please check that URL is valid'}
 */
function verifyURL(path) {
	return new Promise((resolve, reject) => {
		request({method: 'HEAD', url:url.parse(path)}, function (error, response) { // Availability of HEAD method not guaranteed. Refactor.
			if(error || response.statusCode !== 200)
				reject({url, statusCode:response.statusCode, error:error?error:'inaccessibleURL', message:'Remote URL could not be reached.'});
			resolve(path);
		});
	});
}

/* // Testing purposes:
async function uploadLocalFile(bucket, fileName) {
	await bucket.upload(fileName, { gzip: true });
}
*/

// Returns a Promise object which resolves to a stream.
function uploadByURL(url, bucket, fileName) {
	let file = bucket.file(fileName);
	return new Promise((resolve, reject) => {
		request(url)
			.on('response', (response) => { response.pause(); resolve(response); })	// Create, then pause and return the stream
			.on('error', (reject));
	}).then((response) => { return response.pipe(file.createWriteStream({ gzip: true })); })
		.catch((error) => { return { error }; }); // TODO: Add more detailed error handling. - statusCode etc.
}

function upload(url, fileName) {
	return uploadByURL(url, storage.bucket(config.bucket_name), fileName);
}

/**
 *
 * TODO: refactor to adapt based on content-type
 */
function getImage(req, res) {

	res.status(200).send();
}

/*
	switch (req.get('content-type')) {
		case 'application/JSON':
			break;
		case 'image/jpeg':
			break;
		case 'image/png':
			break;
	}
 */

// Lambdas
/**
 * images - /images webhook.
 */
exports.images = (req, res) => {
	if(!res.body.urls) res.status(400).json({error:'noURLs', message:'No URLs were provided.'});
	let urls = res.body.urls;
	switch(req.method) {
		case 'POST':
			// For each URL, verify, upload it, then aggregate the results to return as JSON object.
			Promise.all(
				urls.map((url) => {
					return verifyURL(url)
						.then((url) => { upload(url, url); }); // naming convention will likely need to change for multi-users
				})
			)
				// TODO: Change status IDs depending on error/s from Promises.
				.then(res.status(202).json)
				.catch(res.status(400).json);
			break;
		case 'GET':
			getImage(req, res);
			break;
	}
};
