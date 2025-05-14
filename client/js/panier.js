const cartTableBody = document.querySelector('#cartTable tbody');
const totalAmountEl = document.getElementById('totalAmount');
const orderForm = document.getElementById('orderForm');

let panier = JSON.parse(localStorage.getItem('panier')) || [];

function updateCartDisplay() {
  cartTableBody.innerHTML = '';
  let total = 0;

  panier.forEach((prod, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${prod.name}</td>
      <td>${prod.price} DA</td>
      <td><button onclick="removeProduct(${index})">Supprimer</button></td>
    `;
    cartTableBody.appendChild(row);
    total += parseFloat(prod.price);
  });

  totalAmountEl.textContent = total.toFixed(2) + ' DA';
}

function removeProduct(index) {
  panier.splice(index, 1);
  localStorage.setItem('panier', JSON.stringify(panier));
  updateCartDisplay();
}

updateCartDisplay();

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const address = document.getElementById('clientAddress').value.trim();
  const produits = panier.map(p => p.name);

  if (!name || !phone || !address || produits.length === 0) {
    alert('Veuillez remplir tous les champs et ajouter au moins un produit.');
    return;
  }

  const total = parseFloat(totalAmountEl.textContent);
  const data = { nom: name, tel: phone, adresse: address, produits, total };

  try {
    const res = await fetch('http://localhost:3001/api/commandes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message || 'Commande envoyée ✅');
      localStorage.removeItem('panier');
      window.location.href = '/index.html';
    } else {
      alert(result.error || 'Erreur lors de la commande ❌');
    }
  } catch (err) {
    alert('Erreur réseau');
  }
});


  // Simulate login (this should be replaced with actual login logic)
  document.getElementById('login-btn').addEventListener('click', () => {
    localStorage.setItem('isAuthenticated', 'true'); // Set user as authenticated
    window.location.href = 'index.html'; // Redirect to home page
  });