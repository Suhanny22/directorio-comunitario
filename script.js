const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbxdeXZYNbDZUMD60ljDh_9ADQbs5q0OCG6eXUJHuT17Qn-Dk5Ys0Glf26MFXM3SvNnW/exec";

let negocios = [];


// ===============================
// CARGAR NEGOCIOS
// ===============================

fetch(URL_GOOGLE_SHEETS)
  .then(response => response.json())
  .then(data => {

    negocios = data;

    mostrarNegocios(negocios);

  })
  .catch(error => {
    console.error("Error cargando los negocios:", error);
  });


// ===============================
// MOSTRAR NEGOCIOS
// ===============================

function mostrarNegocios(lista) {

  const contenedor = document.querySelector(".resultados");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <p class="sin-resultados">
        No encontramos negocios o servicios con esa búsqueda.
      </p>
    `;
    return;
  }

  lista.forEach(negocio => {

    const nombre = negocio["Nombre del negocio o persona"] || "";
    const categoria = negocio["Categoría"] || "";
    const ubicacion = negocio["Ubicación"] || "";
    const whatsapp = negocio["Número de WhatsApp"] || "";
    const horario = negocio["Horario de atención"] || "";
    const imagen = negocio["Imagen del negocio, producto o servicio"] || "";
    const redes = negocio["Redes sociales"] || "";

    // NUEVO:
    // Esta es la pregunta que agregaste al formulario
    const productoServicio =
      negocio["¿Qué producto o servicio ofrece?"] || "";


    // ===============================
    // IMAGEN DE GOOGLE DRIVE
    // ===============================

    let imagenFinal = "";

    if (imagen) {

      let idImagen = "";

      if (imagen.includes("open?id=")) {
        idImagen = imagen.split("open?id=")[1].split("&")[0];
      }

      if (imagen.includes("/d/")) {
        idImagen = imagen.split("/d/")[1].split("/")[0];
      }

      if (idImagen) {
        imagenFinal =
          `https://drive.google.com/thumbnail?id=${idImagen}&sz=w1000`;
      }
    }


    // ===============================
    // WHATSAPP
    // ===============================

    let botonWhatsApp = "";

    if (whatsapp) {

      const numero = String(whatsapp)
        .replace(/\D/g, "");

      botonWhatsApp = `
        <a
          class="boton-whatsapp"
          href="https://wa.me/${numero}"
          target="_blank">
          💬 WhatsApp
        </a>
      `;
    }


    // ===============================
    // REDES SOCIALES
    // ===============================

    let botonRedes = "";

    if (redes) {

      let usuario = String(redes).trim();

      if (!usuario.startsWith("http")) {
        usuario = "https://instagram.com/" + usuario.replace("@", "");
      }

      botonRedes = `
        <a
          class="boton-redes"
          href="${usuario}"
          target="_blank">
          📱 Redes sociales
        </a>
      `;
    }


    // ===============================
    // INFORMACIÓN EXTRA PARA "OTROS"
    // ===============================

    let informacionExtra = "";

    if (
      categoria.toLowerCase().trim() === "otros" &&
      productoServicio
    ) {

      informacionExtra = `
        <p class="producto-servicio">
          💡 <strong>Ofrece:</strong> ${productoServicio}
        </p>
      `;
    }


    // ===============================
    // CREAR TARJETA
    // ===============================

    const tarjeta = document.createElement("article");

    tarjeta.className = "ficha";

    tarjeta.innerHTML = `

      ${
        imagenFinal
          ? `
            <img
              class="imagen-ficha"
              src="${imagenFinal}"
              alt="${nombre}">
          `
          : ""
      }

      <div class="contenido-ficha">

        <h3>${nombre}</h3>

        <p class="categoria">
          📌 ${categoria}
        </p>

        ${informacionExtra}

        ${
          ubicacion
            ? `<p>📍 ${ubicacion}</p>`
            : ""
        }

        ${
          horario
            ? `<p>🕒 ${horario}</p>`
            : ""
        }

        <div class="botones-ficha">
          ${botonWhatsApp}
          ${botonRedes}
        </div>

      </div>
    `;

    contenedor.appendChild(tarjeta);

  });

}


// ===============================
// FILTRO POR CATEGORÍA
// ===============================

document.querySelectorAll(".categoria-btn").forEach(boton => {

  boton.addEventListener("click", () => {

    const categoriaSeleccionada =
      boton.dataset.categoria;

    if (categoriaSeleccionada === "Todos") {

      mostrarNegocios(negocios);

      return;
    }

    const filtrados = negocios.filter(negocio => {

      const categoria =
        String(negocio["Categoría"] || "")
          .trim()
          .toLowerCase();

      return categoria ===
        categoriaSeleccionada
          .trim()
          .toLowerCase();

    });

    mostrarNegocios(filtrados);

  });

});


// ===============================
// BUSCADOR
// ===============================

const buscador =
  document.querySelector('input[type="text"]');

if (buscador) {

  buscador.addEventListener("input", () => {

    const texto =
      buscador.value
        .trim()
        .toLowerCase();

    if (!texto) {

      mostrarNegocios(negocios);

      return;
    }

    const resultados =
      negocios.filter(negocio => {

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

        // NUEVO:
        // También busca dentro de lo que ofrece
        const productoServicio =
          String(
            negocio["¿Qué producto o servicio ofrece?"] || ""
          ).toLowerCase();


        return (
          nombre.includes(texto) ||
          categoria.includes(texto) ||
          ubicacion.includes(texto) ||
          productoServicio.includes(texto)
        );

      });

    mostrarNegocios(resultados);

  });

}
