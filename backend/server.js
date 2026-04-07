const express = require("express")
const Database = require("better-sqlite3")
const path = require("path")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const dbPath = path.join(__dirname, "inventory.db")
const db = new Database(dbPath)

db.prepare(`
  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    city TEXT
  )
`).run()

db.prepare(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    product_name TEXT,
    category TEXT,
    quantity INTEGER,
    price REAL
  )
`).run()

// ---------------- SUPPLIERS ----------------

app.post("/supplier", (req, res) => {
  const { name, city } = req.body

  const result = db
    .prepare("INSERT INTO suppliers (name, city) VALUES (?, ?)")
    .run(name, city)

  res.json({ id: result.lastInsertRowid })
})

app.get("/suppliers", (req, res) => {
  const data = db.prepare("SELECT * FROM suppliers").all()
  res.json(data)
})

// ---------------- INVENTORY ----------------

app.post("/inventory", (req, res) => {
  const { supplier_id, product_name, category, quantity, price } = req.body

  if (quantity < 0)
    return res.status(400).json({ msg: "Invalid quantity" })

  if (price <= 0)
    return res.status(400).json({ msg: "Invalid price" })

  const supplier = db
    .prepare("SELECT * FROM suppliers WHERE id=?")
    .get(supplier_id)

  if (!supplier)
    return res.status(400).json({ msg: "Invalid supplier" })

  const result = db.prepare(`
    INSERT INTO inventory (supplier_id, product_name, category, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  `).run(supplier_id, product_name, category, quantity, price * quantity)

  res.json({ id: result.lastInsertRowid })
})

app.get("/inventory", (req, res) => {
  const data = db.prepare(`
    SELECT i.*, s.name as supplier_name
    FROM inventory i
    LEFT JOIN suppliers s ON i.supplier_id = s.id
  `).all()

  res.json(data)
})

// ---------------- DELETE ----------------

app.delete("/supplier/:id", (req, res) => {
  const { id } = req.params

  try {
    db.prepare("DELETE FROM inventory WHERE supplier_id=?").run(id)
    db.prepare("DELETE FROM suppliers WHERE id=?").run(id)

    res.json({ message: "Supplier deleted" })
  } catch (e) {
    res.status(500).json(e)
  }
})

app.delete("/inventory/:id", (req, res) => {
  db.prepare("DELETE FROM inventory WHERE id=?").run(req.params.id)
  res.json({ msg: "Deleted" })
})

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))