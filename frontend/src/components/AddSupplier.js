import { useState, useEffect } from "react"
import axios from "axios"

const API = process.env.REACT_APP_API_URL;

export default function AddSupplier() {
  const [data, setData] = useState({ name: "", city: "" })
  const [suppliers, setSuppliers] = useState([])

  const fetchSuppliers = async () => {
    const res = await axios.get(`${API}/suppliers`)
    setSuppliers(res.data)
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const submit = async () => {
    if (!data.name || !data.city) {
      alert("Fill all fields")
      return
    }

    await axios.post(`${API}/supplier`, data)
    setData({ name: "", city: "" })
    fetchSuppliers()
  }

  const deleteSupplier = async (id) => {
    await axios.delete(`${API}/supplier/${id}`)
    fetchSuppliers()
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">

        <h2 className="text-center mb-3">Add Supplier</h2>

        <div className="align">
          <input
            className="form-control w-25"
            placeholder="Name"
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
          />

          <input
            className="form-control w-25"
            placeholder="City"
            value={data.city}
            onChange={e => setData({ ...data, city: e.target.value })}
          />

          <button className="btn btn-success" onClick={submit}>
            Add
          </button>
        </div>

        <hr />

        <h4 className="text-center mb-3">All Suppliers</h4>

        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="3">No suppliers yet</td>
              </tr>
            ) : (
              suppliers.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.city}</td>
                  <td>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="red"
                      className="bi bi-trash"
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteSupplier(s.id)}
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1z"/>
                    </svg>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  )
}
