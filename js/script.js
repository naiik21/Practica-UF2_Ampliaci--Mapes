// METEORITS
let meteorits;
let meteoritName = [];

fetch("data/earthMeteorites.json")
    .then((response) => response.json())
    .then((data) => {
        meteorits = data;

        meteorits.forEach((meteorit) => meteoritName.push(meteorit.name));
    });


//Varaibles
var bbdd = "meteorits";
let lista = [];
let tiposColumnas;
let columnNames;
let mitjanaNT = 0;
let nObj = 0;
let map = null;


// Funció per selccionar la base de dadaes i contrlar que ho fas
function env() {
    event.preventDefault(); // Evita la recarga de la página si es un formulario
    lista = [];
    tiposColumnas;
    mitjanaNT = 0;
    nObj = 0;
    selectBBDD(bbdd);
}

// Carrega bbdd que volem utilitzar
function selectBBDD(bbdd) {
    lista = [];
    nObj = 0;
    mitjanaNT = 0;

    meteorits.forEach((meteorit) => {
        lista.push([meteorit.id, meteorit.year, meteorit.name, meteorit.mass, ""]);
        // coordenades = meteorit.geolocation.coordinates;
        if (meteorit.mass === undefined) {
            nObj++;
            mitjanaNT += 0;
        } else {
            nObj++;
            mitjanaNT += parseFloat(meteorit.mass);
        }
    });

    columnNames = ['ID', 'Data', 'Nom', 'Pes', 'Mapa'];
    tiposColumnas = ['int', 'year', 'string', 'float', 'boton'];

}

function imprTaulaNormal() {
    selectBBDD(bbdd)
    imprTable(lista, tiposColumnas);
}

//Funció que imprimeix la taula
function imprTable(bbdd, tiposColumnas) {
    document.getElementById("resultat").innerHTML = "";
    if (bbdd == null || tiposColumnas == null) {
        alert("Selecciona una llista i envia");
        location.reload();
    }
    let table = document.createElement("table");
    table.border = "1";
    let cabezera = table.createTHead();

    // Añadimos las columnas de la variable columnNames a la cabecera
    let row = cabezera.insertRow(0);
    Object.keys(bbdd[0]).forEach(function (key, index) {
        let th = document.createElement("th");
        // Posa el nom de les capzaleres
        th.textContent = columnNames[key];
        cabezera.appendChild(th);

        // Establecemos el tipo de columna (int, img, string, float)
        th.dataset.tipo = tiposColumnas[index];
    });

    // Agregamos las filas de datos
    bbdd.forEach(function (obj) {
        let fila = table.insertRow();
        Object.keys(obj).forEach(function (key, index) {
            let celda = fila.insertCell();
            let tipo = tiposColumnas[index];

            // Aplicamos el formato según el tipo de columna
            switch (tipo) {
                case 'int':
                    celda.textContent = parseInt(obj[key]);
                    break;
                case 'img':
                    let img = document.createElement('img');
                    img.src = obj[key];
                    celda.appendChild(img);
                    break;
                case 'string':
                    celda.textContent = obj[key];
                    break;
                case 'float':
                    celda.textContent = parseFloat(obj[key]);
                    break;
                case 'year':
                    let year = obj[key];
                    celda.textContent = year;
                case 'boton':
                    celda.onclick = function () {
                        mapa(obj[2]);
                    };
            }
        });
    });

    // Mostrar la tabla en el contenedor
    document.getElementById("resultat").appendChild(table);
}

function mapa(name) {
    let x = 0;
    let y = 0;
    let massa = 0;
    meteorits.forEach(function (meteorit) {
        if (meteorit.name === name) {
            x = meteorit.geolocation.coordinates[0];
            y = meteorit.geolocation.coordinates[1];
            massa = meteorit.mass;
        }
    });

    // Eliminar el mapa existente si hay uno
    if (map !== null) {
        map.remove();
    }

    map = L.map('map').setView([x, y], massa);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var circle = L.circle([x, y], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

}

