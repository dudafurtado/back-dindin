const securePassword = require('secure-password');
const pwd = securePassword();

const { passwordCrypted } = require('../validations/password');
const { fieldsToUser, fieldsToLogin } = require('../validations/requiredFields');
const { creatingToken, tokenToGetID, tokenToGetEmail } = require('../validations/token');
const userModel = require('../models/usersModel');

const { errors } = require('../messages/error');

const userFirstAccess = async (req, res) => {
    const { nome, email, senha } = req.body;

    const validations = fieldsToUser({ nome, email, senha });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const userExists = await userModel.userByEmail({ email });
        if (userExists > 0) {
            return res.status(400).json(errors.userExists);
        }

        const hash = await passwordCrypted({ senha });

        const userCreated = await userModel.userAdded({ nome, email, hash })
        if (userCreated === 0) {
            return res.status(500).json(errors.couldNotSignin);
        }

        const userData = await userModel.getUser({ email });

        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const userLogIn = async (req, res) => {
    const { email, senha } = req.body;
    
    const validations = fieldsToLogin({ email, senha });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const userExists = await userModel.userByEmail({ email });
        if (userExists === 0) {
            return res.status(400).json(errors.loginIncorrect);
        }
        
        const userData = await userModel.getUser({ email });

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(userData.senha, "hex"));
        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json(errors.loginIncorrect);
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = await passwordCrypted({ senha });
                    await userModel.userPasswordUpdated({ hash, email });
                } catch (error) {
                }
                break;
        }

        const token = creatingToken({ user: userData });

        return res.send({
            usuarios: {
                id: userData.id,
                nome: userData.nome,
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
            return res.status(404).json(errors.userNotFound);
        }

        const { senha: _, ...outrosDados } = rows[0];
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
    
    const { nome, email, senha } = req.body;

    const validations = fieldsToUser({ nome, email, senha });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    
    try {
        if (email !== jwtEmail) {
            const { rowCount } = await userModel.userByEmail({ email });

            if (rowCount > 0) {
            return res.status(404).json(errors.userExists);
            }
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

        const userUpdate = await userModel.userUpdated({ nome, email, hash, jwtID })
            if (userUpdate === 0) {
            return res.status(500).json(errors.couldNotUpdateUser);
        }

        return res.status(200).json('Usúario atualizado com sucesso');
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