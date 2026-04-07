const express = require("express")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")
const path = require("path")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

let db = null
const dbPath = path.join(__dirname, "inventory.db")

const initDB = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      city TEXT
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER,
      product_name TEXT,
      category TEXT,
      quantity INTEGER,
      price REAL
    )
  `)

  app.listen(5000, () => console.log("Server running on 5000"))
}

initDB()

// ---------------- SUPPLIERS ----------------

app.post("/supplier", async (req, res) => {
  const { name, city } = req.body
  const result = await db.run(
    "INSERT INTO suppliers (name, city) VALUES (?, ?)",
    [name, city]
  )
  res.json({ id: result.lastID })
})

app.get("/suppliers", async (req, res) => {
  const data = await db.all("SELECT * FROM suppliers")
  res.json(data)
})

// ---------------- INVENTORY ----------------

app.post("/inventory", async (req, res) => {
  const { supplier_id, product_name, category, quantity, price } = req.body

  if (quantity < 0) return res.status(400).json({ msg: "Invalid quantity" })
  if (price <= 0) return res.status(400).json({ msg: "Invalid price" })

  const supplier = await db.get(
    "SELECT * FROM suppliers WHERE id=?",
    [supplier_id]
  )

  if (!supplier) return res.status(400).json({ msg: "Invalid supplier" })

  const result = await db.run(
    `INSERT INTO inventory (supplier_id, product_name, category, quantity, price)
     VALUES (?, ?, ?, ?, ?)`,
    [supplier_id, product_name, category, quantity, price*quantity]
  )

  res.json({ id: result.lastID })
})

app.get("/inventory", async (req, res) => {
  const data = await db.all(`
    SELECT i.*, s.name as supplier_name
    FROM inventory i
    LEFT JOIN suppliers s ON i.supplier_id = s.id
  `)
  res.json(data)
})


app.delete("/supplier/:id", async (req, res) => {
  const { id } = req.params

  try {
    await db.run("DELETE FROM inventory WHERE supplier_id = ?", [id])

    await db.run("DELETE FROM suppliers WHERE id = ?", [id])

    res.json({ message: "Supplier deleted" })
  } catch (e) {
    res.status(500).json(e)
  }
}) 

app.delete("/inventory/:id", async (req, res) => {
  await db.run("DELETE FROM inventory WHERE id=?", [req.params.id])
  res.json({ msg: "Deleted" })
})