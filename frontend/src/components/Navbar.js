import { Link } from "react-router-dom"
import "./index.css"
import image from "./image.png"

export default function Navbar() {
  return (
    <div className="nav">
      <img src={image} alt="logo"/>
      <div className="ml-auto">
     <button className="bt">
       <Link to="/">Products</Link>
      </button>
      <button className="bt">
      <Link to="/add-supplier">Add Supplier</Link>
      </button>
      <button className="bt">
      <Link to="/add-product">Add Product</Link>
      </button>
      </div>
    </div>
  )
}
