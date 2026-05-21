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



}

//configuração do banco de dados---------------->

const btnSave = document.querySelector('#btn-save');

function calcularParametros() {
    const defaultLinear = localStorage.getItem('linear');

    if (defaultLinear) {
        const stringNumber = defaultLinear.replace(',', '.');

        document.querySelector('#min-linear').value = (parseFloat(stringNumber) - 0.015).toFixed(3);
        document.querySelector('#max-linear').value = (parseFloat(stringNumber) + 0.015).toFixed(3);
    }

};

calcularParametros();

document.querySelectorAll("input").forEach((campo) => {
    campo.addEventListener("blur", () => {
        localStorage.setItem(campo.name, campo.value);
    });
});

document.querySelector('#pedido').value = localStorage.getItem('pedido');
document.querySelector('#cliente').value = localStorage.getItem('cliente');
document.querySelector('#model').value = localStorage.getItem('model');
document.querySelector('#len').value = localStorage.getItem('len');
document.querySelector('#codigo').value = localStorage.getItem('codigo');
document.querySelector('#tara').value = localStorage.getItem('tara');
document.querySelector('#defaultLinear').value = localStorage.getItem('linear');

document.querySelector('#codigo').addEventListener("blur", async () => {
    let flag = document.querySelector('#codigo').value.length;
    if (flag === 8) {
        let numeroCod = document.querySelector('#codigo').value;

        var rtes = await getRtes();

        if (!rtes) return;

        rtes.forEach((rte) => {
            if (rte.desc === numeroCod) {
                document.querySelector('#model').value = rte.modelo;
                document.querySelector('#len').value = rte.largura;
                document.querySelector('#defaultLinear').value = rte.linear;
                localStorage.setItem('model', rte.modelo);
                localStorage.setItem('len', rte.largura);
                localStorage.setItem('linear', rte.linear);
                calcularParametros();
                console.log(rte.modelo)
            }
        });
    }
})

//resolvido

btnSave.addEventListener('click', async (e) => {
    e.preventDefault();

    let numeroCod = document.querySelector('#codigo').value;

    var rtes = await getRtes();

    if (!rtes) return;

    rtes.forEach((rte) => {
        if (rte.desc === numeroCod) {
            calculating(parseFloat(rte.linear.replace(",", ".")));
        }
    });
});

function calculating(rte) {
    const numeroPedido = document.querySelector('#pedido').value;
    const nomeCliente = document.querySelector('#cliente').value;
    const model = document.querySelector('#model').value;
    const len = document.querySelector('#len').value;
    const codigo = document.querySelector('#codigo').value;
    const tara = document.querySelector('#tara').value;
    const peso = document.querySelector('#peso').value;
    const met = document.querySelector('#met').value;
    const display = document.querySelector('#display');

    /*  localStorage.setItem('numeroPedido', numeroPedido);
     localStorage.setItem('nomeCliente', nomeCliente); */
    /*     localStorage.setItem('model', model);
        localStorage.setItem('len', len); */
    localStorage.setItem('codigo', codigo);
    localStorage.setItem('tara', tara);


    const linear = parseFloat((peso - tara) / met).toFixed(3);

    const array = [numeroPedido, nomeCliente, model, len, codigo, tara, peso, met, linear];

    if (isNotEmpty(array[0]) && isNotEmpty(array[1]) && isNotEmpty(array[4]) && isNotEmpty(array[5]) && isNotEmpty(array[6]) && isNotEmpty(array[7])) {

        display.innerHTML = linear;

        let min = rte - 0.015;
        let max = rte + 0.015;

        console.log(min, max)

        const obj = {
            "nu_pedido": array[0],
            "nm_cliente": array[1],
            "model": array[2],
            "len": array[3],
            "codigo": array[4],
            "tara": array[5],
            "peso": array[6],
            "met": array[7],
            "linear": array[8],
            "status": (linear >= min && linear <= max) ? "aprovado" : "desaprovado"
        }

        //localStorage.setItem('bd_expedicao', '');
        var bd = localStorage.getItem('bd_expedicao');

        if (bd && bd.length > 0) {
            var arrModifie = JSON.parse(bd);
            arrModifie.push(obj);

            localStorage.setItem('bd_expedicao', JSON.stringify(arrModifie));
        } else {


            localStorage.setItem('bd_expedicao', JSON.stringify([obj]));
        }


        if (linear >= min && linear <= max) {
            display.classList.add("aproved");
            display.classList.remove("disapproved");
            //sendObj(array, "aprovado");

        } else {
            display.classList.add("disapproved");
            display.classList.remove("aproved");
            //sendObj(array, "desaprovado");
        }

        document.getElementById("peso").value = '';
        document.getElementById("met").value = '';
        eventPeso.focus();

    } else {
        alert("Por favor preencha os campos corretamente")
    }

};



function sendObj() {
    let bd = localStorage.getItem('bd_expedicao');
    if (!bd || bd === '[]') {
        showDialog();
        return;
    }

    document.getElementById("peso").value = '';
    document.getElementById("met").value = '';
    eventPeso.focus();

    showDialog();
    setTimeout(() => { closeDialog() }, 3000);
}

//atualizando dados
    function upData(param, obj) {
        const objectStore = db
            .transaction(["pedidos"], "readwrite")
            .objectStore("pedidos");
        const request = objectStore.get(param);
        request.onerror = (event) => {
            // Handle errors!
        };
        request.onsuccess = (event) => {
            let newArr = request.result;
            obj.forEach((data) => {
                newArr.push(data)
            })

            console.log(newArr)
            // Put this updated object back into the database.
            const requestUpdate = objectStore.put(newArr);
            requestUpdate.onerror = (event) => {
                // Do something with the error
            };
            requestUpdate.onsuccess = (event) => {
                // Success - the data is updated!
            };
        };

    }





    /*  const url = "https://api-expedicao.vercel.app";
 
     var bd = localStorage.getItem('bd_expedicao');
 
     var array = JSON.parse(bd);
 
     const obj = {
         "nu_pedido": array[0],
         "nm_cliente": array[1],
         "model": array[2],
         "len": array[3],
         "codigo": array[4],
         "tara": array[5],
         "peso": array[6],
         "met": array[7],
         "linear": array[8],
         "status": status
     }
 
     array.forEach((item, i) => {
 
         fetch(`${url}/create/pedido`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(item)
         })
             .then((x) => x.json())
             .then((res) => {
                 //alert("salvo");
                 console.log(res)
 
 
                 document.getElementById("peso").value = '';
                 document.getElementById("met").value = '';
                 eventPeso.focus();
 
                 localStorage.setItem('bd_expedicao', '');
 
                 if (i == array.length - 1) {
                     showDialog();
                     localStorage.setItem('bd_expedicao', '');
                     setTimeout(() => { closeDialog() }, 3000)
                 }
 
             })
     }); */
//};

function isNotEmpty(value) {
    return value !== '';
};

function modelAndlen() {
    var numAtualPedido = localStorage.getItem('numeroPedido');

    const url = "https://api-expedicao.vercel.app";
    fetch(`${url}/read/rte/true`)
        .then((x) => x.json())
        .then((res) => {
            list(res);
        })

    function list(obj) {

        obj.map((pedido, index) => {
            let model = document.querySelector('#model');
            const opt = document.createElement('option');
            opt.value = pedido.modelo;
            opt.innerHTML = pedido.modelo;

            model.appendChild(opt);

            let larg = document.querySelector('#len');
            const opt1 = document.createElement('option');
            opt1.value = pedido.largura;
            opt1.innerHTML = pedido.largura;

            larg.appendChild(opt1);

        });

    };
}

//modelAndlen();

function navegar(path) {
    location = `./views/${path}`
}

const dialog = document.getElementById("myDialog");

function showDialog() {
    dialog.show();
}

function closeDialog() {
    dialog.close();
}

var autoSaving = localStorage.getItem("autoSaving") || false;
console.log(autoSaving)
if (localStorage.getItem("autoSaving") === 'true') {
    document.getElementById("auto-save").style.backgroundColor = "green";
} else {
    document.getElementById("auto-save").style.backgroundColor = "#5555";
}

function autoSave() {
    let getState = localStorage.getItem("autoSaving");
    if (getState) {
        localStorage.setItem("autoSaving", autoSaving);
    } else {
        autoSaving = getState;
    }

    if (getState === 'false') {
        localStorage.setItem("autoSaving", true);
        autoSaving = true;
        document.getElementById("auto-save").style.backgroundColor = "green";
    } else {
        localStorage.setItem("autoSaving", false);
        autoSaving = false;
        document.getElementById("auto-save").style.backgroundColor = "#5555";
    }
}

const eventPeso = document.getElementById("peso");
const eventMet = document.getElementById("met");

eventPeso.addEventListener('input', () => {
    if (eventPeso.value.length === 6) {
        eventMet.focus();
    }
});

eventMet.addEventListener('input', () => {
    if (eventMet.value.length === 6 && autoSaving == "true") {
        btnSave.click();
    }
});



