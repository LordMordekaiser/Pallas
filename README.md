# Pallas
Pdf Kitap İndirme Sitesi

-Siteyi çalıştırmak için aşağıdaki komutu terminale girin
node server.js

-Siteyi kapatmak için aynı terminalde Ctrl+C

-Sitenin URL'si
http://localhost:3000/

------------------------------------------------------------------------------------------

-Test amaçlı en çok kitap Felsefe kategorisinde

-Test amaçlı indiriliebilir tek kitap Sokrates'in Savunması

//PROBLEMLER

-Popülerliğe göre sırala seçeneği yerine daha mantıklı bir seçenek lazım

-Son Eklenenler hala başarısız DB den ID ye göre büyükten küçüğe sıralamak lazım (kitap-siralama.js)

- kitap_son_eklenenler.js dosyasını kitap_listesi_index.html üzerinden aktive edince sıralamayı başarılı bir şekilde yapıyor ama her kategoriden max 13 kitap ekranda gözüküyor. 2. sayfa ve kalan kitaplar kayboluyor.



//DB Browser for SQLite 
//Kitap sayısını güncelleme kodu

UPDATE kategori
SET kitap_sayisi = (SELECT COUNT(*) FROM kitaplar WHERE kitaplar.kategori = kategori.kategori_adi);




