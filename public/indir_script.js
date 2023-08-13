// indir_script.js

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isbn = urlParams.get("isbn");

  fetch(`/kitaplar/${isbn}`)
    .then((response) => response.json())
    .then((kitap) => {
      // Kitap verilerini sayfaya yerleştir
      document.getElementById("kitap-adi").textContent = kitap.kitap_adi;
      document.getElementById("yazar").textContent = kitap.yazar;
      document.getElementById("yayinevi").textContent = kitap.yayinevi;
      document.getElementById("yayin-yili").textContent = kitap.yayin_yili;
      document.getElementById("sayfa").textContent = kitap.sayfa_sayisi;
      document.getElementById("isbn").textContent = kitap.isbn;
      document.getElementById("ozet").textContent = kitap.aciklama;
      document.getElementById("kitapResim").src = kitap.kapak_yolu;

      // İndirme butonuna tıklama olayını ekle
      const indirmeButon = document.getElementById("indirmeButon");
      indirmeButon.addEventListener("click", () => {
        window.open(kitap.indirme_linki, "_blank");
      });
    })
    .catch((error) => console.error("Kitap verisi alınırken hata:", error));
});
