/* GIANATO prototype — core: data, formatting, images, cart store, analytics.
   The Shopify theme does the same jobs in Liquid + theme/assets/*.js; this file only powers the static prototype. */
(() => {
  const S = window.GIANATO_SITE;
  const G = (window.G = { site: S, data: null });

  /* ---------- DOM helpers ---------- */
  G.$ = (s, el = document) => el.querySelector(s);
  G.$$ = (s, el = document) => [...el.querySelectorAll(s)];
  G.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  G.param = k => new URLSearchParams(location.search).get(k);

  /* ---------- Money: « 1 620 DH » ---------- */
  G.money = n => `${Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ')} DH`;
  G.off = p => (p.compare > p.price ? Math.round((1 - p.price / p.compare) * 100) : 0);

  /* ---------- Images ---------- */
  const WIDTHS = [360, 540, 720, 960, 1200, 1600, 2000];
  G.src = (ref, w = 960) => {
    if (!ref) return '';
    if (ref.startsWith('img:')) return `assets/img/${ref.slice(4)}.webp`;
    const u = ref.startsWith('cdn:') ? ref.slice(4) : ref;
    return /cdn\.shopify\.com/.test(u) ? `${u}${u.includes('?') ? '&' : '?'}width=${w}` : u;
  };
  G.srcset = (ref, max = 2000) => {
    if (!ref || ref.startsWith('img:')) return '';
    return WIDTHS.filter(w => w <= max).map(w => `${G.src(ref, w)} ${w}w`).join(', ');
  };
  G.img = (ref, { sizes = '100vw', alt = '', cls = '', eager = false, max = 2000, w = 960 } = {}) =>
    `<img src="${G.src(ref, w)}"${G.srcset(ref, max) ? ` srcset="${G.srcset(ref, max)}" sizes="${sizes}"` : ''} alt="${G.esc(alt)}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>`;
  // Editorial product photos (lifestyle shots in the gallery) vs. packshots on white
  G.isPhoto = url => /\/products\/(DSC|CLD|IMG|MG_)/i.test(url);

  /* ---------- Catalogue ---------- */
  G.ready = fetch('data/catalog.json').then(r => r.json()).then(d => {
    G.data = d;
    G.byHandle = Object.fromEntries(d.products.map(p => [p.h, p]));
    G.byCol = Object.fromEntries(d.collections.map(c => [c.h, c]));
    return d;
  });
  G.product = h => G.byHandle[h];
  G.collection = h => G.byCol[h];
  G.colProducts = h => (G.byCol[h]?.products || []).map(G.product).filter(Boolean);
  G.siblings = p => p.siblings.map(G.product).filter(Boolean);
  G.styleLabel = p => p.style ? ({ Mocassin: 'Mocassin', Bottine: 'Bottine', Basket: 'Basket cuir', Boucles: 'Soulier à boucles', Richelieu: 'Richelieu', Derby: 'Derby', Maroquinerie: 'Mallette' })[p.style] : '';
  G.url = p => `product.html?p=${p.h}`;
  G.curl = h => `collection.html?c=${h}`;
  G.lowStock = p => p.available && p.sizes.filter(s => s.a).length <= 2 && p.sizes.length > 2;

  /* ---------- Cart (localStorage) → checkout on gianato.ma ---------- */
  const KEY = 'gianato.cart.v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const write = lines => { try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ } document.dispatchEvent(new CustomEvent('cart:change', { detail: lines })); };
  G.cart = {
    lines: read,
    count: () => read().reduce((n, l) => n + l.q, 0),
    add(h, id, q = 1) { const ls = read(); const l = ls.find(x => x.id === id); l ? (l.q += q) : ls.push({ h, id, q }); write(ls); },
    set(id, q) { write(read().map(l => (l.id === id ? { ...l, q } : l)).filter(l => l.q > 0)); },
    total: () => read().reduce((s, l) => s + (G.product(l.h)?.price || 0) * l.q, 0),
    // Real Shopify cart permalink: the order is completed on the live gianato.ma checkout
    checkoutUrl: () => `${S.shop.url}/cart/${read().map(l => `${l.id}:${l.q}`).join(',')}`,
  };

  /* ---------- Analytics (GA4 ecommerce schema, same events as the theme) ---------- */
  window.dataLayer = window.dataLayer || [];
  G.item = (p, extra = {}) => ({ item_id: String(p.sizes[0]?.id || p.h), item_name: p.title, item_brand: 'GIANATO', item_category: p.style || p.type, item_variant: p.cw, price: p.price, quantity: 1, ...extra });
  G.track = (event, ecommerce = {}) => {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({ event, ecommerce: { currency: 'MAD', ...ecommerce } });
  };

  /* ---------- WhatsApp ---------- */
  G.wa = text => `https://wa.me/${S.shop.whatsapp}?text=${encodeURIComponent(text)}`;
})();
