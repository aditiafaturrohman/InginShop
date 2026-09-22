const products=[
{id:1,name:"Wireless Headphone Pro",category:"Elektronik",price:699000,rating:4.9,emoji:"🎧",sold:1280},
{id:2,name:"Smartwatch Active X",category:"Elektronik",price:549000,rating:4.8,emoji:"⌚",sold:980},
{id:3,name:"Oversized Basic Tee",category:"Fashion",price:129000,rating:4.7,emoji:"👕",sold:2100},
{id:4,name:"Sneakers Urban One",category:"Fashion",price:459000,rating:4.8,emoji:"👟",sold:870},
{id:5,name:"Backpack Daily Pack",category:"Lifestyle",price:299000,rating:4.6,emoji:"🎒",sold:760},
{id:6,name:"Tumbler Thermal 500ml",category:"Lifestyle",price:159000,rating:4.9,emoji:"🥤",sold:1540},
{id:7,name:"Football Training Ball",category:"Olahraga",price:199000,rating:4.7,emoji:"⚽",sold:540},
{id:8,name:"Yoga Mat Comfort",category:"Olahraga",price:179000,rating:4.8,emoji:"🧘",sold:620}
];

let cart=JSON.parse(localStorage.getItem("nusashop-cart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("nusashop-wishlist")||"[]");
let activeFilter="Semua";

const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const $=id=>document.getElementById(id);

function save(){localStorage.setItem("nusashop-cart",JSON.stringify(cart));localStorage.setItem("nusashop-wishlist",JSON.stringify(wishlist));}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}

function renderProducts(){
  const q=$("searchInput").value.toLowerCase().trim();
  let list=products.filter(p=>(activeFilter==="Semua"||p.category===activeFilter)&&p.name.toLowerCase().includes(q));
  const sort=$("sortSelect").value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
  $("productGrid").innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-image"><button class="wish ${wishlist.includes(p.id)?"active":""}" onclick="toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button><span>${p.emoji}</span></div>
      <div class="product-info"><span class="category">${p.category.toUpperCase()}</span><h3>${p.name}</h3><div class="rating">★ ${p.rating} <span style="color:var(--muted)">• ${p.sold}+ terjual</span></div><div class="price">${rupiah(p.price)}</div><button class="add" onclick="addCart(${p.id})">+ Tambah ke keranjang</button></div>
    </article>`).join("");
  $("emptyState").hidden=list.length>0;
}

function addCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  save();renderCart();toast("Produk ditambahkan ke keranjang");
}
function updateQty(id,delta){
  const item=cart.find(x=>x.id===id);if(!item)return;
  item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  save();renderCart();
}
function removeCart(id){cart=cart.filter(x=>x.id!==id);save();renderCart();toast("Produk dihapus")}
function clearCart(){if(!cart.length)return;cart=[];save();renderCart();toast("Keranjang dikosongkan")}
function cartTotal(){return cart.reduce((sum,x)=>{const p=products.find(p=>p.id===x.id);return sum+(p?p.price*x.qty:0)},0)}

function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  $("cartCount").textContent=count;
  $("cartTotal").textContent=rupiah(cartTotal());
  $("checkoutTotal").textContent=rupiah(cartTotal());
  $("cartItems").innerHTML=cart.length?cart.map(x=>{
    const p=products.find(p=>p.id===x.id);
    return `<div class="cart-row"><div class="cart-thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${rupiah(p.price)}</small><div class="qty"><button onclick="updateQty(${p.id},-1)">−</button><b>${x.qty}</b><button onclick="updateQty(${p.id},1)">+</button><button class="remove" onclick="removeCart(${p.id})">Hapus</button></div></div><strong>${rupiah(p.price*x.qty)}</strong></div>`;
  }).join(""):`<div class="empty"><div style="font-size:50px">🛒</div><p>Keranjang masih kosong.</p><button class="btn primary" onclick="closeCart()">Mulai Belanja</button></div>`;
}

function toggleWish(id){wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();renderProducts();toast(wishlist.includes(id)?"Ditambahkan ke wishlist":"Dihapus dari wishlist")}
function openCart(){$("cartDrawer").classList.add("open");$("overlay").classList.add("show")}
function closeCart(){$("cartDrawer").classList.remove("open");$("overlay").classList.remove("show")}
function openCheckout(){
  if(!cart.length){toast("Keranjang masih kosong");return}
  closeCart();$("checkoutModal").classList.add("show");$("checkoutTotal").textContent=rupiah(cartTotal());
}
function closeCheckout(){$("checkoutModal").classList.remove("show")}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");activeFilter=btn.dataset.filter;renderProducts()}));
document.querySelectorAll(".category-card").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));document.querySelector("#products").scrollIntoView({behavior:"smooth"});renderProducts()}));
$("searchInput").addEventListener("input",renderProducts);
$("sortSelect").addEventListener("change",renderProducts);
$("cartBtn").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);
$("clearCart").addEventListener("click",clearCart);$("checkoutBtn").addEventListener("click",openCheckout);
$("closeModal").addEventListener("click",closeCheckout);$("checkoutModal").addEventListener("click",e=>{if(e.target===$("checkoutModal"))closeCheckout()});
$("promoBtn").addEventListener("click",()=>toast("Kode promo NUSA40 siap digunakan saat checkout!"));
$("menuBtn").addEventListener("click",()=>$("mobileMenu").classList.toggle("show"));
document.querySelectorAll("#mobileMenu a").forEach(a=>a.addEventListener("click",()=>$("mobileMenu").classList.remove("show")));
$("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");$("themeBtn").textContent=document.body.classList.contains("dark")?"☀️":"🌙";localStorage.setItem("nusashop-dark",document.body.classList.contains("dark"))});
if(localStorage.getItem("nusashop-dark")==="true"){document.body.classList.add("dark");$("themeBtn").textContent="☀️"}
$("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const order="NS"+Date.now().toString().slice(-8);
  cart=[];save();renderCart();closeCheckout();
  e.target.reset();toast("Pesanan "+order+" berhasil dibuat! (Demo)");
});
renderProducts();renderCart();
