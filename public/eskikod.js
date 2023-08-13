// kitap-siralama.js

// Fonksiyon kitapları alfabetik olarak sıralar
function alfabetikSiralama(kitaplar) {
  return kitaplar.sort((a, b) => a.kitap_adi.localeCompare(b.kitap_adi));
}

// Fonksiyon kitapları ilk eklenenlere göre sıralar
function ilkEklenenlereGoreSiralama(kitaplar) {
  return kitaplar.sort(
    (a, b) => new Date(a.eklenme_tarihi) - new Date(b.eklenme_tarihi)
  );
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
    siralanmisKitaplar = alfabetikSiralama(kitaplar).slice(
      baslangicIndex,
      bitisIndex
    );
  } else if (siralama === "son_eklenenler") {
    siralanmisKitaplar = ilkEklenenlereGoreSiralama(kitaplar).slice(
      baslangicIndex,
      bitisIndex
    );
  } else {
    // Varsayılan olarak ilk eklenenlere göre sıralama yapacak
    siralanmisKitaplar = ilkEklenenlereGoreSiralama(kitaplar).slice(
      baslangicIndex,
      bitisIndex
    );
  }

  // Arama kutusundaki metni al
  const aramaMetni = document.getElementById("arama-input").value.toLowerCase();

  // Kitapları arama metnine göre filtrele
  siralanmisKitaplar = siralanmisKitaplar.filter(
    (kitap) =>
      kitap.kitap_adi.toLowerCase().includes(aramaMetni) ||
      kitap.yazar.toLowerCase().includes(aramaMetni) // Yazar adıyla da eşleşen kitapları göstermek için ekleme
  );

  siralanmisKitaplar.forEach((kitap) => {
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
  const sayfaSayisi = Math.ceil(kitaplar.length / kitaplarPerSayfa);
  const sayfaDugmeleriBlok = document.getElementById("paging-bar");
  sayfaDugmeleriBlok.innerHTML = ""; // Mevcut içeriği temizle

  for (let i = 1; i <= sayfaSayisi; i++) {
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
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  let siralama = urlParams.get("siralama");

  if (!siralama) {
    // Eğer URL'de sıralama parametresi belirtilmemişse, varsayılan olarak "son_eklenenler" sıralamasını kullan
    siralama = "son_eklenenler";
    const url = new URL(window.location);
    url.searchParams.set("siralama", "son_eklenenler");
    window.history.replaceState(null, null, url.toString());
  }

  const kategoriAdi = urlParams.get("kategori"); // URL'den kategori adını al

  const kategoriAdiElement = document.getElementById("kategori-adi");

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
      const kategoriAdi = urlParams.get("kategori"); // URL'den kategori adını al

      // Sadece belirli bir kategoriye ait kitapları filtrele
      if (kategoriAdi) {
        kitaplar = kitaplar.filter((kitap) => kitap.kategori === kategoriAdi);
      }

      if (siralama === "alfabetik") {
        kitaplar = alfabetikSiralama(kitaplar);
      } else if (siralama === "son_eklenenler") {
        kitaplar = ilkEklenenlereGoreSiralama(kitaplar);
      } else {
        kitaplar = ilkEklenenlereGoreSiralama(kitaplar);
      }

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
          url.searchParams.set("siralama", "son_eklenenler");
          window.location.href = url.toString();
        });

      kitaplariGoster(kitaplar, siralama);
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



.header,
.logo,
.ozet {
  position: absolute;
}
.header {
  width: 100%;
  height: 94px;
  background-color: var(--color-oldlace);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 999;
}
.ozet {
  top: 265px;
  left: 0px;
  line-height: 125%;
  display: flex;
  align-items: center;
  font-family: "Lato", sans-serif;
  width: 280px;
}
.kitap-adi {
  letter-spacing: 0.05em;
}
.ayrac,
.yazar {
  position: relative;
  display: flex;
  align-items: center;
  width: 70px;
  flex-shrink: 0;
}
.ayrac {
  width: 11px;
}
.yayinci {
  flex: 1;
  position: relative;
  height: 32.5px;
}
.yazar-yayinci {
  margin-top: 16px;
  display: flex;
}

.alt-kunye,
.kunye {
  display: flex;
}
.alt-kunye {
  margin-top: 16px;
  align-items: stretch;
  flex-direction: row;
  gap: 28px;
  font-size: var(--font-size-base);
  font-family: var(--font-lato);
}
.kunye {
  flex-direction: column;
  gap: 24px;
  font-size: 36px;
  font-family: var(--font-alata);
}
.bilgi {
  top: 629px;
  left: calc(50% - 140px);
  width: 280px;
  height: 840px;
  text-align: left;
  font-size: 20px;
  font-family: var(--font-lato);
}

.bilgi,
.indir,
.ndir {
  position: absolute;
}
.indir {
  top: 1px;
  left: 1px;
  letter-spacing: 0.15em;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 279px;
  height: 45px;
}
.ndir {
  top: 0;
  left: calc(50% - 140px);
  border-radius: 3px;
  background-color: var(--color-darkolivegreen-100);
  width: 280px;
  height: 46px;
  overflow: hidden;
}
.line {
  position: relative;
  border-top: 1px solid;
  box-sizing: border-box;
  width: 65px;
  height: 1px;
}
.scientia-vincere {
  position: relative;
  letter-spacing: 0.15em;
  font-family: "alata";
}
.soz {
  position: absolute;
  top: 69px;
  left: calc(50% - 139px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  font-size: 12px;
  color: var(--color-black);
}
.indir-blok {
  position: absolute;
  top: 1533px;
  right: calc(50% - 140px);
  width: 280px;
  height: 86px;
  font-size: var(--font-size-13xl);
  color: white;
  font-family: "alata";
}
.kitap-resim {
  position: absolute;
  top: 126px;
  left: calc(50% - 152px);
  border-radius: 10px;
  width: 300px;
  height: 459px;
  /* object-fit: cover; */
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
.pattern {
  position: absolute;
  bottom: 64px;
  left: 0;
  width: 100%;
  min-height: 50px;
  /* min-width: 5236px; */
}

body {
  position: relative;
  background-color: #fdf6e3;
  width: 100%;
  height: 1798px;
  color: var(--color-black);
  min-width: 456px; /* Sayfanın genişliğini 456 pikselin altına düşünce mahvolmasını engelliyor */
}

/*künyedeki sıralamayı düzeltiyor*/

.alt-kunye {
  flex-direction: row;
  gap: 16px;
  font-family: var(--font-lato);
}

.yazar-yayinci {
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  font-size: var(--font-size-5xl);
}

/*overflow engellenmek için*/
.pattern-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pattern-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
