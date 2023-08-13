document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/kategoriler");
    const kategoriler = await response.json();

    const kategoriBloklari = document.getElementById("kategori-bloklari");

    // Kategorileri alfabetik olarak sırala
    const siraliKategorilerAlfabetik = kategoriler.slice().sort((a, b) => {
      return a.kategori_adi.localeCompare(b.kategori_adi);
    });

    // Kategorileri sayfaya ekle
    function kategorileriEkle(kategorilerListesi) {
      kategorilerListesi.forEach((kategori) => {
        const kategoriDiv = document.createElement("div");
        kategoriDiv.className = "uzay";

        const kategoriIcon = document.createElement("img");
        kategoriIcon.className = "uzay-icon";
        kategoriIcon.src = kategori.icon_yolu;

        const kategoriAd = document.createElement("div");
        kategoriAd.className = "uzay1";
        kategoriAd.textContent = kategori.kategori_adi;

        kategoriDiv.appendChild(kategoriIcon);
        kategoriDiv.appendChild(kategoriAd);

        kategoriDiv.addEventListener("click", () => {
          // Seçilen kategorinin adını al ve URL parametresi olarak ekleyerek "kitap_listesi_index.html" sayfasına yönlendir
          const url = new URL(
            "./kitap_listesi_index.html",
            window.location.href
          );
          url.searchParams.set("kategori", kategori.kategori_adi);
          window.location.href = url.toString();
        });

        kategoriBloklari.appendChild(kategoriDiv);
      });
    }

    kategorileriEkle(siraliKategorilerAlfabetik);

    // "Kitap sayısına göre sırala" filtresine tıklandığında kategorileri sırala
    const kitapSayisiSiralamaFiltresi = document.querySelector(
      '[data-filter="kitap-sayisi"]'
    );

    kitapSayisiSiralamaFiltresi.addEventListener("click", () => {
      const siraliKategorilerKitapSayisi = kategoriler.slice().sort((a, b) => {
        return b.kitap_sayisi - a.kitap_sayisi;
      });

      kategoriBloklari.innerHTML = "";
      kategorileriEkle(siraliKategorilerKitapSayisi);
    });

    // "Alfabeye göre sırala" filtresine tıklandığında kategorileri sırala
    const alfabetikSiralamaFiltresi = document.querySelector(
      '[data-filter="alfabe"]'
    );

    alfabetikSiralamaFiltresi.addEventListener("click", () => {
      kategoriBloklari.innerHTML = "";
      kategorileriEkle(siraliKategorilerAlfabetik);
    });

    // Tüm kitapları sıralama butonu
    const tumKitaplariSiralamaButonu = document.querySelector(
      '[data-filter="tum-kategoriler"]'
    );

    tumKitaplariSiralamaButonu.addEventListener("click", () => {
      const url = new URL("./kitap_listesi_index.html", window.location.href);
      url.searchParams.delete("siralama");
      window.location.href = url.toString();
    });
  } catch (error) {
    console.error("Kategoriler alınamadı:", error);
  }
});
