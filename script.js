const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/XXXXXXXX/exec";


const botones = document.querySelectorAll(".categoria-btn");
const resultados = document.querySelector(".resultados");

let negocios = [];
let datosCargados = false;


// Obtener los negocios desde Google Sheets
fetch(URL_GOOGLE_SHEETS)

    .then(function(respuesta) {

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con Google Sheets");
        }

        return respuesta.json();

    })

    .then(function(datos) {

        negocios = datos;
        datosCargados = true;

        console.log("Negocios recibidos:", negocios);

    })

    .catch(function(error) {

        console.error("Error:", error);

    });


// Convertir enlace de Google Drive en enlace para imagen
function obtenerImagen(url) {

    if (!url) {
        return "";
    }

    const texto = String(url).trim();

    // Buscar el ID del archivo
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


// Cuando se selecciona una categoría
botones.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const categoriaSeleccionada =
            boton.dataset.categoria;


        if (!datosCargados) {

            resultados.innerHTML = `
                <h2>${categoriaSeleccionada}</h2>

                <p class="sin-resultados">
                    Cargando negocios...
                </p>
            `;

            return;
        }


        const negociosCategoria = negocios.filter(function(negocio) {

            return String(negocio["Categoría"] || "")
                .trim()
                .toLowerCase()
                === categoriaSeleccionada.trim().toLowerCase();

        });


        resultados.innerHTML = `
            <h2>${categoriaSeleccionada}</h2>
        `;


        if (negociosCategoria.length === 0) {

            resultados.innerHTML += `
                <p class="sin-resultados">
                    Todavía no hay negocios publicados
                    en esta categoría.
                </p>
            `;

        }


        negociosCategoria.forEach(function(negocio) {

            const ficha = document.createElement("div");

            ficha.className = "ficha";


            const imagen = obtenerImagen(
                negocio["Imagen del negocio, producto o servicio"]
            );


            ficha.innerHTML = `

                ${
                    imagen
                    ?
                    `<img
                        src="${imagen}"
                        alt="${negocio["Nombre del negocio o persona"] || "Imagen del negocio"}"
                        class="imagen-ficha"
                    >`
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


            resultados.appendChild(ficha);

        });


        resultados.scrollIntoView({
            behavior: "smooth"
        });

    });

});
