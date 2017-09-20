const fs = require('fs')
const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

AWS.config.update({region: process.env.AWS_REGION || 'us-west-2'})
const s3 = new AWS.S3()

function uploadJSON (bucket, fileName, content, acl = 'private', maxAge) {
  console.log('bucket', bucket);
  console.log('fileName', fileName);
  console.log('acl', acl);
  console.log('maxAge', maxAge);

  // only stringify if not already a string
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  const opts = {
    Bucket: bucket,
    Key: fileName,
    ACL: acl,
    ContentType: 'application/json',
    CacheControl: 'max-age=' + maxAge,
    Body: Buffer.from(content).toString('utf8')
  }

  console.log('opts', opts)

  return s3.upload(opts).promise()
}

function uploadBuffer (bucket, fileName, content, contentType, contentLength, acl = 'private', maxAge = 604800) {
  const options = {
    Bucket: bucket,
    Key: fileName,
    ACL: acl,
    CacheControl: 'max-age=' + maxAge,
    ContentType: contentType,
    ContentLength: contentLength,
    Body: content
  }
  return s3.upload(options).promise()
}

function getJSONFile (bucket, fileName) {
  const options = {
    Bucket: bucket,
    Key: fileName,
    ResponseContentType: 'application/json'
  }
  return s3.getObject(options).promise()
  .then((data) => {
    const fileContents = data.Body.toString()
    return Promise.resolve(JSON.parse(fileContents))
  })
}

function get (bucket, fileName) {
  const options = {
    Bucket: bucket,
    Key: fileName
  }
  return s3.getObject(options).promise()
}

function getStream (bucket, fileName, contentType) {
  const options = {
    Bucket: bucket,
    Key: fileName,
    ResponseContentType: contentType
  }
  return s3.getObject(options).createReadStream()
}

function download (bucket, fileName, destination = './') {
  return new Promise(function (resolve, reject) {
    const opts = {
      Bucket: bucket,
      Key: fileName
    }

    let reader = s3.getObject(opts).createReadStream()
    let writer = fs.createWriteStream(destination + fileName)

    reader.pipe(writer)

    writer.on('error', function (err) {
      return reject(err)
    })
    reader.on('error', function (err) {
      return reject(err)
    })
    reader.on('end', function () {
      return resolve()
    })
  })
}

function listObjectsFull (bucket) {
  let contents = []

  function recursiveGet (marker, isTruncated) {
    if (!isTruncated) {
      return Promise.resolve()
    }
    console.log('m', marker)
    return listObjects(bucket, marker)
    .then((data) => {
      let dataTruncated = data.IsTruncated
      if (dataTruncated) {
        let length = data.Contents.length
        marker = data.Contents[length - 1].Key
      }
      contents.push(data.Contents)
      return recursiveGet(marker, dataTruncated)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
  }

  return recursiveGet(false, true)
  .then(() => {
    return Promise.resolve(contents)
  })
}

function listObjects (bucket, marker) {
  const params = { Bucket: bucket }

  if (marker) {
    params.Marker = marker
  }

  return s3.listObjects(params).promise()
}

function remove (bucket, fileName) {
  const options = {
    Bucket: bucket,
    Key: fileName
  }
  return s3.deleteObject(options).promise()
}

module.exports = {
  uploadJSON,
  uploadBuffer,
  getJSONFile,
  get,
  getStream,
  download,
  listObjects,
  listObjectsFull,
  remove
}
