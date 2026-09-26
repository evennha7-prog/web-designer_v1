// Home Page Controller
document.addEventListener('DOMContentLoaded', () => {
  const bestsellersGrid = document.getElementById('bestsellers-grid');
  if (!bestsellersGrid) return;

  // Render the curated best sellers matching Screenshot 2
  // Products: Aloe Vera (id: 4), Fiddle Leaf Fig (id: 5), Monstera Deliciosa (id: 6), Snake Plant (id: 7)
  const bestSellerIds = [4, 5, 6, 7, 1, 2, 9, 3];
  const items = bestSellerIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  bestsellersGrid.innerHTML = items.map(p => createProductCardHTML(p)).join('');
});

function openHomeSearch() {
  window.location.href = '../shop/shop.html';
}
