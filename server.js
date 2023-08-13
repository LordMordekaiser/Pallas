const express = require("express");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose(); // SQLite modülünü yüklüyor

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use(express.json()); // JSON verileri işlemek için body parser

const dbPath = path.join(__dirname, "pallas-data.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Veritabanına bağlanılamadı:", err.message);
  } else {
    console.log("Veritabanına başarıyla bağlandı");
  }
});

app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(publicPath, "images", filename);

  if (filename.endsWith(".svg")) {
    res.set("Content-Type", "image/svg+xml");
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("Dosya bulunamadı.");
    } else {
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/kitaplar", (req, res) => {
  db.all("SELECT * FROM kitaplar", [], (err, rows) => {
    if (err) {
      res.status(500).send("Veritabanı hatası.");
    } else {
      res.json(rows);
    }
  });
});

app.get("/kategoriler", (req, res) => {
  db.all("SELECT * FROM kategori", [], (err, rows) => {
    if (err) {
      res.status(500).send("Veritabanı hatası.");
    } else {
      res.json(rows);
    }
  });
});
app.get("/ozluSoz.js", (req, res) => {
  res.sendFile(path.join(publicPath, "ozluSoz.js"));
});

app.get("/sonEklenenler", (req, res) => {
  db.all(
    "SELECT * FROM kitaplar ORDER BY ID DESC LIMIT 15", // Son eklenen 15 kitap
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send("Veritabanı hatası.");
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/kitaplar", (req, res) => {
  const { isbn, ad, yazar, yayinevi, sayfa_sayisi } = req.body;

  db.run(
    "INSERT INTO kitaplar (isbn, ad, yazar, yayinevi, sayfa_sayisi) VALUES (?, ?, ?, ?, ?)",
    [isbn, ad, yazar, yayinevi, sayfa_sayisi],
    (err) => {
      if (err) {
        res.status(500).send("Veritabanı hatası.");
      } else {
        res.status(201).send("Kitap başarıyla eklendi.");
      }
    }
  );
});

app.get("/kitaplar/:id", (req, res) => {
  const kitapId = req.params.id;
  db.get("SELECT * FROM kitaplar WHERE isbn = ?", [kitapId], (err, row) => {
    if (err) {
      res.status(500).send("Veritabanı hatası.");
    } else {
      res.json(row);
    }
  });
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
