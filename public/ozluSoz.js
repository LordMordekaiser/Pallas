document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const kategoriAdi = urlParams.get("kategori");

  // Özlü söz ve söyleyen kişi bilgilerini kategori tablosundan çekerek ekrana ekler
  fetch("/kategoriler")
    .then((response) => response.json())
    .then((kategoriler) => {
      const kategoriAdi = new URLSearchParams(window.location.search).get(
        "kategori"
      );
      const kategori = kategoriler.find(
        (kat) => kat.kategori_adi === kategoriAdi
      );

      if (kategori) {
        const ozluSozElement = document.getElementById("ozluSoz");
        const soyleyenKisiElement = document.getElementById("soyleyenKisi");

        ozluSozElement.textContent = kategori.ozlu_soz;
        soyleyenKisiElement.textContent = `-${kategori.soyleyen_kisi}`;
      }
    })
    .catch((error) => console.error("Kategori alınırken hata:", error));
});
