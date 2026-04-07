import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://zeerostock-kqpl.onrender.com"

export default function AddProduct() {
  const [suppliers, setSuppliers] = useState([])
  const [data, setData] = useState({
    supplier_id: "",
    product_name: "",
    category: "",
    quantity: "",
    price: ""
  })

  useEffect(() => {
    axios.get(`${API}/suppliers`).then(res => {
      setSuppliers(res.data)
    })
  }, [])

  const submit = async () => {
    if (!data.supplier_id) return alert("Select supplier")

    await axios.post(`${API}/inventory`, data)
    alert("Product Added ✅")

    setData({
      supplier_id: "",
      product_name: "",
      category: "",
      quantity: "",
      price: ""
    })
  }

  return (
    <div >
      <h2 className="head">Add Product</h2>
      <div className="hello">
     <div className="align2">
      <select className="select"
        value={data.supplier_id}
        onChange={e => setData({ ...data, supplier_id: e.target.value })}
        >
        <option value="">Select Supplier</option>
        {suppliers.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <input placeholder="Product Name" className="input"
        value={data.product_name}
        onChange={e => setData({ ...data, product_name: e.target.value })}
        />

      <input placeholder="Category" className="input"
        value={data.category}
        onChange={e => setData({ ...data, category: e.target.value })}
        />

      <input placeholder="Quantity" className="input"
        value={data.quantity}
        onChange={e => setData({ ...data, quantity: e.target.value })}
        />

      <input placeholder="Price" className="input"
        value={data.price}
        onChange={e => setData({ ...data, price: e.target.value })}
        />

      <button onClick={submit} className="btn btn-success">Add</button>
        </div>
        </div>
    </div>
  )
}
