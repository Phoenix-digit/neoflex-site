const whatsappNumber = "22870613738";

const packSelect = document.getElementById("packSelect");
const paymentSelect = document.getElementById("paymentSelect");
const deliverySelect = document.getElementById("deliverySelect");
const customerName = document.getElementById("customerName");
const customerArea = document.getElementById("customerArea");
const customerPhone = document.getElementById("customerPhone");
const totalDisplay = document.getElementById("totalDisplay");
const generateWhatsAppBtn = document.getElementById("generateWhatsAppBtn");

function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

function getCurrentOrderData() {
  const [packName, packPriceRaw] = packSelect.value.split("|");
  const [deliveryName, deliveryPriceRaw] = deliverySelect.value.split("|");

  const packPrice = Number(packPriceRaw);

  let totalText = "";
  let deliveryText = deliveryName;

  if (deliveryPriceRaw === "discuter") {
    totalText = formatPrice(packPrice) + " + livraison à confirmer";
  } else {
    const deliveryPrice = Number(deliveryPriceRaw);
    totalText = formatPrice(packPrice + deliveryPrice);
  }

  return {
    packName,
    packPrice,
    payment: paymentSelect.value,
    deliveryName: deliveryText,
    deliveryPriceRaw,
    totalText
  };
}

function updateTotal() {
  const data = getCurrentOrderData();
  totalDisplay.textContent = data.totalText;
}

function generateWhatsAppMessage() {
  const data = getCurrentOrderData();

  const name = customerName.value.trim() || "À compléter";
  const area = customerArea.value.trim() || "À compléter";
  const phone = customerPhone.value.trim() || "À compléter";

  let deliveryLine = data.deliveryName;
  if (data.deliveryPriceRaw !== "discuter") {
    const deliveryPrice = Number(data.deliveryPriceRaw);
    deliveryLine += " — " + formatPrice(deliveryPrice);
  } else {
    deliveryLine += " — tarif à confirmer";
  }

  const message =
`Bonjour Neoflex Store,
je veux commander le Phoenix Budget Control.

Pack : ${data.packName} — ${formatPrice(data.packPrice)}
Paiement : ${data.payment}
Livraison : ${deliveryLine}
Total estimé : ${data.totalText}

Nom : ${name}
Quartier / Zone : ${area}
Numéro : ${phone}`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

if (packSelect && paymentSelect && deliverySelect && totalDisplay && generateWhatsAppBtn) {
  updateTotal();

  packSelect.addEventListener("change", updateTotal);
  deliverySelect.addEventListener("change", updateTotal);
  paymentSelect.addEventListener("change", updateTotal);

  generateWhatsAppBtn.addEventListener("click", generateWhatsAppMessage);
}
