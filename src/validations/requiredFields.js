const { errors } = require('../messages/error')

const requiredFields = ({ descricao, valor, data, categoria_id, tipo}) => {
    if (!descricao) {
        const response = {
            message: errors.descriptionX,
            ok: false
        }
        return response;
    }

    if (!valor) {
        const response = {
            message: errors.priceX,
            ok: false
        }
        return response;
    }

    if (!data) {
        const response = {
            message: errors.dateX,
            ok: false
        }
        return response;
    }

    if (!categoria_id) {
        const response = {
            message: errors.categoryIDX,
            ok: false
        }
        return response;
    }

    if (!tipo) {
        const response = {
            message: errors.typeX,
            ok: false
        }
        return response;
    } else if (tipo !== 'entrada' && tipo !== 'saída') {
        const response = {
            message: errors.wrongType,
            ok: false
        }
        return response;
    }

    return { ok: true }
}

module.exports = { requiredFields }