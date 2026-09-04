const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbxdeXZYNbDZUMD60ljDh_9ADQbs5q0OCG6eXUJHuT17Qn-Dk5Ys0Glf26MFXM3SvNnW/exec";


const botones = document.querySelectorAll(".categoria-btn");
const resultados = document.querySelector(".resultados");

let negocios = [];
let datosCargados = false;


// =====================================================
// OBTENER LOS NEGOCIOS DESDE GOOGLE SHEETS
// =====================================================

fetch(URL_GOOGLE_SHEETS)

    .then(function(respuesta) {

        console.log("Respuesta de Google Sheets:", respuesta);

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo conectar con Google Sheets. Código: "
                + respuesta.status
            );
        }

        return respuesta.json();

    })

    .then(function(datos) {

        console.log("DATOS RECIBIDOS:", datos);

        // Comprobar que recibimos una lista
        if (!Array.isArray(datos)) {

            throw new Error(
                "Google Sheets no devolvió una lista de negocios."
            );

        }

        negocios = datos;

        datosCargados = true;

        console.log(
            "Negocios cargados correctamente:",
            negocios
        );

    })

    .catch(function(error) {

        console.error(
            "ERROR AL CARGAR NEGOCIOS:",
            error
        );

        datosCargados = false;

        resultados.innerHTML = `
            <p class="sin-resultados">
                No se pudieron cargar los negocios.
                <br>
                Revisa la conexión con Google Sheets.
            </p>
        `;

    });


// =====================================================
// CONVERTIR ENLACE DE GOOGLE DRIVE EN IMAGEN
// =====================================================

function obtenerImagen(url) {

    if (!url) {
        return "";
    }

    const texto = String(url).trim();

    // Enlace tipo:
    // https://drive.google.com/open?id=XXXXXXXX

    let coincidencia = texto.match(/id=([^&]+)/);

    // Enlace tipo:
    // https://drive.google.com/file/d/XXXXXXXX/view

    if (!coincidencia) {
        coincidencia = texto.match(/\/d\/([^\/]+)/);
    }

    if (!coincidencia) {
        return "";
    }

    const id = coincidencia[1];

    return "https://drive.google.com/thumbnail?id="
        + id
        + "&sz=w1000";
}


// =====================================================
// MOSTRAR NEGOCIOS
// =====================================================

function mostrarNegocios(categoriaSeleccionada) {

    // Buscar negocios que tengan la categoría seleccionada
    const negociosCategoria = negocios.filter(function(negocio) {

        const categorias = String(
            negocio["Categoría"] || ""
        )
            .split(",")
            .map(function(categoria) {
                return categoria.trim().toLowerCase();
            });

        return categorias.includes(
            categoriaSeleccionada.trim().toLowerCase()
        );

    });


    // Título de resultados

    resultados.innerHTML = `
        <h2>${categoriaSeleccionada}</h2>
    `;


    // Si no hay negocios

    if (negociosCategoria.length === 0) {

        resultados.innerHTML += `
            <p class="sin-resultados">
                Todavía no hay negocios publicados
                en esta categoría.
            </p>
        `;

        return;
    }


    // Crear las fichas

    negociosCategoria.forEach(function(negocio) {

        const ficha = document.createElement("div");

        ficha.className = "ficha";


        // Imagen

        const imagen = obtenerImagen(
            negocio[
                "Imagen del negocio, producto o servicio"
            ]
        );


        // WhatsApp

        let whatsapp =
            String(
                negocio["Número de WhatsApp"] || ""
            ).trim();


        // Quitar espacios, guiones y otros caracteres
        whatsapp = whatsapp.replace(
            /[^0-9]/g,
            ""
        );


        // Si el número empieza con 8 o 6 y es de Costa Rica,
        // agregar +506

        if (
            whatsapp.length === 8 &&
            !whatsapp.startsWith("506")
        ) {

            whatsapp = "506" + whatsapp;

        }


        // Crear ficha

        ficha.innerHTML = `

            ${
                imagen
                ?
                `
                <img
                    src="${imagen}"
                    alt="${
                        negocio[
                            "Nombre del negocio o persona"
                        ]
                        || "Imagen del negocio"
                    }"
                    class="imagen-ficha"
                >
                `
                :
                ""
            }


            <div class="ficha-contenido">

                <h3>
                    ${
                        negocio[
                            "Nombre del negocio o persona"
                        ] || ""
                    }
                </h3>


                <p class="categoria">

                    📂

                    ${
                        negocio["Categoría"] || ""
                    }

                </p>


                <p>

                    📍

                    ${
                        negocio["Ubicación"] || ""
                    }

                </p>


                <p>

                    🕐

                    ${
                        negocio[
                            "Horario de atención"
                        ] || ""
                    }

                </p>


                ${
                    whatsapp
                    ?
                    `
                    <a
                        href="https://wa.me/${whatsapp}"
                        class="whatsapp"
                        target="_blank"
                    >
                        💬 Contactar por WhatsApp
                    </a>
                    `
                    :
                    ""
                }

            </div>

        `;


        resultados.appendChild(ficha);

    });


    // Desplazarse hasta los resultados

    resultados.scrollIntoView({
        behavior: "smooth"
    });

}


// =====================================================
// BOTONES DE CATEGORÍAS
// =====================================================

botones.forEach(function(boton) {

    boton.addEventListener(
        "click",
        function() {

            const categoriaSeleccionada =
                boton.dataset.categoria;


            // Si todavía no terminaron de cargar los datos

            if (!datosCargados) {

                resultados.innerHTML = `

                    <h2>
                        ${categoriaSeleccionada}
                    </h2>

                    <p class="sin-resultados">

                        Cargando negocios...

                    </p>

                `;

                return;

            }


            // Mostrar negocios

            mostrarNegocios(
                categoriaSeleccionada
            );

        }
    );

});
