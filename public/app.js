fetch("/kitaplar")
  .then((response) => response.json())
  .then((kitaplar) => {
    const kitaplarBlok = document.getElementById("kitaplarBlok");
    kitaplar.forEach((kitap) => {
      const kitapDiv = document.createElement("div");
      kitapDiv.classList.add("kitap");

      const kitapLink = document.createElement("a");
      kitapLink.href = "indir_index.html";

      const kitapKapak = document.createElement("img");
      kitapKapak.classList.add("kitap-kapak");
      kitapKapak.src = kitap["kapak_yolu"]; // Doğru kapak dosya yolunu kullanıyoruz

      const kitapAdi = document.createElement("div");
      kitapAdi.classList.add("kitap-adi");
      kitapAdi.textContent = kitap["kitap_adi"]; // kitap.adi'den kitap["kitap_adi"] olarak değiştiriyoruz

      const kitapYazar = document.createElement("div");
      kitapYazar.classList.add("yazar");
      kitapYazar.textContent = kitap["yazar"]; // kitap.yazar'dan kitap["yazar"] olarak değiştiriyoruz

      kitapLink.appendChild(kitapKapak);
      kitapLink.appendChild(kitapAdi);

      kitapDiv.appendChild(kitapLink);
      kitapDiv.appendChild(kitapYazar);

      kitaplarBlok.appendChild(kitapDiv);
    });
  })
  .catch((error) => console.error("Kitaplar alınırken hata:", error));
