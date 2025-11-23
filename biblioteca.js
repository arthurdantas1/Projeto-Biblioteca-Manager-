// Sistema de Gerenciamento de Biblioteca - JavaScript Vanilla

// ============= INICIALIZAÇÃO =============
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistema();
    carregarDados();
    atualizarEstatisticas();
});

// ============= GERENCIAMENTO DE DADOS (LocalStorage) =============

function carregarDados() {
    const usuarios = obterUsuarios();
    const livros = obterLivros();
    const emprestimos = obterEmprestimos();

    renderizarUsuarios(usuarios);
    renderizarLivros(livros);
    renderizarEmprestimos(emprestimos);
}

function obterUsuarios() {
    const dados = localStorage.getItem('biblioteca_usuarios');
    return dados ? JSON.parse(dados) : [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem('biblioteca_usuarios', JSON.stringify(usuarios));
}

function obterLivros() {
    const dados = localStorage.getItem('biblioteca_livros');
    return dados ? JSON.parse(dados) : [];
}

function salvarLivros(livros) {
    localStorage.setItem('biblioteca_livros', JSON.stringify(livros));
}

function obterEmprestimos() {
    const dados = localStorage.getItem('biblioteca_emprestimos');
    return dados ? JSON.parse(dados) : [];
}

function salvarEmprestimos(emprestimos) {
    localStorage.setItem('biblioteca_emprestimos', JSON.stringify(emprestimos));
}

// ============= SISTEMA DE NAVEGAÇÃO =============

function inicializarSistema() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            trocarAba(tabId);
        });
    });
}

function trocarAba(tabId) {
    // Remove active de todos os botões e conteúdos
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Adiciona active no botão e conteúdo selecionado
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');

    // Atualiza dados se necessário
    if (tabId === 'inicio') {
        atualizarEstatisticas();
    }
}

// ============= ESTATÍSTICAS =============

function atualizarEstatisticas() {
    const usuarios = obterUsuarios();
    const livros = obterLivros();
    const emprestimos = obterEmprestimos();

    const livrosDisponiveis = livros.filter(livro => livro.disponivel).length;
    const emprestimosAtivos = emprestimos.filter(emp => emp.status === 'ativo').length;

    document.getElementById('total-usuarios').textContent = usuarios.length;
    document.getElementById('total-livros').textContent = livros.length;
    document.getElementById('livros-disponiveis').textContent = livrosDisponiveis;
    document.getElementById('emprestimos-ativos').textContent = emprestimosAtivos;
}

// ============= GERENCIAMENTO DE USUÁRIOS =============

function abrirModalUsuario(usuarioId = null) {
    const modal = document.getElementById('modal-usuario');
    const form = document.getElementById('form-usuario');
    const titulo = document.getElementById('modal-usuario-titulo');

    form.reset();

    if (usuarioId) {
        const usuarios = obterUsuarios();
        const usuario = usuarios.find(u => u.id === usuarioId);
        
        if (usuario) {
            titulo.textContent = 'Editar Usuário';
            document.getElementById('usuario-id').value = usuario.id;
            document.getElementById('usuario-nome').value = usuario.nome;
            document.getElementById('usuario-email').value = usuario.email;
        }
    } else {
        titulo.textContent = 'Cadastrar Usuário';
        document.getElementById('usuario-id').value = '';
    }

    modal.classList.add('active');
}

function fecharModalUsuario() {
    document.getElementById('modal-usuario').classList.remove('active');
}

function salvarUsuario(event) {
    event.preventDefault();

    const id = document.getElementById('usuario-id').value;
    const nome = document.getElementById('usuario-nome').value.trim();
    const email = document.getElementById('usuario-email').value.trim();

    // Validação
    if (!nome || !email) {
        mostrarToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    const usuarios = obterUsuarios();

    if (id) {
        // Editar usuário existente
        const index = usuarios.findIndex(u => u.id === id);
        if (index !== -1) {
            usuarios[index] = { ...usuarios[index], nome, email };
            mostrarToast('Usuário atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo usuário
        const novoUsuario = {
            id: gerarId(),
            nome,
            email
        };
        usuarios.push(novoUsuario);
        mostrarToast('Usuário cadastrado com sucesso!', 'success');
    }

    salvarUsuarios(usuarios);
    renderizarUsuarios(usuarios);
    fecharModalUsuario();
    atualizarEstatisticas();
}

function renderizarUsuarios(usuarios) {
    const tbody = document.getElementById('tabela-usuarios');

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Nenhum usuário cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="abrirModalUsuario('${usuario.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="excluirUsuario('${usuario.id}')">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function excluirUsuario(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
    }

    // Verifica se há empréstimos ativos para este usuário
    const emprestimos = obterEmprestimos();
    const temEmprestimosAtivos = emprestimos.some(emp => emp.usuarioId === id && emp.status === 'ativo');

    if (temEmprestimosAtivos) {
        mostrarToast('Não é possível excluir usuário com empréstimos ativos', 'error');
        return;
    }

    let usuarios = obterUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);
    salvarUsuarios(usuarios);
    renderizarUsuarios(usuarios);
    mostrarToast('Usuário excluído com sucesso!', 'success');
    atualizarEstatisticas();
}

// ============= GERENCIAMENTO DE LIVROS =============

function abrirModalLivro(livroId = null) {
    const modal = document.getElementById('modal-livro');
    const form = document.getElementById('form-livro');
    const titulo = document.getElementById('modal-livro-titulo');

    form.reset();

    if (livroId) {
        const livros = obterLivros();
        const livro = livros.find(l => l.id === livroId);
        
        if (livro) {
            titulo.textContent = 'Editar Livro';
            document.getElementById('livro-id').value = livro.id;
            document.getElementById('livro-titulo').value = livro.titulo;
            document.getElementById('livro-autor').value = livro.autor;
            document.getElementById('livro-ano').value = livro.ano;
            document.getElementById('livro-genero').value = livro.genero;
        }
    } else {
        titulo.textContent = 'Cadastrar Livro';
        document.getElementById('livro-id').value = '';
    }

    modal.classList.add('active');
}

function fecharModalLivro() {
    document.getElementById('modal-livro').classList.remove('active');
}

function salvarLivro(event) {
    event.preventDefault();

    const id = document.getElementById('livro-id').value;
    const titulo = document.getElementById('livro-titulo').value.trim();
    const autor = document.getElementById('livro-autor').value.trim();
    const ano = document.getElementById('livro-ano').value;
    const genero = document.getElementById('livro-genero').value.trim();

    // Validação
    if (!titulo || !autor || !ano || !genero) {
        mostrarToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    const livros = obterLivros();

    if (id) {
        // Editar livro existente
        const index = livros.findIndex(l => l.id === id);
        if (index !== -1) {
            livros[index] = { ...livros[index], titulo, autor, ano: parseInt(ano), genero };
            mostrarToast('Livro atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo livro
        const novoLivro = {
            id: gerarId(),
            titulo,
            autor,
            ano: parseInt(ano),
            genero,
            disponivel: true
        };
        livros.push(novoLivro);
        mostrarToast('Livro cadastrado com sucesso!', 'success');
    }

    salvarLivros(livros);
    renderizarLivros(livros);
    fecharModalLivro();
    atualizarEstatisticas();
}

function renderizarLivros(livros) {
    const tbody = document.getElementById('tabela-livros');

    if (livros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Nenhum livro cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = livros.map(livro => `
        <tr>
            <td>${livro.id}</td>
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.ano}</td>
            <td>${livro.genero}</td>
            <td>
                <span class="badge ${livro.disponivel ? 'badge-success' : 'badge-danger'}">
                    ${livro.disponivel ? 'Disponível' : 'Emprestado'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="abrirModalLivro('${livro.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="excluirLivro('${livro.id}')">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function excluirLivro(id) {
    if (!confirm('Tem certeza que deseja excluir este livro?')) {
        return;
    }

    // Verifica se o livro está emprestado
    const livros = obterLivros();
    const livro = livros.find(l => l.id === id);

    if (livro && !livro.disponivel) {
        mostrarToast('Não é possível excluir livro emprestado', 'error');
        return;
    }

    const livrosAtualizados = livros.filter(l => l.id !== id);
    salvarLivros(livrosAtualizados);
    renderizarLivros(livrosAtualizados);
    mostrarToast('Livro excluído com sucesso!', 'success');
    atualizarEstatisticas();
}

// ============= GERENCIAMENTO DE EMPRÉSTIMOS =============

function abrirModalEmprestimo() {
    const modal = document.getElementById('modal-emprestimo');
    const form = document.getElementById('form-emprestimo');

    form.reset();

    // Preencher select de usuários
    const usuarios = obterUsuarios();
    const selectUsuario = document.getElementById('emprestimo-usuario');
    selectUsuario.innerHTML = '<option value="">Selecione um usuário</option>';
    
    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.id;
        option.textContent = usuario.nome;
        selectUsuario.appendChild(option);
    });

    // Preencher select de livros disponíveis
    const livros = obterLivros();
    const livrosDisponiveis = livros.filter(livro => livro.disponivel);
    const selectLivro = document.getElementById('emprestimo-livro');
    selectLivro.innerHTML = '<option value="">Selecione um livro disponível</option>';
    
    livrosDisponiveis.forEach(livro => {
        const option = document.createElement('option');
        option.value = livro.id;
        option.textContent = `${livro.titulo} - ${livro.autor}`;
        selectLivro.appendChild(option);
    });

    if (usuarios.length === 0) {
        mostrarToast('Cadastre usuários antes de fazer empréstimos', 'error');
        return;
    }

    if (livrosDisponiveis.length === 0) {
        mostrarToast('Não há livros disponíveis para empréstimo', 'error');
        return;
    }

    modal.classList.add('active');
}

function fecharModalEmprestimo() {
    document.getElementById('modal-emprestimo').classList.remove('active');
}

function salvarEmprestimo(event) {
    event.preventDefault();

    const usuarioId = document.getElementById('emprestimo-usuario').value;
    const livroId = document.getElementById('emprestimo-livro').value;

    if (!usuarioId || !livroId) {
        mostrarToast('Selecione usuário e livro', 'error');
        return;
    }

    const emprestimos = obterEmprestimos();
    const livros = obterLivros();

    // Criar empréstimo
    const novoEmprestimo = {
        id: gerarId(),
        usuarioId,
        livroId,
        dataEmprestimo: new Date().toISOString(),
        status: 'ativo'
    };

    emprestimos.push(novoEmprestimo);
    salvarEmprestimos(emprestimos);

    // Atualizar disponibilidade do livro
    const livro = livros.find(l => l.id === livroId);
    if (livro) {
        livro.disponivel = false;
        salvarLivros(livros);
    }

    renderizarEmprestimos(emprestimos);
    renderizarLivros(livros);
    fecharModalEmprestimo();
    mostrarToast('Empréstimo registrado com sucesso!', 'success');
    atualizarEstatisticas();
}

function renderizarEmprestimos(emprestimos) {
    const tbody = document.getElementById('tabela-emprestimos');

    if (emprestimos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum empréstimo registrado</td></tr>';
        return;
    }

    const usuarios = obterUsuarios();
    const livros = obterLivros();

    tbody.innerHTML = emprestimos.map(emprestimo => {
        const usuario = usuarios.find(u => u.id === emprestimo.usuarioId);
        const livro = livros.find(l => l.id === emprestimo.livroId);
        const data = new Date(emprestimo.dataEmprestimo).toLocaleDateString('pt-BR');

        return `
            <tr>
                <td>${emprestimo.id}</td>
                <td>${usuario ? usuario.nome : 'Usuário não encontrado'}</td>
                <td>${livro ? livro.titulo : 'Livro não encontrado'}</td>
                <td>${data}</td>
                <td>
                    <span class="badge ${emprestimo.status === 'ativo' ? 'badge-warning' : 'badge-success'}">
                        ${emprestimo.status === 'ativo' ? 'Ativo' : 'Devolvido'}
                    </span>
                </td>
                <td>
                    ${emprestimo.status === 'ativo' 
                        ? `<button class="btn btn-success" onclick="devolverLivro('${emprestimo.id}')">Devolver</button>`
                        : '<span style="color: var(--text-secondary);">-</span>'
                    }
                </td>
            </tr>
        `;
    }).join('');
}

function devolverLivro(emprestimoId) {
    if (!confirm('Confirmar devolução deste livro?')) {
        return;
    }

    const emprestimos = obterEmprestimos();
    const livros = obterLivros();

    const emprestimo = emprestimos.find(e => e.id === emprestimoId);
    
    if (emprestimo) {
        emprestimo.status = 'devolvido';
        emprestimo.dataDevolucao = new Date().toISOString();
        salvarEmprestimos(emprestimos);

        // Atualizar disponibilidade do livro
        const livro = livros.find(l => l.id === emprestimo.livroId);
        if (livro) {
            livro.disponivel = true;
            salvarLivros(livros);
        }

        renderizarEmprestimos(emprestimos);
        renderizarLivros(livros);
        mostrarToast('Livro devolvido com sucesso!', 'success');
        atualizarEstatisticas();
    }
}

// ============= FUNÇÕES AUXILIARES =============

function gerarId() {
    return 'ID' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = `toast ${tipo} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}