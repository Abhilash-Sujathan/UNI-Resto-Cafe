import "./App.css";
import { useState, useEffect } from "react";
import cartIcon from "./assets/icons-cart.png";

function App() {
  const [menuData, setMenuData] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // Fetch data from the API
    fetch("https://run.mocky.io/v3/f47694b8-4d45-4c30-aed0-dd82bb4025fb")
      .then((response) => response.json())
      .then((data) => {
        setMenuData(data);
        // Initialize quantities state with default values (0) for each item
        const initialQuantities = {};
        data.data[0].table_menu_list[0].category_dishes.forEach(
          (item) => (initialQuantities[item.dish_id] = 0)
        );
        setQuantities(initialQuantities);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const increment = (dishId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [dishId]: prevQuantities[dishId] + 1,
    }));
  };

  const decrement = (dishId) => {
    if (quantities[dishId] > 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [dishId]: prevQuantities[dishId] - 1,
      }));
    }
  };

  console.log(menuData, "menuData");

  return (
    <body>
      <header>
        <h1>{menuData?.data?.[0]?.restaurant_name || "Cafe Name"}</h1>
        <div className="headerItems">
          <span>My Orders</span>
          <img src={cartIcon} alt="cart" />
        </div>
      </header>

      <nav className="horizontal-scroll">
        {menuData?.data?.[0]?.table_menu_list?.map((item, index) => (
          <a key={index} href="##">
            {item.menu_category}
          </a>
        ))}
      </nav>

      {menuData?.data?.[0]?.table_menu_list?.[0]?.category_dishes?.map(
        (item, index) => (
          <div key={index} className="menu-item">
            <div>
              <h2>{item.dish_name}</h2>
              <p>
                {item.dish_currency} {item.dish_price}
              </p>
              <p>{item.dish_description}</p>
              <div className="counter-container">
                <button onClick={() => decrement(item.dish_id)}>-</button>
                <p>{quantities[item.dish_id]}</p>
                <button onClick={() => increment(item.dish_id)}>+</button>
              </div>
              <p
                className={
                  item.dish_Availability ? "item-available" : "item-unavailable"
                }
                style={{ color: item.dish_Availability ? "green" : "red" }}
              >
                {item.dish_Availability ? "Available" : "Not Available"}
              </p>
            </div>
            <img src={item.dish_image} alt={item.dish_name} />
          </div>
        )
      )}
    </body>
  );
}

export default App;
