document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
        alert('Vous devez être connecté pour accéder à cette page.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    try {
        // Determine if the user is a client or an employee
        const role = localStorage.getItem('role'); // Save the role during login
        const endpoint = role === 'client' ? '/api/client/profile' : '/api/employe/profile';

        // Fetch profile data
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données du profil.');
        }

        const data = await response.json();

        // Update personal information
        document.getElementById('user-fullname').textContent = role === 'client' ? data.client.nom : data.employe.nom;
        document.getElementById('user-email').textContent = role === 'client' ? data.client.email : data.employe.email;

        if (role === 'client') {
            document.getElementById('user-phone').textContent = data.client.tel;
        } else {
            document.getElementById('phone-container').style.display = 'none'; // Hide phone for employees
        }

        // Update appointments
        const appointmentsList = document.getElementById('appointments-list');
        appointmentsList.innerHTML = ''; // Clear existing content

        if (data.rdvs.length === 0) {
            appointmentsList.innerHTML = '<p>Aucun Rendez-vous</p>';
        } else {
            data.rdvs.forEach((rdv) => {
                const rdvElement = document.createElement('div');
                rdvElement.classList.add('appointment-item');
                rdvElement.innerHTML = `
                    <p><strong>Service:</strong> ${rdv.service}</p>
                    <p><strong>Date:</strong> ${rdv.date}</p>
                    <p><strong>Heure:</strong> ${rdv.heure}</p>
                    <p><strong>Statut:</strong> ${rdv.statut}</p>
                `;
                appointmentsList.appendChild(rdvElement);

                // Add accept/decline buttons for employees
                if (role === 'employe' && rdv.statut === 'en attente') {
                    const actions = document.createElement('div');
                    actions.classList.add('appointment-actions');
                    actions.innerHTML = `
                        <button class="accept-btn" data-id="${rdv.id}">Accepter</button>
                        <button class="decline-btn" data-id="${rdv.id}">Refuser</button>
                    `;
                    rdvElement.appendChild(actions);
                }
            });
        }

        // Handle accept/decline actions for employees
        if (role === 'employe') {
            document.querySelectorAll('.accept-btn').forEach((btn) => {
                btn.addEventListener('click', async (e) => {
                    const rdvId = e.target.dataset.id;
                    await updateRdvStatus(rdvId, 'accepté');
                });
            });

            document.querySelectorAll('.decline-btn').forEach((btn) => {
                btn.addEventListener('click', async (e) => {
                    const rdvId = e.target.dataset.id;
                    await updateRdvStatus(rdvId, 'refusé');
                });
            });
        }

        // Update orders for clients
        if (role === 'client') {
            const ordersSection = document.getElementById('orders-section');
            ordersSection.style.display = 'block'; // Show orders section

            const ordersList = document.getElementById('orders-list');
            ordersList.innerHTML = ''; // Clear existing content

            if (data.commandes && data.commandes.length === 0) {
                ordersList.innerHTML = '<p>Aucune Commande</p>';
            } else {
                data.commandes.forEach((commande) => {
                    const orderElement = document.createElement('div');
                    orderElement.classList.add('order-item');
                    orderElement.innerHTML = `
                        <p><strong>Commande ID:</strong> ${commande.id}</p>
                        <p><strong>Détails:</strong> ${commande.details}</p>
                        <p><strong>Total:</strong> ${commande.total} €</p>
                        <p><strong>Date:</strong> ${commande.created_at}</p>
                    `;
                    ordersList.appendChild(orderElement);
                });
            }
        }
    } catch (err) {
        console.error(err.message);
        alert('Erreur lors de la récupération des données du profil.');
    }

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token'); // Remove the token
        localStorage.removeItem('role'); // Remove the role
        window.location.href = 'login.html'; // Redirect to login page
    });
});

// Update RDV status
async function updateRdvStatus(rdvId, statut) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/employe/rdvs/${rdvId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ statut }),
        });

        if (response.ok) {
            alert('Statut mis à jour avec succès.');
            window.location.reload(); // Reload the page to reflect changes
        } else {
            alert('Erreur lors de la mise à jour du statut.');
        }
    } catch (err) {
        console.error(err.message);
        alert('Erreur serveur.');
    }
}