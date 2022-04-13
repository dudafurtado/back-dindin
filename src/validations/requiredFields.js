const { errors } = require('../messages/error')

const requiredFields = ({ descricao, valor, data, categoria_id, tipo, res }) => {
    if (!descricao) {
        return res.status(400).json(errors.descriptionX);
    }

    if (!valor) {
        return res.status(400).json(errors.priceX);
    }

    if (!data) {
        return res.status(400).json(errors.dateX);
    }

    if (!categoria_id) {
        return res.status(400).json(errors.categoryIDX);
    }

    if (!tipo) {
        return res.status(400).json(errors.typeX);
    } else if (tipo !== 'entrada' && tipo !== 'saída') {
        return res.status(400).json(errors.wrongType);
    }
}

module.exports = { requiredFields }