import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://zeerostock-kqpl.onrender.com"

export default function Products() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [sort, setSort] = useState("")

  const fetchData = async () => {
    const res = await axios.get(`${API}/inventory`)
    setData(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteItem = async (id) => {
    await axios.delete(`${API}/inventory/${id}`)
    fetchData()
  }

  const filtered = data
    .filter(item =>
      item.product_name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(item =>
      category ? item.category?.toLowerCase().includes(category.toLowerCase()) : true
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price
      if (sort === "high") return b.price - a.price
      return 0
    })

  return (
    <div className="card">
      <h2 className="head">Products</h2>
      <div className="align">
       <div className="search">
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search m-2" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
      <input placeholder="Search by name" className="Serach_input"
        onChange={e => setSearch(e.target.value)}
        />
        </div>

      <input placeholder="Filter by category" className="input"
        onChange={e => setCategory(e.target.value)}
        />

      <select onChange={e => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="low">Price Low → High</option>
        <option value="high">Price High → Low</option>
      </select>

      </div>
      <div className="d-flex flex-row justify-content-center">


      <table className="table table-bordered text-center mt-5 w-50">
  <thead className="table-dark">
    <tr>
      <th>Product Name</th>
      <th>Category</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Delete</th>
    </tr>
  </thead>

  <tbody>
    {filtered.length === 0 ? (
      <tr>
        <td colSpan="5">No products found</td>
      </tr>
    ) : (
      filtered.map(item => (
        <>
          <tr key={item.id}>
            <td>{item.product_name}</td>
            <td>{item.category}</td>
            <td>{item.quantity}</td>
            <td>₹{item.price}</td>
            <td>
              <button
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer"
                }}
                onClick={() => deleteItem(item.id)}
              >
                Delete
              </button>
            </td>
          </tr>

          <tr>
            <td colSpan="5" style={{ background: "#f9f9f9" }}>
              <b>Supplier:</b> {item.supplier_name}
            </td>
          </tr>
        </>
      ))
    )}
  </tbody>
</table>
    </div>
    </div>
  )
}
