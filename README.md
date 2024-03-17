# Pallas

# English
PDF Book Download Site

-To run the site, enter the following command in the terminal:
node server.js

-To close the site, press Ctrl+C in the same terminal.

-The URL of the site:
http://localhost:3000/

------------------------------------------------------------------------------------------

-For testing purposes, the most downloaded book is in the Philosophy "Felsefe" category.

-For testing purposes, the only downloadable book is The Apology of Socrates "Sokrates'in Savunması".

//THINGS NEED TO WORK ON

-Sorting by popularity feature is not added.

-The "Recently Added" still fails to sort from largest to smallest by ID from the DB (book-sorting.js).

-When activating the book_last_added.js file via kitap_listesi_index.html, it successfully sorts, but only a maximum of 13 books are displayed from each category. The 2nd page and the remaining books disappear.

//DB Browser for SQLite
//Code to update the number of books

UPDATE category
SET book_count = (SELECT COUNT(*) FROM books WHERE books.category = category.category_name);

# Türkçe
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

-Popülerliğe göre sırala özelliği daha eklenmedi

-Son Eklenenler hala başarısız DB den ID ye göre büyükten küçüğe sıralamak lazım (kitap-siralama.js)

- kitap_son_eklenenler.js dosyasını kitap_listesi_index.html üzerinden aktive edince sıralamayı başarılı bir şekilde yapıyor ama her kategoriden max 13 kitap ekranda gözüküyor. 2. sayfa ve kalan kitaplar kayboluyor.



//DB Browser for SQLite 
//Kitap sayısını güncelleme kodu

UPDATE kategori
SET kitap_sayisi = (SELECT COUNT(*) FROM kitaplar WHERE kitaplar.kategori = kategori.kategori_adi);




