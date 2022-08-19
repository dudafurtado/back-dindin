const securePassword = require('secure-password');
const pwd = securePassword();

const { passwordCrypted } = require('../validations/password');
const { fieldsToUser, fieldsToLogin } = require('../validations/requiredFields');
const { creatingToken, tokenToGetID, tokenToGetEmail } = require('../validations/token');

const userModel = require('../models/usersModel');
const messages = require('../messages/messages');

const userFirstAccess = async (req, res) => {
    const { name, email, password } = req.body;

    const validations = fieldsToUser({ name, email, password });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const userExists = await userModel.userByEmail({ email });
        if (userExists > 0) {
            return res.status(400).json(messages.userExists);
        }

        const hash = await passwordCrypted({ password });

        const userCreated = await userModel.userAdded({ name, email, hash })
        if (userCreated === 0) {
            return res.status(400).json(messages.couldNotSignin);
        }

        return res.status(200).json(messages.userCreated);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const userLogIn = async (req, res) => {
    const { email, password } = req.body;
    
    const validations = fieldsToLogin({ email, password });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const userExists = await userModel.userByEmail({ email });
        if (userExists === 0) {
            return res.status(400).json(messages.loginIncorrect);
        }
        
        const userData = await userModel.getUser({ email });

        const result = await pwd.verify(Buffer.from(password), Buffer.from(userData.password, "hex"));
        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json(messages.loginIncorrect);
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = await passwordCrypted({ password });
                    await userModel.userPasswordUpdated({ hash, email });
                } catch (error) {
                }
                break;
        }

        const token = creatingToken({ user: userData });

        return res.send({
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json(error.message);
    };
};

const informationToTheUserHimself = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    try {
        const { rowCount, rows } = await userModel.getUserForHimself({ jwtID });
        if (rowCount === 0) {
            return res.status(404).json(messages.userNotFound);
        }

        const { password: __, ...outrosDados } = rows[0];
        return res.status(201).json({
            ...outrosDados,
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const userUpdate = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const jwtEmail = tokenToGetEmail({ req })
    
    const { name, email, password } = req.body;

    const validations = fieldsToUser({ name, email, password });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    
    try {
        if (email !== jwtEmail) {
            const { rowCount } = await userModel.userByEmail({ email });

            if (rowCount > 0) {
            return res.status(404).json(messages.userExists);
            }
        }

        const hash = (await pwd.hash(Buffer.from(password))).toString("hex");

        const userUpdate = await userModel.userUpdated({ name, email, hash, jwtID })
            if (userUpdate === 0) {
            return res.status(500).json(messages.couldNotUpdateUser);
        }

        return res.status(200).json(messages.userUpdated);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

module.exports = {
    userFirstAccess,
    userLogIn,
    userUpdate,
    informationToTheUserHimself
};