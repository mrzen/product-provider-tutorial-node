const { createHmac } = require('crypto');

const PUBLIC_CREDENTIAL = 'public',
      PRIVATE_CREDENTIAL = process.env.PRIVATE_CREDENTIAL || 'dummy';

module.exports = function(req, res, next) {
    const requestSignature = req.headers['x-request-signature'];
    
    if (!requestSignature) {
        res.status(401).json({ error: "X-Request-Signature missing" });
        return;
    }
    
    // Split the signature into its parts...
    const [credentialId, timestamp, signature] = requestSignature.split(' ');
    
    // Check the public credential matches...
    if (credentialId !== PUBLIC_CREDENTIAL) {
        res.status(401).json({ error: 'Invalid Credentials'});
        return;
    }
    
    // Check the timestamp is recent...
    const now = Date.now();
    const requestTimestamp = parseInt(timestamp, 10) * 1000; // Convert timestamp to milliseconds...
    
    // Check that the timestamp is within 5 minutes of now
    if (Math.abs(now - requestTimestamp) > 300_000) {
        res.status(401).json({ error: 'Invalid timestamp' });     
        return;
    }
    
    // Check the signature...
    const hmac = createHmac('sha256', PRIVATE_CREDENTIAL);
    hmac.write(timestamp);
    
    if (req.method === 'POST') {
        hmac.write(req.body.slice(0, 1024));
    }
    
    const correctSignature = hmac.digest().toString('hex');
    const [_, givenSiganture] = signature.split(':');
    
    if (givenSiganture !== correctSignature) {
        res.status(401).json({error: 'Invalid signature'});
        return;
    }
    
    // Authentication passed, move onto the next handler...
    return next();
}