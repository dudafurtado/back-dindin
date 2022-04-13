const { errors } = require('../messages/error')

const requiredFields = ({ descricao, valor, data, categoria_id, tipo}) => {
    if (!descricao) {
        const response = {
            message: errors.descriptionX,
            ok: false
        }
    }

    if (!valor) {
        const response = {
            message: errors.priceX,
            ok: false
        }
    }

    if (!data) {
        const response = {
            message: errors.dateX,
            ok: false
        }
    }

    if (!categoria_id) {
        const response = {
            message: errors.categoryIDX,
            ok: false
        }
    }

    if (!tipo) {
        const response = {
            message: errors.typeX,
            ok: false
        }
    } else if (tipo !== 'entrada' && tipo !== 'saída') {
        const response = {
            message: errors.wrongType,
            ok: false
        }
    }

    return { ok: true }
}

module.exports = { requiredFields }