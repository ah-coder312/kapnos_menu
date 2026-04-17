const SUPABASE_URL = 'https://ipyboqsodseqzkgqxjev.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_xZyMpi5Mfck4k-eQGSfteg_DkyH4jHN'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let menuData = [];

async function loadMenu() {
    const { data, error } = await _supabase.from('products').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        menuData = data;
        
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    }
}

function createItemHTML(item) {
    const hasDiscount = item.discount_price && item.discount_price < item.price;
    const badgeHTML = item.badge ? `<span class="badge">${item.badge}</span>` : '';

    return `
        <div class="product-item">
            <div class="name-area">
                ${badgeHTML}
                <span class="p-name">${item.name}</span>
            </div>
            <span class="p-dots"></span>
            <div class="price-area">
                ${hasDiscount ? `<span class="old-price">${item.price}</span>` : ''}
                <span class="final-price">${hasDiscount ? item.discount_price : item.price} EGP</span>
            </div>
        </div>
    `;
}

function showCategory(cat, element) {
    const container = document.getElementById('products-container');
    const categoryNav = document.querySelector('.category-nav');
    const backContainer = document.getElementById('back-container');


    container.innerHTML = "";

    
    if (categoryNav) categoryNav.style.display = 'none';
    

    if (backContainer) backContainer.style.display = 'block';


    const filtered = menuData.filter(p => p.category === cat && p.is_hidden !== true);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#666; padding:50px;">قريباً في كابنوس.. خليك مستعد!</p>`;
    }

    filtered.forEach(p => {
        
        const priceHTML = p.discount_price 
            ? `<span class="old-price">${p.price}</span><span>${p.discount_price} EGP</span>`
            : `<span>${p.price} EGP</span>`;

        container.innerHTML += `
            <div class="item-row">
                <div class="item-info">
                    <span class="item-name">${p.name}</span>
                    <span class="item-desc">${p.description || ''}</span>
                </div>
                <div class="item-price">${priceHTML}</div>
            </div>`;
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function goBack() {
    document.querySelector('.category-nav').style.display = 'grid'; // رجوع الأقسام
    document.getElementById('back-container').style.display = 'none'; // إخفاء الزرار
    document.getElementById('products-container').innerHTML = ""; // مسح المنتجات
    window.scrollTo({ top: 0, behavior: 'smooth' });
} 
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const container = document.getElementById('products-container');
    const nav = document.querySelector('.category-nav');
    const backBtn = document.getElementById('back-container');

      
    if (term.trim() !== "") {
       
        if (nav) nav.style.display = 'none';
        if (backBtn) backBtn.style.display = 'block';

       
        const filtered = menuData.filter(p => 
            p.name.toLowerCase().includes(term) && p.is_hidden !== true
        );

      
        displayResults(filtered); 
    } else {
       
        goBack();
    }
});


function displayResults(items) {
    const container = document.getElementById('products-container');
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#888; padding:20px;'>مفيش صنف بالاسم ده يا غالي</p>";
        return;
    }

    items.forEach(p => {
      
        const priceHTML = p.discount_price 
            ? `<span class="old-price">${p.price}</span><span>${p.discount_price} EGP</span>`
            : `<span>${p.price} EGP</span>`;

        container.innerHTML += `
            <div class="item-row">
                <div class="item-info">
                    <span class="item-name">${p.name}</span>
                    <span class="item-desc">${p.description || ''}</span>
                </div>
                <div class="item-price">${priceHTML}</div>
            </div>`;
    });
}
document.addEventListener("DOMContentLoaded", loadMenu);
