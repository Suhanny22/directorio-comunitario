const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";


const botones = document.querySelectorAll(".categoria-btn");
const resultados = document.querySelector(".resultados");


let negocios = [];


// Obtener los negocios desde Google Sheets
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


// Cuando se selecciona una categoría
botones.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const categoriaSeleccionada = boton.dataset.categoria;

        resultados.innerHTML = "";

        const negociosCategoria = negocios.filter(function(negocio) {

            return String(
                negocio["Categoría"]
            ).trim() === categoriaSeleccionada;

        });


        if (negociosCategoria.length === 0) {

            resultados.innerHTML = `
                <h2>${categoriaSeleccionada}</h2>
                <p class="sin-resultados">
                    Todavía no hay negocios publicados en esta categoría.
                </p>
            `;

        } else {

            resultados.innerHTML =
                `<h2>${categoriaSeleccionada}</h2>`;

            negociosCategoria.forEach(function(negocio) {

                const ficha = document.createElement("div");

                ficha.className = "ficha";

                ficha.innerHTML = `

                    <div class="ficha-contenido">

                        <h3>
                            ${negocio["Nombre del negocio o persona"]}
                        </h3>

                        <p class="categoria">
                            📂 ${categoriaSeleccionada}
                        </p>

                        <p>
                            📍 ${negocio["Ubicación"]}
                        </p>

                        <p>
                            🕐 ${negocio["Horario de atención"]}
                        </p>

                        <a
                            href="https://wa.me/${negocio["Número de WhatsApp"]}"
                            class="whatsapp"
                            target="_blank"
                        >
                            💬 Contactar por WhatsApp
                        </a>

                    </div>

                `;

                resultados.appendChild(ficha);

            });

        }


        resultados.scrollIntoView({
            behavior: "smooth"
        });

    });

});
