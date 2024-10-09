const apiBaseUrl = 'http://localhost:8080/api/customers';
let clients = [];
let currentPage = 1;
let itemsPerPage = 25;
let selectedClientId = null;

// Função para obter o token do localStorage
function getToken() {
    return localStorage.getItem('token'); // Assume que o token está armazenado com a chave 'token'
}

function fetchClients() {
    fetch(`${apiBaseUrl}/all_customers`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}` // Adiciona o token ao cabeçalho
        }
    })
    .then(response => response.json())
    .then(data => {
        clients = data;
        renderTable();
    })
    .catch(error => console.error('Error fetching clients:', error));
}

function renderTable() {
    const tbody = document.getElementById("clientTableBody");
    tbody.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentClients = clients.slice(start, end);

    currentClients.forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${client.name}</td>
            <td>${client.cpf}</td>
            <td>${client.phone}</td>
            <td>
                <button class="action-button" onclick="openEditModal('${client.id}')">Edit</button>
                <button class="action-button" onclick="openDeleteModal('${client.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById("itemsPerPage").addEventListener("change", function() {
    itemsPerPage = Number(this.value);
    renderTable();
});

function openEditModal(clientId) {
    selectedClientId = clientId;
    const client = clients.find(c => c.id === clientId); // Use _id para encontrar o cliente
    document.getElementById("editClientName").value = client.name;
    document.getElementById("editClientPhone").value = client.phone;
    document.getElementById("editClientCpf").value = client.cpf; // Atualize o telefone
    document.getElementById("editModal").style.display = "block";
}

document.getElementById("saveEdit").addEventListener("click", function() {
    const updatedName = document.getElementById("editClientName").value;
    const updatedCpf = document.getElementById("editClientCpf").value; // Adicionando a captura do CPF
    const updatedPhone = document.getElementById("editClientPhone").value;
    
    // Encontre o cliente selecionado na lista de clientes
    const client = clients.find(c => c.id === selectedClientId); // Use selectedClientId aqui
    console.log("Selected Client ID:", selectedClientId);
    
    const updatedData = {
        name: updatedName,
        cpf: updatedCpf, 
        phone: updatedPhone
    };

    fetch(`${apiBaseUrl}/update_customer/${selectedClientId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}` // Adiciona o token ao cabeçalho
        },
        body: JSON.stringify(updatedData) // Enviando o JSON no formato correto
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        fetchClients(); // Atualiza a tabela após a edição
        closeEditModal();
    })
    .catch(error => {
        console.error('Error updating client:', error);
    });
});




function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

function openDeleteModal(clientId) {
    selectedClientId = clientId;
    document.getElementById("deleteModal").style.display = "block";
}

document.getElementById("confirmDelete").addEventListener("click", function() {
    fetch(`${apiBaseUrl}/delete_customer/${selectedClientId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}` // Adiciona o token ao cabeçalho
        }
    })
    .then(response => response.json())
    .then(data => {
        fetchClients();
        closeDeleteModal();
    })
    .catch(error => console.error('Error deleting client:', error));
});

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

// Chame a função para buscar os clientes quando a página carregar
fetchClients();
