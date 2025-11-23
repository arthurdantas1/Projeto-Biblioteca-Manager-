# 📚 Sistema de Gerenciamento de Biblioteca

### Aplicação Web simples e funcional usando HTML, CSS e JavaScript

Este projeto é um sistema completo para gerenciamento de uma biblioteca,
permitindo o controle de **usuários, livros e empréstimos**.\
Ele funciona 100% no navegador, usando **LocalStorage** para armazenar
os dados --- sem necessidade de servidor.

------------------------------------------------------------------------

## 🚀 Funcionalidades

### ✔️ Usuários

-   Cadastro de novos usuários\
-   Edição e exclusão\
-   Impede excluir usuários com empréstimos ativos

### ✔️ Livros

-   Cadastro de livros (título, autor, ano, gênero)\
-   Edição e exclusão\
-   Controle de disponibilidade (emprestado / disponível)

### ✔️ Empréstimos

-   Registro de empréstimos\
-   Listagem completa\
-   Devolução de livros\
-   Só permite empréstimos se houver usuários e livros disponíveis

### ✔️ Outros Recursos

-   Design moderno e responsivo\
-   Navegação por abas\
-   Modais elegantes\
-   Sistema de notificações (toasts)\
-   Dashboard com estatísticas atualizadas automaticamente

------------------------------------------------------------------------

## 📁 Estrutura do Projeto

    📦 biblioteca/
     ├── index.html          # Estrutura visual da aplicação
     ├── biblioteca.css      # Estilos da interface
     ├── biblioteca.js       # Lógica do sistema

------------------------------------------------------------------------

## 🧩 Como Executar

1.  Coloque os três arquivos na mesma pasta.
2.  Abra **index.html** no navegador.
3.  A aplicação já estará funcionando.

Não é necessário instalar nada. Nenhum servidor é requerido.

------------------------------------------------------------------------

## 💾 Armazenamento

Os dados são salvos automaticamente no **LocalStorage**, usando as
chaves:

-   `biblioteca_usuarios`
-   `biblioteca_livros`
-   `biblioteca_emprestimos`

Os dados permanecem enquanto não forem apagados manualmente.

------------------------------------------------------------------------

## 🛠️ Tecnologias Utilizadas

-   **HTML5**
-   **CSS3**
-   **JavaScript Puro (Vanilla JS)**
-   **LocalStorage**

------------------------------------------------------------------------

## 🌟 Melhorias Futuras (opcional)

-   Filtros e buscas nas tabelas\
-   Exportação de relatórios (PDF/CSV)\
-   Página de login\
-   Versão com backend real (Node, PHP, Firebase etc.)\
-   Dashboard com gráficos

------------------------------------------------------------------------

## 📄 Licença

Este projeto é livre para estudos, modificações e uso pessoal.
