const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbxdeXZYNbDZUMD60ljDh_9ADQbs5q0OCG6eXUJHuT17Qn-Dk5Ys0Glf26MFXM3SvNnW/exec";


const botones = document.querySelectorAll(".categoria-btn");
const resultados = document.querySelector(".resultados");

let negocios = [];
let datosCargados = false;


// Cargar negocios desde Google Sheets
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


// Botones de categorías
botones.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const categoriaSeleccionada =
            boton.dataset.categoria;


        // Si todavía no cargaron los datos
        if (!datosCargados) {

            resultados.innerHTML = `
                <h2>${categoriaSeleccionada}</h2>

                <p class="sin-resultados">
                    Cargando negocios...
                </p>
            `;

            return;
        }


        // Buscar negocios de esa categoría
        const negociosCategoria = negocios.filter(function(negocio) {

            return String(negocio["Categoría"] || "")
                .trim()
                .toLowerCase()
                === categoriaSeleccionada.trim().toLowerCase();

        });


        resultados.innerHTML = `
            <h2>${categoriaSeleccionada}</h2>
        `;


        // No hay negocios
        if (negociosCategoria.length === 0) {

            resultados.innerHTML += `
                <p class="sin-resultados">
                    Todavía no hay negocios publicados
                    en esta categoría.
                </p>
            `;

        }


        // Mostrar negocios
        negociosCategoria.forEach(function(negocio) {

            const ficha = document.createElement("div");

            ficha.className = "ficha";


            ficha.innerHTML = `

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
