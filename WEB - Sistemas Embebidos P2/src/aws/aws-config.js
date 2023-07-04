import AWS from 'aws-sdk';

const awsEndpoint = '';
const awsRegion = '';
const accessKeyId = '';
const secretAccessKey = '';

AWS.config.update({
    region: awsRegion,
    credentials: new AWS.Credentials({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    })
});

export default AWS;
