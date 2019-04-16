[![Build Status](https://travis-ci.org/sportradarus/sr-s3.svg?branch=master)](https://travis-ci.org/sportradarus/sr-s3) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/badge/npm-v3.8.6-blue.svg)]() [![node](https://img.shields.io/badge/node-v6.10.0-blue.svg)]()
# sr-s3 by Sportradar 

A wrapper for common S3 tasks.  All functions are promisfied

### Install

you can install this module using `npm i`. However since the package is not in the NPM registry you have to use a git URL in your package.json. You can limit by version by referencing a release tag.

For Example

```
 "sr-s3": "sportradarus/sr-s3#0.0.1"
```  

### AWS Configuration

There are several options to set credentials for AWS. See AWS [docs](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) 
* Configuration
- You can store your credentials in `~/.aws/credentials` or `~/.aws/config` or by running  `aws configure`

* Environment Variables
```sh
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

```

However you chose to do it, this module relies that your environment has your aws credentials set.

Example Usage

```js
const s3 = require('sr-s3')
return s3.getJSONFile('somebucket', 'somefile.json')
```

### s3.remove(bucket, file)
Deletes the specified file from S3

* `bucket` bucket name
* `file` the file to be deleted

Returns an Object containing:
* `S3 Delete Marker`
* `S3 VersionId`

### s3.uploadJSON(bucket, fileName, content, acl, maxAge)
uploads a json file to s3

* `bucket` destination bucket name
* `fileName` the file name
* `content` the JSON object to be stored
* [`acl`]  S3 Access Control Lists (e.g. private, public-read, etc) --defaults to private
* [`maxAge`] used for setting cache-control max age --defaults to 1800

Returns an object containing:
* `S3 location`
* `S3 e-tag`
* `S3 bucket name`
* `S3 key`


### s3.upload(bucket, fileName, content, contentType, contentLength, acl, maxAge) 
upload to s3

* `bucket` destination bucket name
* `fileName` the file name
* `content` the content stored
* `contentType` the type of content
* [`contentLength`] the total length of the content --defaults to undefined
* [`acl`]  S3 Access Control Lists (e.g. private, public-read, etc) --defaults to private
* [`maxAge`] used for setting cache-control max age --defaults to 0

Returns an object containing:
* `S3 location`
* `S3 e-tag`
* `S3 bucket name`
* `S3 key`

### s3.getJSONFile(bucket, fileName)
gets a json file from S3

* `bucket` bucket name
* `fileName` the json file to get

Returns a JSON file

### s3.get(bucket, fileName)
gets a file from S3

* `bucket` bucket name
* `fileName` the file to get

Returns the requested file contents

### s3.getStream(bucket, fileName)
gets a json file from S3

* `bucket` bucket name
* `fileName` the json file to get

Returns a read stream

### s3.getSignedUrl(operation, bucket, fileName)
gets a signed URL for the file in S3

* `operation` name of the operation to call: _getObject_ or _putObject_
* `bucket` bucket name
* `fileName` the file to get the URL for

Returns a URL

### s3.download(bucket, fileName, destination)
downloads a file from S3

* `bucket` bucket name
* `fileName` the file name
* `destination` the directory to which the file should be downloaded. --defaults to current directory

### s3.listObjects(bucket, marker)
list objects from a bucket. The marker param is optional and is only used if paging through results.

* `bucket` bucket name
* `marker` optional parameter used for paging

Returns an object containing:
* `IsTruncted`
* `Marker`
* `Name`
* `Prefix`
* `Delimiter`
* `MaxKeys`
* `CommonPrefixes`
* `EncodingType`
* `Contents`
See [AWS docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property) for more information 


### s3.listObjectsFull(bucket)
paged implementation of listObjects.  Recursively loops through bucket until the data is no longer being truncated (i.e. IsTruncated = false).

* `bucket` bucket name

Returns an object containing:
* `Name`
* `Prefix`
* `Delimiter`
* `MaxKeys`
* `CommonPrefixes`
* `EncodingType`
* `Contents`
See [AWS docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property) for more information 

It should be noted that this module relies on at least node 6.1











