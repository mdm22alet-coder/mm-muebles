const products = [
  {id:1,name:"Sofá Áureo",category:"Sala",price:2890000,tag:"Favorito",image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",description:"Sofá de tres puestos con líneas contemporáneas, tapizado suave y comodidad pensada para compartir."},
  {id:2,name:"Mesa Verona",category:"Comedor",price:1850000,tag:"Nuevo",image:"https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=85",description:"Mesa de comedor de silueta limpia, elaborada para reuniones que se quedan en la memoria."},
  {id:3,name:"Cama Serena",category:"Habitación",price:3240000,tag:"Exclusivo",image:"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",description:"Una cama envolvente y sofisticada que convierte tu habitación en un verdadero refugio."},
  {id:4,name:"Sillón Nido",category:"Sala",price:1190000,tag:"Favorito",image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",description:"Sillón individual de curvas acogedoras para crear ese rincón especial de lectura y descanso."},
  {id:5,name:"Escritorio Nobile",category:"Oficina",price:1560000,tag:"Nuevo",image:"https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=85",description:"Un escritorio funcional y elegante para que cada día de trabajo se sienta inspirador."},
  {id:6,name:"Buffet Imperia",category:"Comedor",price:2180000,tag:"Exclusivo",image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",description:"Almacenamiento refinado con una presencia discreta y detalles de acabado premium."},
  {id:7,name:"Mesa Lateral Aura",category:"Sala",price:680000,tag:"Nuevo",image:"https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=85",description:"El detalle perfecto para complementar tu sala con textura, calidez y funcionalidad."},
  {id:8,name:"Consola Dorada",category:"Habitación",price:1370000,tag:"Favorito",image:"https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=85",description:"Consola de líneas ligeras que aporta orden y estilo a entradas, habitaciones o pasillos."}
];

const $ = (selector) => document.querySelector(selector);
const number = new Intl.NumberFormat("es-CO", {style:"currency", currency:"COP", maximumFractionDigits:0});
const state = {filter:"Todos", search:"", all:false, favorites:new Set(), cart:[]};

function matchingProducts() {
  const search = state.search.trim().toLocaleLowerCase("es");
  return products.filter((product) => (state.filter === "Todos" || product.category === state.filter) && (!search || `${product.name} ${product.category}`.toLocaleLowerCase("es").includes(search)));
}

function productTemplate(product) {
  const favorite = state.favorites.has(product.id);
  return `<article class="product-card">
    <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="tag">${product.tag}</span><button class="favorite ${favorite ? "active" : ""}" data-favorite="${product.id}" aria-label="${favorite ? "Quitar de" : "Agregar a"} favoritos">${favorite ? "♥" : "♡"}</button></div>
    <div class="product-info"><small>${product.category}</small><button class="product-detail" data-details="${product.id}"><h3>${product.name}</h3></button><div class="product-bottom"><span class="price">${number.format(product.price)}</span><button class="add" data-add="${product.id}">Agregar</button></div></div>
  </article>`;
}

function renderProducts() {
  const available = matchingProducts();
  const shown = state.all ? available : available.slice(0, 4);
  $("#product-grid").innerHTML = shown.map(productTemplate).join("");
  $("#empty").hidden = available.length !== 0;
  const toggle = $("#show-more");
  toggle.hidden = available.length <= 4;
  toggle.textContent = state.all ? "Mostrar menos" : `Ver ${available.length - 4} productos más`;
}

function getProduct(id) { return products.find((product) => product.id === Number(id)); }
function getCartItem(id) { return state.cart.find((item) => item.id === Number(id)); }
function addToCart(id) {
  const found = getCartItem(id);
  if (found) found.quantity += 1;
  else state.cart.push({id:Number(id), quantity:1});
  renderCart();
}
function changeQuantity(id, amount) {
  const item = getCartItem(id);
  if (!item) return;
  item.quantity += Number(amount);
  if (item.quantity < 1) state.cart = state.cart.filter((entry) => entry !== item);
  renderCart();
}
function removeFromCart(id) { state.cart = state.cart.filter((item) => item.id !== Number(id)); renderCart(); }
function renderCart() {
  const total = state.cart.reduce((sum,item) => sum + getProduct(item.id).price * item.quantity, 0);
  const count = state.cart.reduce((sum,item) => sum + item.quantity, 0);
  $("#cart-count").textContent = count;
  $("#cart-total").textContent = number.format(total);
  $("#cart-empty").hidden = count > 0;
  $("#cart-summary").hidden = count === 0;
  $("#cart-items").innerHTML = state.cart.map((item) => {
    const product = getProduct(item.id);
    return `<article class="cart-item"><img src="${product.image}" alt="${product.name}"><div><h3>${product.name}</h3><p>${number.format(product.price)}</p><div class="quantity"><button data-quantity="${product.id}" data-amount="-1" aria-label="Reducir cantidad">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-amount="1" aria-label="Aumentar cantidad">+</button></div></div><button class="remove" data-remove="${product.id}" aria-label="Eliminar ${product.name}">×</button></article>`;
  }).join("");
}

function lockPage(locked) { document.body.classList.toggle("locked", locked); }
function openCart() { $("#cart").classList.add("open"); $("#cart").setAttribute("aria-hidden","false"); $("#backdrop").hidden=false; lockPage(true); }
function closeCart() { $("#cart").classList.remove("open"); $("#cart").setAttribute("aria-hidden","true"); $("#backdrop").hidden=true; lockPage(false); }
function openModal(id) { $("#"+id).classList.add("open"); $("#"+id).setAttribute("aria-hidden","false"); lockPage(true); }
function closeModal(id) { $("#"+id).classList.remove("open"); $("#"+id).setAttribute("aria-hidden","true"); lockPage(false); }
function showDetails(id) {
  const product = getProduct(id);
  if (!product) return;
  $("#details-image").src = product.image; $("#details-image").alt = product.name;
  $("#details-category").textContent = product.category; $("#details-title").textContent = product.name;
  $("#details-description").textContent = product.description; $("#details-price").textContent = number.format(product.price);
  $("#details-add").dataset.id = product.id;
  openModal("details-modal");
}

function renderSearchResults(value) {
  const term = value.trim().toLocaleLowerCase("es");
  const matches = products.filter((product) => `${product.name} ${product.category}`.toLocaleLowerCase("es").includes(term));
  $("#search-results").innerHTML = !term ? "" : matches.length ? matches.map((product) => `<button class="search-item" data-search-result="${product.id}"><img src="${product.image}" alt=""><span><small>${product.category}</small><strong>${product.name}</strong></span></button>`).join("") : "<p>No encontramos resultados para tu búsqueda.</p>";
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button?.dataset.add) { addToCart(button.dataset.add); openCart(); }
  if (button?.dataset.favorite) { const id=Number(button.dataset.favorite); state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id); renderProducts(); }
  if (button?.dataset.details) showDetails(button.dataset.details);
  if (button?.dataset.quantity) changeQuantity(button.dataset.quantity, button.dataset.amount);
  if (button?.dataset.remove) removeFromCart(button.dataset.remove);
  if (button?.dataset.close) button.dataset.close === "cart" ? closeCart() : closeModal(button.dataset.close);
});

document.querySelectorAll(".filters button").forEach((button) => button.addEventListener("click", () => {
  state.filter = button.dataset.filter; state.all = false;
  document.querySelectorAll(".filters button").forEach((entry) => entry.classList.toggle("active", entry === button));
  renderProducts();
}));
document.querySelectorAll("[data-category]").forEach((link) => link.addEventListener("click", () => {
  state.filter=link.dataset.category; state.all=false;
  document.querySelector(`.filters [data-filter="${state.filter}"]`)?.click();
}));
$("#show-more").addEventListener("click", () => { state.all=!state.all; renderProducts(); });
$("#cart-toggle").addEventListener("click", openCart);
$("#backdrop").addEventListener("click", closeCart);
$("#search-toggle").addEventListener("click", () => { openModal("search-modal"); setTimeout(() => $("#search-input").focus(), 20); });
$("#search-input").addEventListener("input", (event) => renderSearchResults(event.target.value));
$("#search-results").addEventListener("click", (event) => { const match=event.target.closest("[data-search-result]"); if(match){ closeModal("search-modal"); showDetails(match.dataset.searchResult); } });
$("#details-add").addEventListener("click", (event) => { addToCart(event.currentTarget.dataset.id); closeModal("details-modal"); openCart(); });
$("#whatsapp-order").addEventListener("click", () => {
  const lines = state.cart.map((item) => { const product=getProduct(item.id); return `${item.quantity} x ${product.name} (${number.format(product.price * item.quantity)})`; }).join("\n");
  const message = `Hola MueblesPro, quiero pedir:%0A${encodeURIComponent(lines)}%0A%0ATotal estimado: ${encodeURIComponent($("#cart-total").textContent)}`;
  window.open(`https://wa.me/573000000000?text=${message}`, "_blank", "noopener");
});
$("#whatsapp").addEventListener("click", () => window.open("https://wa.me/573000000000?text=Hola%2C%20quiero%20información%20sobre%20MueblesPro.", "_blank", "noopener"));
$(".menu-button").addEventListener("click", (event) => { const nav=$("#nav"); nav.classList.toggle("open"); event.currentTarget.setAttribute("aria-expanded", nav.classList.contains("open")); });
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () => $("#nav").classList.remove("open")));
document.addEventListener("keydown", (event) => { if(event.key === "Escape") { closeCart(); closeModal("search-modal"); closeModal("details-modal"); } });

renderProducts();
renderCart();
