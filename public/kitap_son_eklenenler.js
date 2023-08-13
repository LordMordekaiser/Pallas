// Son eklenen kitapları çekme işlemi
function sonEklenenKitaplariCek(siralama, kategoriAdi) {
  return fetch("/sonEklenenler")
    .then((response) => response.json())
    .then((kitaplar) => {
      if (siralama === "alfabetik") {
        kitaplar.sort((a, b) => a.kitap_adi.localeCompare(b.kitap_adi));
      } else if (siralama === "son-eklenenler") {
        kitaplar.sort((a, b) => b.id - a.id);
      }

      // Kategoriye göre filtreleme
      if (kategoriAdi) {
        kitaplar = kitaplar.filter((kitap) => kitap.kategori === kategoriAdi);
      }

      kitaplariGoster(kitaplar, siralama);
    })
    .catch((error) => console.error("Kitaplar alınırken hata:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const siralama = urlParams.get("siralama") || "alfabetik";
  const kategoriAdi = urlParams.get("kategori"); // Kategori adını al

  sonEklenenKitaplariCek(siralama, kategoriAdi);


});
