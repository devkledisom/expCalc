var numAtualPedido = localStorage.getItem('pedido');
//configuração do banco de dados---------------->
//verificar suporte
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.indexedDB) {
    console.log("Seu navegador não suporta o recurso IndexedDB");
} else {
    console.log("indexedDB suported!!");
}

//abrir conexao com o banco de dados serverside
var request = window.indexedDB.open("expedicaoDB", 1);

var db;

//manipulaçao de eventos
request.onerror = function (event) {
    console.log("Erro ao abrir o banco de dados", event);
}

request.onupgradeneeded = function (event) {
    console.log("Atualizando...");
    db = event.target.result;
    var objectStore = db.createObjectStore("pedidos", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = function (event) {
    console.log("Banco de dados aberto com sucesso.");
    db = event.target.result;

    getData(numAtualPedido);


}

//configuração do banco de dados---------------->


/* var transaction = db.transaction(["pedidos"], "readwrite");
transaction.oncomplete = function (event) {
    console.log("Sucesso");
};
console.log(transaction) */

async function getData(param) {
    let bd = localStorage.getItem('bd_expedicao');
    let data = JSON.parse(bd) || [];

    if (param) {
        data = data.filter((pedido) => pedido.nu_pedido == param);
    }

    list(data);
    filtro(data);
}



/* const url = "https://api-expedicao.vercel.app";
fetch(`${url}/read/pedido/${numAtualPedido}`)
    .then((x) => x.json())
    .then((res) => {
        list(res);
        filtro(res); 
    }) */

function list(obj) {
    const tbody = document.querySelector("tbody");
    var tara = 0;
    var peso = 0;
    var met = 0;
    var linear = 0;

    var indice = 0;

    obj.map((pedido, index) => {

        var row = tbody.insertRow();
        var cell1 = row.insertCell();
        var cell2 = row.insertCell();
        var cell3 = row.insertCell();
        var cell4 = row.insertCell();
        var cell5 = row.insertCell();
        var cell6 = row.insertCell();
        var cell7 = row.insertCell();
        var cell8 = row.insertCell();
        var cell9 = row.insertCell();
        var cell10 = row.insertCell();
        var cell11 = row.insertCell();
        var cell12 = row.insertCell();
        var cell13 = row.insertCell();

        indice += 1;
        cell1.innerHTML = indice;
        cell2.innerHTML = index;
        cell3.innerHTML = pedido.nu_pedido;
        cell4.innerHTML = pedido.nm_cliente;
        cell5.innerHTML = pedido.model;
        cell6.innerHTML = pedido.len;
        cell7.innerHTML = pedido.codigo;
        cell8.innerHTML = pedido.tara;
        cell9.innerHTML = pedido.peso;
        cell10.innerHTML = pedido.met;
        cell11.innerHTML = pedido.linear;
        cell12.innerHTML = pedido.status;
        cell13.innerHTML = '<button onclick="deletarPorId(event)">apagar</button>';

        tara += parseFloat(pedido.tara);
        peso += parseFloat(pedido.peso);
        met += parseFloat(pedido.met);
        linear += parseFloat(pedido.linear);

        if (obj.length == index + 1) {

            var rowResult = tbody.insertRow();
            var cell1 = rowResult.insertCell();
            var cell2 = rowResult.insertCell();
            var cell3 = rowResult.insertCell();
            var cell4 = rowResult.insertCell();
            var cell5 = rowResult.insertCell();
            var cell6 = rowResult.insertCell();
            var cell7 = rowResult.insertCell();
            var cell8 = rowResult.insertCell();
            var cell9 = rowResult.insertCell();
            var cell10 = rowResult.insertCell();
            var cell11 = rowResult.insertCell();

            cell1.innerHTML = "TOTAL";
            cell2.innerHTML = "";
            cell3.innerHTML = "";
            cell4.innerHTML = "";
            cell5.innerHTML = "";
            cell6.innerHTML = "";
            cell7.innerHTML = "";
            cell8.innerHTML = tara; //tara
            cell9.innerHTML = peso; //peso
            cell10.innerHTML = met; //met
            cell11.innerHTML = ((peso - tara) / met).toFixed(3); //linear
        }

    });
};

//-------------pesquisa por pedido------------------>
function buscar() {
    let nuPedido = prompt('Digite o numero do pedido');

    if (nuPedido) {
        document.querySelector("tbody").innerHTML = '';
        getData(nuPedido);
    } else {
        document.querySelector("tbody").innerHTML = '';
        getData(numAtualPedido);
    }

};

function apagar(event) {
    console.log(event.target)
    /*  let idPedido = prompt('Digite o id do pedido que deseja apagar');
 
     document.querySelector("tbody").innerHTML = '';
 
     if (idPedido) {
         fetch(`${url}/delete/pedido/${idPedido}`, {
             method: "DELETE"
         })
             .then((x) => x.json())
             .then((res) => {
                 fetch(`${url}/read/pedido/true`)
                     .then((x) => x.json())
                     .then((res) => {
                         list(res);
                     })
 
             })
     } else {
         document.querySelector("tbody").innerHTML = '';
 
         fetch(`${url}/read/pedido/true`)
             .then((x) => x.json())
             .then((res) => {
                 list(res);
             })
     } */
};

function novo() {
    localStorage.setItem('pedido', '');
    localStorage.setItem('cliente', '');
    localStorage.setItem('model', '');
    localStorage.setItem('len', '');
    localStorage.setItem('codigo', '');
    localStorage.setItem('tara', '');
    localStorage.setItem('bd_expedicao', '');
    localStorage.setItem('bd_expedicao', '');

    navegar();
};

function filtro(artigo) {

    artigo.forEach(data => {
        let art = data.codigo;
        var existing = false;

        document.querySelectorAll("option").forEach((result) => {
            if (result.value.includes(art)) {
                existing = true;
            };
        });

        if (existing === false) {
            let selectFiltro = document.querySelector(".filtro");
            const option = document.createElement('option');
            option.value = art;
            option.innerHTML = art;

            selectFiltro.appendChild(option);
        };


    });

};

function selectedFiltro(event) {
    let valorComparador = event.target.value;
    let bd = localStorage.getItem('bd_expedicao');
    let data = JSON.parse(bd) || [];

    if (valorComparador === "todos") {
        document.querySelector('tbody').innerHTML = "";
        list(data);
    } else {
        let resultFiltro = data.filter((x) => x.codigo == valorComparador);
        document.querySelector('tbody').innerHTML = "";
        list(resultFiltro);
    }
}

function navegar() {
    location.href = "../index.html"
}

function deletarPorId(event) {
    let linhas = event.currentTarget.parentNode.parentNode;
    let nu_item = linhas.querySelectorAll('td')[1].innerText;

    let validation = confirm(`Excluir o item ${nu_item} ?`);

    if (validation) {
        let bd = localStorage.getItem('bd_expedicao');
        let data = JSON.parse(bd) || [];

        data.splice(nu_item, 1);
        localStorage.setItem('bd_expedicao', JSON.stringify(data));

        document.querySelector("tbody").innerHTML = '';
        getData(numAtualPedido);
        showDialog();
        setTimeout(() => { closeDialog() }, 2000);
    }
}

const dialog = document.getElementById("myDialog");

function showDialog() {
    dialog.show();
}

function closeDialog() {
    dialog.close();
}
