'use strict';
const url = require('url');
const uuid = require('uuidv4');
const request = require('request');
const rp = require('request-promise');

const config = require('./config.json');

const Storage = require('@google-cloud/storage');
const storage = new Storage({
	projectId: config.project_id,
	keyFilename: config.keys.cloud_storage.path
});


function parseURL(urlString) {
	try {
		return url.parse(urlString);
	}
	catch(e) {
		//
	}
	console.log('index.js, parseURL not written');
	//return(url);
}

function checkURLStatus(url) {
	return new Promise((resolve, reject) => {
		const request = require('request');

		request({method: 'HEAD', url}, function (error, response) {
			if(error || response.statusCode !== 200) {
				reject({url, statusCode:response.statusCode, error:error?error:'inaccessibleURL', message:'Remote URL could not be reached.'});
			}
			resolve(url);
		});
	});
}

/**
* verifyURL - pre-upload checks to ensure we notify client of failures prior to attempted upload.
**/
function verifyURL(url) {
	return new Promise((resolve, reject) => {
		if(!parseURL(url))
			reject({url, error:'invalidURL', message:'URL could not be parsed. Please check that URL is valid'});
		else {
			checkURLStatus(url)
				.then(resolve)
				.catch(reject);
		}
	});
}

// For testing
async function uploadLocalFile(fileName, bucketName) {
	await storage.bucket(bucketName).upload(fileName, {
		gzip: true,
		metadata: {
			cacheControl: 'public, max-age=31536000',
		},
	});
}

/*
const bucket = gcs.bucket('bucket_name');
const gcsname = 'test.pdf';
const file = bucket.file(gcsname);
var pdfdata = "binary_pdf_file_string";
var buff = Buffer.from(pdfdata, 'binary').toString('utf-8');

const stream = file.createWriteStream({
	metadata: {
		contentType: 'application/pdf'
	}
});
stream.on('error', (err) => {
	console.log(err);
});
stream.on('finish', () => {
	console.log(gcsname);
});
stream.end(new Buffer(buff, 'base64'));
*/

function uploadByURL(url, endpoint, location) {
	//let message = { uploadedFiles: `${imageURL}` };
	let file = myBucket.file('my-file');
	request(url)
		.pipe(endpoint.upload());

	//res.status(200).json(message);x
}

function getImage(req, res) {
	let message = req.query.message || req.body.message || 'Hello World!';
	switch (req.get('content-type')) {
		case 'application/JSON':

			break;
		case 'image/jpeg':

			break;
		case 'image/png':

			break;
	}
	res.status(200).send(message);
}


// Lambdas
exports.image = (req, res) => {
	if(!res.body.urls) res.status(400).json({error:'noURLs', message:'No URLs were provided.'});
	let urls = res.body.urls;
	switch(req.method) {
		case 'POST':
			Promise.all(
				urls.map((url) => {
					return verifyURL(url)
						.then(uploadByURL);
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

exports.upload = (req, res) => {

	res.status(200).send({});
};
