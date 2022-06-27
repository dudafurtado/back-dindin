create database dindin;

create table usuarios (
    id serial primary key not null,
    nome text not null,
    email varchar(50) not null unique,
    senha text not null
);

create table categorias (
    id serial primary key not null,
    descricao text not null
);

create table transacoes (
    id serial primary key not null,
    descricao text,
    valor integer not null,
    data date not null,
    categoria_id integer references categorias(id) not null,
    usuario_id integer references usuarios(id) not null,
    tipo text
);

insert into categorias (descricao)
values ('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');