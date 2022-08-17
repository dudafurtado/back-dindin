const message = require('../messages/messages')

const fieldsToTransactions = ({ description, value, date, category_id, type }) => {
    if (!description) {
        const response = {
            message: message.descriptionX,
            ok: false
        }
        return response;
    }

    if (!value) {
        const response = {
            message: message.priceX,
            ok: false
        }
        return response;
    }

    if (!date) {
        const response = {
            message: message.dateX,
            ok: false
        }
        return response;
    }

    if (!category_id) {
        const response = {
            message: message.categoryIDX,
            ok: false
        }
        return response;
    }

    if (!type) {
        const response = {
            message: message.typeX,
            ok: false
        }
        return response;
    } else if (type.toLowerCase() !== 'entrada' && type.toLowerCase() !== 'saida') {
        const response = {
            message: message.wrongType,
            ok: false
        }
        return response;
    }

    return { ok: true }
}

const fieldsToUser = ({ name, email, password }) => {
    
    if (!name) {
        const response = {
            message: message.nameX,
            ok: false
        }
        return response;
    }

    if (!email) {
        const response = {
            message: message.emailX,
            ok: false
        }
        return response;
    }

    if (!password) {
        const response = {
            message: message.passwordX,
            ok: false
        }
        return response;
    }

    return { ok: true }
}

const fieldsToLogin = ({ email, password }) => {
    if (!email) {
        const response = {
            message: message.emailX,
            ok: false
        }
        return response;
    }

    if (!password) {
        const response = {
            message: message.passwordX,
            ok: false
        }
        return response;
    }

    return { ok: true }
}

const fieldToToken = ({ token }) => {
    if (!token) {
        const response = {
            message: message.accountX,
            ok: false
        }
        return response;
    }

    return { ok: true }
}

module.exports = { 
    fieldsToTransactions,
    fieldsToUser,
    fieldsToLogin,
    fieldToToken
 }