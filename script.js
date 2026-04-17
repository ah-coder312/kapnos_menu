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
        // تم مسح سطر showCategory('hot') من هنا نهائياً ❌
        
        // اختيار اختياري: لو عاوز تمسح الـ Active من أول زرار في البداية
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    }
}
// جوه دالة عرض المنتجات
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
    container.innerHTML = "";

    // تحديث شكل الأزرار
    if(element) {
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');
    }

  // ابحث عن سطر الفلترة في ملف script.js وعدله كدة:
      const filtered = menuData.filter(p => p.category === cat && p.is_hidden !== true);
    filtered.forEach(p => {
        // لو فيه خصم اعرض السعر القديم
        const priceHTML = p.discount_price 
            ? `<span class="old-price">${p.price}</span><span>${p.discount_price} ج.م</span>`
            : `<span>${p.price} ج.م</span>`;

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
