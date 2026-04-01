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
  const personalizationCheckbox = document.getElementById('personalizationCheckbox');
  const videoPopup = document.getElementById('videoPopup');

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

    let packPrice = Number(packPriceRaw || 0);
    const personalizationPrice = 3500;
    const deliveryPrice = deliveryPriceRaw === 'discuter' ? null : Number(deliveryPriceRaw || 0);
    let total = deliveryPrice === null ? null : packPrice + deliveryPrice;

    let personalizationApplied = false;
    if (personalizationCheckbox && personalizationCheckbox.checked) {
      packPrice += personalizationPrice;
      personalizationApplied = true;
      total = deliveryPrice === null ? null : packPrice + deliveryPrice;
    }

    const deliveryLabel = deliveryPrice === null ? `${deliveryName} — à discuter` : `${deliveryName} — ${formatFcfa(deliveryPrice)}`;
    const totalLabel = total === null ? 'À confirmer sur WhatsApp' : formatFcfa(total);

    summaryPack.textContent = `${packName} — ${formatFcfa(packPrice)}` + (personalizationApplied ? ' (perso)' : '');
    summaryPayment.textContent = payment;
    summaryDelivery.textContent = deliveryLabel;
    totalDisplay.textContent = totalLabel;

    const lines = [
      'Bonjour Neoflex Store,',
      '',
      'Commande: Phoenix Budget Control',
      `Pack: ${packName} (${formatFcfa(packPrice)})`,
      `Paiement: ${payment}`,
      `Livraison: ${deliveryLabel}`,
      `Total: ${totalLabel}`,
      '',
      `Client: ${name} - ${area} - ${phone}`
    ];

    if (packName === 'Premium' && expenses) {
      lines.push(`Dépenses: ${expenses}`);
    }

    if (note) {
      lines.push(`Note: ${note}`);
    }

    if (personalizationApplied) {
      lines.push('Personnalisation: Oui (+3 500 FCFA)');
    }

    lines.push(
      '',
      'Je confirme la commande.',
      'Merci de confirmer disponibilité pour paiement.'
    );

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

  [packSelect, paymentSelect, deliverySelect, customerName, customerArea, customerPhone, premiumExpenses, customerNote, personalizationCheckbox]
    .filter(Boolean)
    .forEach((el) => el.addEventListener('input', buildMessage));

  if (packSelect) {
    packSelect.addEventListener('change', () => {
      togglePremiumField();
      buildMessage();
    });
  }

  if (packSelect && videoPopup) {
    packSelect.addEventListener('mouseenter', () => {
      videoPopup.classList.remove('hidden');
    });
    packSelect.addEventListener('mouseleave', () => {
      videoPopup.classList.add('hidden');
    });
  }

  document.getElementById('generateWhatsAppBtn').addEventListener('click', openWhatsApp);
  document.getElementById('copyMessageBtn').addEventListener('click', copyMessage);

  togglePremiumField();
  buildMessage();
  initProductCarousel();
