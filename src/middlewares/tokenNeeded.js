const { tokenExists } = require('../models/tokenModel');

const { tokenToGetID } = require('../validations/token');
const { fieldToToken } = require('../validations/requiredFields');

const { errors } = require('../messages/error');

const authorizationToken = async (req, res, next) => {
    const authorization = req.header('Authorization');
    
    if(!authorization) {
        return res.status(400).json(errors.accountX);
    }

    const token = authorization.replace('Bearer', "").trim();

    const validations = fieldToToken({ token });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    
    try {
        const jwtID = tokenToGetID({ req });

        const validToken = await tokenExists({ jwtID });
        if (validToken === 0) {
            return res.status(400).json(errors.tokenX);
        }

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { authorizationToken };