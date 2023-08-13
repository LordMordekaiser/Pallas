// Fonksiyon kitapları alfabetik olarak sıralar
function alfabetikSiralama(kitaplar) {
  return kitaplar.sort((a, b) => a.kitap_adi.localeCompare(b.kitap_adi));
}

// Fonksiyon kitapları son eklenenlere göre sıralar (id'ye göre)
function sonEklenenlerSiralama(kitaplar) {
  return kitaplar.sort((a, b) => b.id - a.id);
}

// Kitapları sayfada gösteren fonksiyon
function kitaplariGoster(kitaplar, siralama) {
  const kitaplarBlok = document.getElementById("kitaplarBlok");
  kitaplarBlok.innerHTML = ""; // Mevcut içeriği temizle

  const kitaplarPerSayfa = 15; // Her sayfada kaç kitap gösterileceği

  const urlParams = new URLSearchParams(window.location.search);
  const sayfaNumarasi = parseInt(urlParams.get("sayfa")) || 1;

  const baslangicIndex = (sayfaNumarasi - 1) * kitaplarPerSayfa;
  const bitisIndex = sayfaNumarasi * kitaplarPerSayfa;

  let siralanmisKitaplar;
  if (siralama === "alfabetik") {
    siralanmisKitaplar = alfabetikSiralama(kitaplar);
  } else if (siralama === "son-eklenenler") {
    siralanmisKitaplar = sonEklenenlerSiralama(kitaplar);
  }

  // Arama kutusundaki metni al
  const aramaMetni = document.getElementById("arama-input").value.toLowerCase();

  // Kitapları arama metnine göre filtrele
  siralanmisKitaplar = siralanmisKitaplar.filter(
    (kitap) =>
      kitap.kitap_adi.toLowerCase().includes(aramaMetni) ||
      kitap.yazar.toLowerCase().includes(aramaMetni) // Yazar adıyla da eşleşen kitapları göstermek için ekleme
  );

  const siraliSayfaSayisi = Math.ceil(
    siralanmisKitaplar.length / kitaplarPerSayfa
  );

  // Sayfa numarasını kontrol et ve düzelt
  if (sayfaNumarasi < 1) {
    window.location.search = urlParams.toString(); // URL'yi güncelle
    return;
  } else if (sayfaNumarasi > siraliSayfaSayisi) {
    const url = new URL(window.location);
    url.searchParams.set("sayfa", siraliSayfaSayisi);
    url.searchParams.set("siralama", siralama);
    window.location.href = url.toString();
    return;
  }

  const siraliBaslangicIndex = (sayfaNumarasi - 1) * kitaplarPerSayfa;
  const siraliBitisIndex = sayfaNumarasi * kitaplarPerSayfa;

  const siraliKitaplar = siralanmisKitaplar.slice(
    siraliBaslangicIndex,
    siraliBitisIndex
  );

  siraliKitaplar.forEach((kitap) => {
    // Kitapları ekrana eklemek için gerekli HTML içeriğini oluşturun
    let kisaltilmisKitapAdi = kitap.kitap_adi;
    if (kisaltilmisKitapAdi.length > 30) {
      kisaltilmisKitapAdi = kisaltilmisKitapAdi.substring(0, 30) + "...";
    }

    const kitapDiv = document.createElement("div");
    kitapDiv.classList.add("kitap");

    const kitapLink = document.createElement("a");
    kitapLink.href = `indir_index.html?isbn=${kitap.isbn}`;

    const kitapKapak = document.createElement("img");
    kitapKapak.classList.add("kitap-kapak");
    kitapKapak.src = kitap.kapak_yolu;

    const kitapAdi = document.createElement("div");
    kitapAdi.classList.add("kitap-adi");
    kitapAdi.textContent = kisaltilmisKitapAdi; // Kırpılmış kitap adını atama

    const kitapYazar = document.createElement("div");
    kitapYazar.classList.add("yazar");
    kitapYazar.textContent = kitap.yazar;

    kitapLink.appendChild(kitapKapak);
    kitapLink.appendChild(kitapAdi);

    kitapDiv.appendChild(kitapLink);
    kitapDiv.appendChild(kitapYazar);

    kitaplarBlok.appendChild(kitapDiv);
  });

  // Sayfalama düğmelerini oluştur
  const sayfaDugmeleriBlok = document.getElementById("paging-bar");
  sayfaDugmeleriBlok.innerHTML = ""; // Mevcut içeriği temizle

  for (let i = 1; i <= siraliSayfaSayisi; i++) {
    const sayfaDugme = document.createElement("div");
    sayfaDugme.textContent = i;
    sayfaDugme.classList.add("sayi");
    if (i === sayfaNumarasi) {
      sayfaDugme.classList.add("aktif"); // Aktif sayfa vurgusu
    } else {
      sayfaDugme.addEventListener("click", () => {
        // Sayfa düğmesine tıklandığında URL'i güncelle ve sayfayı yeniden yükle
        const url = new URL(window.location);
        url.searchParams.set("sayfa", i);
        url.searchParams.set("siralama", siralama);
        window.location.href = url.toString();
      });
    }
    sayfaDugmeleriBlok.appendChild(sayfaDugme);
  }

  // Arrow düğmelerini düzelt
  const arrowLeft = document.querySelector(".arrow-l");
  const arrowRight = document.querySelector(".arrow-r");

  arrowLeft.addEventListener("click", oncekiSayfa);
  arrowRight.addEventListener("click", sonrakiSayfa);

  if (sayfaNumarasi === 1) {
    arrowLeft.style.display = "none";
  } else if (sayfaNumarasi === siraliSayfaSayisi) {
    arrowRight.style.display = "none";
  } else {
    arrowLeft.style.display = "block";
    arrowRight.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const siralama = urlParams.get("siralama") || "alfabetik";
  const kategoriAdi = urlParams.get("kategori"); // URL'den kategori adını al
  const kategoriAdiElement = document.getElementById("kategori-adi"); // Kategori adını al

  if (kategoriAdi) {
    kategoriAdiElement.textContent = kategoriAdi; // Kategori adını HTML içeriğine ekle
  } else {
    kategoriAdiElement.textContent = "Tüm Kitaplar"; // Varsayılan olarak "Tüm Kitaplar" göster
  }

  kategoriAdiElement.addEventListener("click", () => {
    window.location.href = "kategoriler_index.html"; // Kategori adı öğesine tıklandığında yönlendirme
  });

  fetch("/kitaplar")
    .then((response) => response.json())
    .then((kitaplar) => {
      // Sadece belirli bir kategoriye ait kitapları filtrele
      if (kategoriAdi) {
        kitaplar = kitaplar.filter((kitap) => kitap.kategori === kategoriAdi);
      }

      // Arama işlemini URL parametreleri ile filtreleyerek gerçekleştir
      const aramaMetni = urlParams.get("arama");
      if (aramaMetni) {
        kitaplar = kitaplar.filter(
          (kitap) =>
            kitap.kitap_adi.toLowerCase().includes(aramaMetni) ||
            kitap.yazar.toLowerCase().includes(aramaMetni)
        );
      }

      kitaplariGoster(kitaplar, siralama);

      document.getElementById("arama-input").addEventListener("keyup", () => {
        kitaplariGoster(kitaplar, siralama);
      });

      document
        .getElementById("alfabetik-siralama")
        .addEventListener("click", () => {
          const url = new URL(window.location);
          url.searchParams.set("siralama", "alfabetik");
          window.location.href = url.toString();
        });

      document
        .getElementById("son-eklenenler-siralama")
        .addEventListener("click", () => {
          const url = new URL(window.location);
          url.searchParams.set("siralama", "son-eklenenler");
          window.location.href = url.toString(); // Sayfayı yeniden yükle
        });
    })
    .catch((error) => console.error("Kitaplar alınırken hata:", error));
});

// Sayfa numarasını güncelleyen fonksiyonlar
function oncekiSayfa() {
  const urlParams = new URLSearchParams(window.location.search);
  const sayfaNumarasi = parseInt(urlParams.get("sayfa")) || 1;
  if (sayfaNumarasi > 1) {
    const oncekiSayfaNumarasi = sayfaNumarasi - 1;
    const url = new URL(window.location);
    url.searchParams.set("sayfa", oncekiSayfaNumarasi);
    window.location.href = url.toString();
  }
}

function sonrakiSayfa() {
  const urlParams = new URLSearchParams(window.location.search);
  const sayfaNumarasi = parseInt(urlParams.get("sayfa")) || 1;
  const sonrakiSayfaNumarasi = sayfaNumarasi + 1;
  const url = new URL(window.location);
  url.searchParams.set("sayfa", sonrakiSayfaNumarasi);
  window.location.href = url.toString();
}
