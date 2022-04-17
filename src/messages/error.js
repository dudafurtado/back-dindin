const errors = {
    userExists: 'Já existe um usuário cadastrado com o e-mail informado.',
    couldNotSignin: 'Não foi possivel cadastrar o usuário.',
    loginIncorrect: 'Email ou senha incorretos.',
    userNotFound: 'Usuário não encontrado.',
    nameX: 'O Campo nome é obrigatorio.',
    emailX: 'O Campo email é obrigatório.',
    passwordX: 'O Campo senha é obrigatorio.',
    transNonexistent: 'Não foi possível encontrar transação',
    catNonexistent: 'A categoria indicada não existe',
    transNotPossible: 'Não foi possível adicionar essa transação',
    transSuccess: 'Transação deletada com sucesso',
    descriptionX: 'É necessário descrever a transação.',
    priceX: 'É necessário definir o valor da transação.',
    dateX: 'É necessário indicar a data transação.',
    categoryIDX: 'É necessário indicar em qual categoria se encaixa a transação.',
    typeX: 'É necessário informar qual o tipo da transação.',
    wrongType: 'O tipo indicado não existe.',
    accountX: 'É preciso ter uma conta para ver as transações',
    tokenX: 'Para acessar este recurso um token de autenticação válido deve ser enviado.'
}

module.exports = { errors }