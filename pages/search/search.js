// Inicializa a expressão de busca.
var query = '';

function myAbout() {

    // Título da página.
    changeTitle(`Resultados da busca`);

    // Obtém o termo a ser buscado.
    if (sessionStorage.search != undefined) {
        query = sessionStorage.search

    }

}

$(document).ready(myAbout);