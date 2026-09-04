const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbxdeXZYNbDZUMD60ljDh_9ADQbs5q0OCG6eXUJHuT17Qn-Dk5Ys0Glf26MFXM3SvNnW/exec";


const botones = document.querySelectorAll(".categoria-btn");
const resultados = document.querySelector(".resultados");
const buscador = document.querySelector('input[type="text"]');

let negocios = [];


// ========================================
// CARGAR NEGOCIOS DESDE GOOGLE SHEETS
// ========================================

fetch(URL_GOOGLE_SHEETS)

    .then(function(respuesta) {
        return respuesta.json();
    })

    .then(function(datos) {

        negocios = datos;

        console.log("Negocios recibidos:", negocios);

    })

    .catch(function(error) {

        console.error("No se pudieron cargar los negocios:", error);

    });


// ========================================
// CONVERTIR ENLACE DE GOOGLE DRIVE
// ========================================

function obtenerImagen(url) {

    if (!url) {
        return "";
    }

    const texto = String(url).trim();

    let coincidencia = texto.match(/id=([^&]+)/);

    if (!coincidencia) {
        coincidencia = texto.match(/\/d\/([^\/]+)/);
    }

    if (!coincidencia) {
        return "";
    }

    const id = coincidencia[1];

    return "https://drive.google.com/thumbnail?id=" + id + "&sz=w1000";
}


// ========================================
// MOSTRAR UNA FICHA
// ========================================

function crearFicha(negocio) {

    const ficha = document.createElement("div");

    ficha.className = "ficha";


    const imagen = obtenerImagen(
        negocio["Imagen del negocio, producto o servicio"]
    );


    ficha.innerHTML = `

        ${
            imagen
            ?
            `
            <img
                src="${imagen}"
                alt="${negocio["Nombre del negocio o persona"] || "Imagen del negocio"}"
                class="imagen-ficha"
            >
            `
            :
            ""
        }


        <div class="ficha-contenido">

            <h3>
                ${negocio["Nombre del negocio o persona"] || ""}
            </h3>


            <p class="categoria">
                📂 ${negocio["Categoría"] || ""}
            </p>


            <p>
                📍 ${negocio["Ubicación"] || ""}
            </p>


            <p>
                🕐 ${negocio["Horario de atención"] || ""}
            </p>


            <a
                href="https://wa.me/${negocio["Número de WhatsApp"] || ""}"
                class="whatsapp"
                target="_blank"
            >
                💬 Contactar por WhatsApp
            </a>

        </div>

    `;


    return ficha;
}


// ========================================
// MOSTRAR NEGOCIOS
// ========================================

function mostrarNegocios(lista, titulo) {

    resultados.innerHTML = `
        <h2>${titulo}</h2>
    `;


    if (lista.length === 0) {

        resultados.innerHTML += `
            <p class="sin-resultados">
                Todavía no hay negocios publicados.
            </p>
        `;

        return;
    }


    lista.forEach(function(negocio) {

        const ficha = crearFicha(negocio);

        resultados.appendChild(ficha);

    });
}


// ========================================
// CATEGORÍAS
// ========================================

botones.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const categoriaSeleccionada =
            boton.dataset.categoria;


        const negociosCategoria = negocios.filter(function(negocio) {

            return String(
                negocio["Categoría"] || ""
            )
            .trim()
            .toLowerCase()
            ===
            categoriaSeleccionada
            .trim()
            .toLowerCase();

        });


        mostrarNegocios(
            negociosCategoria,
            categoriaSeleccionada
        );


        resultados.scrollIntoView({
            behavior: "smooth"
        });

    });

});


// ========================================
// BUSCADOR
// ========================================

buscador.addEventListener("input", function() {

    const texto = buscador.value
        .trim()
        .toLowerCase();


    // Si está vacío, no mostramos resultados
    if (texto === "") {

        resultados.innerHTML = "";

        return;
    }


    const resultadosBusqueda = negocios.filter(function(negocio) {

        const nombre =
            String(
                negocio["Nombre del negocio o persona"] || ""
            ).toLowerCase();


        const categoria =
            String(
                negocio["Categoría"] || ""
            ).toLowerCase();


        const ubicacion =
            String(
                negocio["Ubicación"] || ""
            ).toLowerCase();


        return (
            nombre.includes(texto) ||
            categoria.includes(texto) ||
            ubicacion.includes(texto)
        );

    });


    mostrarNegocios(
        resultadosBusqueda,
        "Resultados de búsqueda"
    );


    resultados.scrollIntoView({
        behavior: "smooth"
    });

});
