# Pallas
Pdf Kitap İndirme Sitesi

Search problemli
Son Eklenenler hala başarısız DB den ID ye göre büyükten küçüğe sıralamak lazım




//DB Browser for SQLite 
//Kitap sayısını güncelleme kodu

UPDATE kategori
SET kitap_sayisi = (SELECT COUNT(*) FROM kitaplar WHERE kitaplar.kategori = kategori.kategori_adi);
