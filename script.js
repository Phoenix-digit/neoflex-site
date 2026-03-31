  const WHATSAPP_NUMBER = '22870613738';

  const packSelect = document.getElementById('packSelect');
  const paymentSelect = document.getElementById('paymentSelect');
  const deliverySelect = document.getElementById('deliverySelect');
  const customerName = document.getElementById('customerName');
  const customerArea = document.getElementById('customerArea');
  const customerPhone = document.getElementById('customerPhone');
  const premiumExpenses = document.getElementById('premiumExpenses');
  const premiumExpenseField = document.getElementById('premiumExpenseField');
  const customerNote = document.getElementById('customerNote');

  const summaryPack = document.getElementById('summaryPack');
  const summaryPayment = document.getElementById('summaryPayment');
  const summaryDelivery = document.getElementById('summaryDelivery');
  const totalDisplay = document.getElementById('totalDisplay');
  const messagePreview = document.getElementById('messagePreview');

  function formatFcfa(value) {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  }

  function togglePremiumField() {
    if (!packSelect || !premiumExpenseField || !premiumExpenses) return;
    const [packName] = packSelect.value.split('|');
    const isPremium = packName === 'Premium';
    premiumExpenseField.classList.toggle('hidden', !isPremium);
    if (!isPremium) premiumExpenses.value = '';
  }

  function buildMessage() {
    const [packName, packPriceRaw] = packSelect.value.split('|');
    const [deliveryName, deliveryPriceRaw] = deliverySelect.value.split('|');
    const payment = paymentSelect.value;
    const name = customerName.value.trim() || 'À préciser';
    const area = customerArea.value.trim() || 'À préciser';
    const phone = customerPhone.value.trim() || 'À préciser';
    const expenses = premiumExpenses ? premiumExpenses.value.trim() : '';
    const note = customerNote.value.trim();

    const packPrice = Number(packPriceRaw || 0);
    const deliveryPrice = deliveryPriceRaw === 'discuter' ? null : Number(deliveryPriceRaw || 0);
    const total = deliveryPrice === null ? null : packPrice + deliveryPrice;

    summaryPack.textContent = `${packName} — ${formatFcfa(packPrice)}`;
    summaryPayment.textContent = payment;
    summaryDelivery.textContent = deliveryPrice === null
      ? `${deliveryName} — à discuter`
      : `${deliveryName} — ${formatFcfa(deliveryPrice)}`;
    totalDisplay.textContent = total === null ? 'À confirmer sur WhatsApp' : formatFcfa(total);

    const lines = [
  'Bonjour Neoflex Store,',
  '',
  'Je souhaite commander le Phoenix Budget Control.',
  '',
  '=== DÉTAILS COMMANDE ===',
  `Pack : ${packName} — ${formatFcfa(packPrice)}`,
  `Paiement : ${payment}`,
  `Livraison : ${deliveryLabel}`,
  `Total estimé : ${totalLabel}`,
  '',
  '=== INFORMATIONS CLIENT ===',
  `Nom : ${name}`,
  `Zone : ${area}`,
  `Numéro : ${phone}`
];

if (packName === 'Premium' && expenses) {
  lines.push(`Chefs de dépense : ${expenses}`);
}

if (note) {
  lines.push('', `Note : ${note}`);
}

lines.push(
  '',
  'Je confirme vouloir passer commande immédiatement.',
  'Merci de me confirmer la disponibilité pour procéder au paiement.'
);

    if (packName === 'Premium' && expenses) {
      lines.push(`Chefs de dépense : ${expenses}`);
    }

    if (note) {
      lines.push(`Note : ${note}`);
    }

    lines.push('', 'Je confirme vouloir passer commande.', 'Merci de me confirmer la disponibilité.');

    const message = lines.join('\n');
    messagePreview.textContent = message;
    return message;
  }

  function openWhatsApp() {
    const message = buildMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  function copyMessage() {
    const message = buildMessage();
    navigator.clipboard.writeText(message).then(() => {
      const button = document.getElementById('copyMessageBtn');
      const initial = button.textContent;
      button.textContent = 'Message copié';
      setTimeout(() => button.textContent = initial, 1800);
    });
  }

  const productVideos = [
    'assets/videos/15.07.01.mp4',
    'assets/videos/15.07.08.mp4',
    'assets/videos/15.07.28.mp4',
    'assets/videos/15.07.29.mp4'
  ];

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function initProductCarousel() {
    const mainVideo = document.getElementById('mainProductVideo');
    const thumbsContainer = document.getElementById('videoThumbs');
    if (!mainVideo || !thumbsContainer) return;

    const orderedVideos = shuffleArray(productVideos);

    function setMainVideo(src) {
      mainVideo.src = src;
      mainVideo.load();

      [...thumbsContainer.querySelectorAll('.video-thumb')].forEach((el) => {
        el.classList.toggle('active', el.dataset.src === src);
      });
    }

    thumbsContainer.innerHTML = '';

    orderedVideos.forEach((src, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'video-thumb';
      btn.dataset.src = src;
      btn.innerHTML = `
        <video muted playsinline preload="metadata">
          <source src="${src}" type="video/mp4">
        </video>
      `;
      btn.addEventListener('click', () => setMainVideo(src));
      thumbsContainer.appendChild(btn);

      if (index === 0) {
        setMainVideo(src);
      }
    });
  }

  [packSelect, paymentSelect, deliverySelect, customerName, customerArea, customerPhone, premiumExpenses, customerNote]
    .filter(Boolean)
    .forEach((el) => el.addEventListener('input', buildMessage));

  if (packSelect) {
    packSelect.addEventListener('change', () => {
      togglePremiumField();
      buildMessage();
    });
  }

  document.getElementById('generateWhatsAppBtn').addEventListener('click', openWhatsApp);
  document.getElementById('copyMessageBtn').addEventListener('click', copyMessage);

  togglePremiumField();
  buildMessage();
  initProductCarousel();
