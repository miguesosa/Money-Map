// Money Map - Funcionalidades Principales
// Este archivo contiene el JavaScript para gestionar las transacciones, interactuar con el DOM,
// y ofrecer una experiencia interactiva y funcional al usuario.

document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.querySelector("#transaction-form");
    const transactionTableBody = document.querySelector("#transaction-table tbody");
    const summaryCards = document.querySelectorAll(".card-container .card");
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // **1. Validación del formulario y almacenamiento de transacciones**
    transactionForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const description = document.querySelector("#description").value.trim();
        const amount = parseFloat(document.querySelector("#amount").value);
        const category = document.querySelector("#category").value;

        if (!description || isNaN(amount)) {
            console.error("Por favor, completa todos los campos correctamente.");
            return;
        }

        const newTransaction = { description, amount, category };
        transactions.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        addTransactionToTable(newTransaction);
        updateSummary();
        transactionForm.reset();
    });

    // **2. Agregar transacción a la tabla**
    function addTransactionToTable(transaction) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${transaction.category}</td>
            <td>
                <button class="delete-btn">Eliminar</button>
            </td>
        `;
        row.querySelector(".delete-btn").addEventListener("click", () => {
            transactions = transactions.filter((t) => t !== transaction);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            row.remove();
            updateSummary();
        });
        transactionTableBody.appendChild(row);
    }

    // **3. Generar lista dinámica de transacciones**
    function renderTransactions() {
        transactionTableBody.innerHTML = ""; // Limpiar tabla
        transactions.forEach(addTransactionToTable);
    }

    // **4. Actualizar resumen financiero**
    function updateSummary() {
        const income = transactions
            .filter((t) => t.category === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
            .filter((t) => t.category === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
        const savings = transactions
            .filter((t) => t.category === "savings")
            .reduce((sum, t) => sum + t.amount, 0);
        const debt = transactions
            .filter((t) => t.category === "debt")
            .reduce((sum, t) => sum + t.amount, 0);

        // Actualizar tarjetas de resumen
        summaryCards[0].querySelector("h2").textContent = `Ingresos: $${income.toFixed(2)}`;
        summaryCards[1].querySelector("h2").textContent = `Gastos: $${expense.toFixed(2)}`;
        summaryCards[2].querySelector("h2").textContent = `Ahorros: $${savings.toFixed(2)}`;
        summaryCards[3].querySelector("h2").textContent = `Deudas: $${debt.toFixed(2)}`;
    }

    // **5. Mostrar detalles de una categoría (evento click en tarjeta)**
    summaryCards.forEach((card) => {
        card.addEventListener("click", () => {
            alert(`Estás viendo más detalles sobre: ${card.querySelector("h2").textContent}`);
        });
    });

    // **6. Consumo de API pública**
    async function fetchReviews() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/comments?_limit=3");
            const data = await response.json();

            const reviewsContainer = document.querySelector(".reviews-container");
            reviewsContainer.innerHTML = ""; // Limpiar contenido previo

            data.forEach((review) => {
                const reviewCard = document.createElement("div");
                reviewCard.classList.add("card");
                reviewCard.innerHTML = `
                    <p>"${review.body}"</p>
                    <p>- ${review.email}</p>
                `;
                reviewsContainer.appendChild(reviewCard);
            });
        } catch (error) {
            console.error("Error al obtener las reseñas:", error);
        }
    }

    // **7. Cargar datos iniciales**
    renderTransactions();
    updateSummary();
    fetchReviews();
});