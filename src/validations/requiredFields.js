const requiredFields = ({ descricao, valor, data, categoria_id, tipo }) => {
    if (!descricao) {
        return res.status(400).json("É necessário descrever a transação.");
    }

    if (!valor) {
        return res.status(400).json("É necessário definir o valor da transação.");
    }

    if (!data) {
        return res.status(400).json("É necessário indicar a data transação.");
    }

    if (!categoria_id) {
        return res.status(400).json("É necessário indicar em qual categoria se encaixa a transação.");
    }

    if (!tipo) {
        return res.status(400).json("É necessário informar qual o tipo da transação.");
    } else if (tipo !== 'entrada' || tipo !== 'saída') {
        return res.status(400).json('O tipo indicado não existe')
    }

}

module.exports = {
    requiredFields
}