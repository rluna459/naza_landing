
document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // 1. CONFIGURACIÓN DE EMAILJS
    // =====================================

    const EMAILJS_PUBLIC_KEY = "TU_PUBLIC_KEY";
    const EMAILJS_SERVICE_ID = "TU_SERVICE_ID";
    const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
    });

    // =====================================
    // 2. ANIMACIONES DE APARICIÓN
    // =====================================

    document.body.classList.add("js-enabled");

    const elementosAnimados = document.querySelectorAll(
        ".hero-copy, .hero-visual, .section-heading, " +
        ".service-card, .contact-copy, .contact-card"
    );

    elementosAnimados.forEach((elemento, index) => {
        elemento.classList.add("reveal");

        if (elemento.classList.contains("service-card")) {
            elemento.style.setProperty(
                "--reveal-delay",
                `${(index % 3) * 120}ms`
            );
        }
    });

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("is-visible");
                        observer.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px",
            }
        );

        elementosAnimados.forEach((elemento) => {
            observador.observe(elemento);
        });
    } else {
        elementosAnimados.forEach((elemento) => {
            elemento.classList.add("is-visible");
        });
    }

    // =====================================
    // 3. NAVEGACIÓN ACTIVA
    // =====================================

    const secciones = document.querySelectorAll(
        "main section[id]"
    );

    const enlacesNav = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    if ("IntersectionObserver" in window) {
        const observadorNav = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (!entrada.isIntersecting) return;

                    enlacesNav.forEach((enlace) => {
                        const activo =
                            enlace.getAttribute("href") ===
                            `#${entrada.target.id}`;

                        enlace.classList.toggle("active", activo);

                        if (activo) {
                            enlace.setAttribute("aria-current", "location");
                        } else {
                            enlace.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
            }
        );

        secciones.forEach((seccion) => {
            observadorNav.observe(seccion);
        });
    }

    // =====================================
    // 4. FORMULARIO DE CONTACTO
    // =====================================

    const formulario = document.querySelector("#contact-form");

    if (!formulario) return;

    const boton = formulario.querySelector(".boton-enviar");

    const textoOriginal = boton.innerHTML;

    const estado = document.createElement("p");
    estado.className = "form-status";
    estado.setAttribute("role", "status");
    estado.setAttribute("aria-live", "polite");

    formulario.appendChild(estado);

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        if (!formulario.reportValidity()) return;

        if (
            EMAILJS_PUBLIC_KEY === "TU_PUBLIC_KEY" ||
            EMAILJS_SERVICE_ID === "TU_SERVICE_ID" ||
            EMAILJS_TEMPLATE_ID === "TU_TEMPLATE_ID"
        ) {
            estado.textContent =
                "Falta configurar el servicio de correo.";
            estado.className = "form-status error";
            return;
        }

        boton.disabled = true;
        boton.innerHTML =
            'Enviando consulta <span aria-hidden="true">…</span>';

        estado.textContent = "";
        estado.className = "form-status";

        try {
            await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formulario
            );

            estado.textContent =
                "¡Consulta enviada! Gracias por comunicarte. " +
                "Te responderé a la brevedad.";

            estado.className = "form-status success";

            formulario.reset();
        } catch (error) {
            console.error("Error al enviar el correo:", error);

            estado.textContent =
                "No pudimos enviar tu consulta. " +
                "Intentá nuevamente en unos minutos.";

            estado.className = "form-status error";
        } finally {
            boton.disabled = false;
            boton.innerHTML = textoOriginal;
        }
    });
});