// Inicializa a variável 'ownerOptions' com uma string HTML que representa a opção padrão
// '-- Selecione --' em um elemento <select> (dropdown) de um formulário.
var ownerOptions = '<option value="">-- Selecione --</option>';


function myHome() {
    // Função chamada quando a página carrega
    changeTitle('Novo Documento'); // Altera o título da página para 'Novo Documento'
    getOwnersToSelect(); // Obtém os proprietários para o dropdown
    if (sessionStorage.openTab == undefined)
        sessionStorage.openTab = 'item'; // Define a guia padrão como 'item' se não estiver definida
    showTab(sessionStorage.openTab); // Exibe a guia salva na sessionStorage
    $('#btnNewOwner').click(() => { showTab('owner'); }); // Define um clique no botão 'Novo Proprietário'
    $('#btnNewItem').click(() => { showTab('item'); }); // Define um clique no botão 'Novo Item'
    $('.tabs form').submit(sendData); // Adiciona um ouvinte para o evento de envio do formulário nas guias
}

function sendData(ev) {
    // Função chamada ao enviar o formulário
    ev.preventDefault();

    // Converte os dados do formulário para JSON e remove tags HTML
    var formJSON = {};
    const formData = new FormData(ev.target);
    formData.forEach((value, key) => {
        formJSON[key] = stripTags(value);
        $('#' + key).val(formJSON[key]);
    });

    // Verifica se algum campo está vazio
    for (const key in formJSON)
        if (formJSON[key] == '')
            return false;

    // Envia os dados para serem salvos
    saveData(formJSON);
    return false;
}

function saveData(formJSON) {
    // Função para salvar dados no servidor
    requestURL = `${app.apiBaseURL}/${formJSON.type}s`; // URL da API com base no tipo de formulário
    delete formJSON.type; // Remove a chave 'type' do objeto JSON

    // Renomeia a chave 'ownerName' para 'name' se existir
    if (formJSON.ownerName != undefined) {
        formJSON['name'] = formJSON.ownerName;
        delete formJSON.ownerName;
    }

    // Renomeia a chave 'itemName' para 'name' se existir
    if (formJSON.itemName != undefined) {
        formJSON['name'] = formJSON.itemName;
        delete formJSON.itemName;
    }

    // Envia os dados para a API usando AJAX
    $.ajax({
        type: "POST",
        url: requestURL,
        data: JSON.stringify(formJSON),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
        .done(() => {
            // Se bem-sucedido, exibe uma mensagem de sucesso
            viewHTML = `
                <form>
                    <h3>Oba!</h3>
                    <p>Cadastro efetuado com sucesso.</p>
                    <p>Obrigado...</p>
                </form>
            `;
        })
        .fail((error) => { // Se falhar, exibe uma mensagem de erro
            console.error('Erro:', error.status, error.statusText, error.responseJSON);
            viewHTML = `
                <form>
                    <h3>Oooops!</h3>
                    <p>Não foi possível realizar o cadastro. Ocorreu uma falha no servidor.</p>
                </form>
            `;
        })
        .always(() => {
            // Exibe o resultado na página e limpa os formulários
            $('.tabBlock').html(viewHTML);
            $('#formNewOwner').trigger('reset');
            $('#formNewItem').trigger('reset');
        });

    return false;
}

function showTab(tabName) {
    // Função para exibir a guia desejada
    $('#formNewOwner').trigger('reset');
    $('#formNewItem').trigger('reset');

    switch (tabName) {
        case 'owner':
            // Exibe a guia 'Proprietário' e oculta a guia 'Item'
            $('#tabOwner').show();
            $('#tabItem').hide();
            $('#btnNewOwner').attr('class', 'active');
            $('#btnNewItem').attr('class', 'inactive');
            sessionStorage.openTab = 'owner';
            break;
        case 'item':
            // Exibe a guia 'Item' e oculta a guia 'Proprietário'
            $('#tabItem').show();
            $('#tabOwner').hide();
            $('#btnNewItem').attr('class', 'active');
            $('#btnNewOwner').attr('class', 'inactive');
            break;
    }
}

function getOwnersToSelect() {
    // Função para obter proprietários e preencher o dropdown
    requestURL = `${app.apiBaseURL}/owners`;

    $.get(requestURL)
        .done((apiData) => {

            // Itera sobre os dados da API e cria as opções do dropdown
            apiData.forEach((item) => {
                ownerOptions += `<option value="${item.id}">${item.id} - ${item.name}</option>`;
            });

            // Atualiza o dropdown com as opções
            $('#owner').html(ownerOptions);
        })
        .fail((error) => {
            console.error('Erro:', error.status, error.statusText, error.responseJSON);
        });
}

$(document).ready(myHome); // Chama a função myHome quando o documento estiver pronto
