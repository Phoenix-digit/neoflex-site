const WHATSAPP_NUMBER = "22870613738";// Remplace par ton numéro WhatsApp Business sans + ni espaces

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
      const [packName] = packSelect.value.split('|');
      const isPremium = packName === 'Premium';

      premiumExpenseField.classList.toggle('hidden', !isPremium);

      if (!isPremium) {
        premiumExpenses.value = '';
      }
    }

    function buildMessage() {
      const [packName, packPriceRaw] = packSelect.value.split('|');
      const [deliveryName, deliveryPriceRaw] = deliverySelect.value.split('|');
      const payment = paymentSelect.value;
      const name = customerName.value.trim() || 'À préciser';
      const area = customerArea.value.trim() || 'À préciser';
      const phone = customerPhone.value.trim() || 'À préciser';
      const expenses = premiumExpenses.value.trim();
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
        'Bonjour Neoflex Store ',
        '',
        'Je souhaite commander le Phoenix Budget Control.',
        '',
        `Pack : ${packName} — ${formatFcfa(packPrice)}`,
        `Paiement : ${payment}`,
        `Livraison : ${deliveryPrice === null ? deliveryName + ' — à discuter' : deliveryName + ' — ' + formatFcfa(deliveryPrice)}`,
        `Total estimé : ${total === null ? 'à confirmer sur WhatsApp' : formatFcfa(total)}`,
        '',
        `Nom : ${name}`,
        `Quartier / Zone : ${area}`,
        `Numéro : ${phone}`
      ];

      if (note) {
        lines.push(`Note : ${note}`);
      }

      lines.push('', ' Je confirme vouloir passer commande.', 'Merci de me confirmer la disponibilité.');

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

    [packSelect, paymentSelect, deliverySelect, customerName, customerArea, customerPhone, customerNote]
      .forEach((el) => el.addEventListener('input', buildMessage));

    document.getElementById('generateWhatsAppBtn').addEventListener('click', openWhatsApp);
    document.getElementById('copyMessageBtn').addEventListener('click', copyMessage);

    buildMessage();
