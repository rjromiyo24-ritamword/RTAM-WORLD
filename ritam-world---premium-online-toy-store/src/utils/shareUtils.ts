import { Product } from '../types';

export function getProductPermalink(productId: string, isShort = false): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  if (isShort) {
    return `${origin}${pathname}#p=${productId}`;
  }
  return `${origin}${pathname}#product=${productId}`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed', err);
    return false;
  }
}

export function updateProductMetaTags(product: Product, storeName = 'Ritam World') {
  if (!product) return;

  const title = `${product.titleBn || product.title} | ${storeName}`;
  const description = product.description 
    ? product.description.replace(/<[^>]*>?/gm, '').slice(0, 160)
    : `ব্র্যান্ড: ${product.brand} | মূল্য: ৳${product.discountPrice || product.price} | ক্যাটাগরি: ${product.categoryBn || product.category}`;
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : `${window.location.origin}/logo.png`;
  const url = getProductPermalink(product.id);

  // Update Title
  document.title = title;

  // Helper to set or create meta tag
  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrVal);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Open Graph / Facebook / WhatsApp
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', url);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'product');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', storeName);
  setMetaTag('meta[property="product:price:amount"]', 'property', 'product:price:amount', String(product.discountPrice || product.price));
  setMetaTag('meta[property="product:price:currency"]', 'property', 'product:price:currency', 'BDT');

  // Twitter Cards
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
}

export function getSocialShareLinks(product: Product, customUrl?: string) {
  const url = customUrl || getProductPermalink(product.id);
  const title = product.titleBn || product.title;
  const price = product.discountPrice || product.price;
  const text = `🔥 ${title} - বিশেষ মূল্য: ৳${price}\nরিটাম ওয়ার্ল্ড থেকে কিনুন:`;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${text} ${url}`);
  const encodedTitle = encodeURIComponent(title);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    messenger: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(text)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(text)}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`আসসালামু আলাইকুম,\n\nআমি আপনাকে এই অসাধারণ পণ্যটি দেখার জন্য আমন্ত্রণ জানাচ্ছি:\n${title}\nমূল্য: ৳${price}\n\nপণ্যটি দেখতে নিচের লিংকে ক্লিক করুন:\n${url}\n\nধন্যবাদ!`)}`,
  };
}
