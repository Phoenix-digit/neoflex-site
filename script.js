
const params = new URLSearchParams(window.location.search);
const wa = params.get('wa');
if (wa) {
  document.querySelectorAll('a[href="https://wa.me/"]').forEach(a => {
    a.href = `https://wa.me/${wa}`;
  });
}
