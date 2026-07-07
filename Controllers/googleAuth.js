const { OAuth2Client } = require('google-auth-library');
   require('dotenv').config()
const jwt = require('jsonwebtoken')

   const client = new OAuth2Client(process.env.CLIENT_ID);
const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience:process.env.CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        const appToken = jwt.sign({ email, name }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Authentication successful',
            token: appToken,
            user: { email, name, picture }
        });


    }catch (error) {
        console.error('Error verifying Google ID token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }   
}

module.exports = { googleAuth };
    