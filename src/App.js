import React, { useState, useEffect } from "react";
import "./App.css";
import cartIcon from "./assets/icons-cart.png";

function App() {
  const [menuData, setMenuData] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    // Fetch data from the API
    fetch("https://run.mocky.io/v3/f47694b8-4d45-4c30-aed0-dd82bb4025fb")
      .then((response) => response.json())
      .then((data) => {
        setMenuData(data);
        const initialQuantities = {};
        data.data[0].table_menu_list[0].category_dishes.forEach(
          (item) => (initialQuantities[item.dish_id] = 0)
        );
        setQuantities(initialQuantities);
        setSelectedCategory(data.data[0].table_menu_list[0]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const total = Object.values(quantities).reduce(
      (acc, quantity) => acc + quantity,
      0
    );
    setTotalQuantity(total);
  }, [quantities]);

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const initialQuantities = {};
    category.category_dishes.forEach(
      (item) =>
        (initialQuantities[item.dish_id] = quantities[item.dish_id] || 0)
    );
    setQuantities(initialQuantities);
  };

  return (
    <div>
      <header>
        <h1>{menuData?.data?.[0]?.restaurant_name || "UNI Resto Cafe"}</h1>
        <div className="headerItems">
          <span>My Orders</span>
          <div className="cart-container">
            <img src={cartIcon} alt="cart" />
            {totalQuantity > 0 && (
              <div className="counter">{totalQuantity}</div>
            )}
          </div>
        </div>
      </header>

      <nav className="horizontal-scroll">
        {menuData?.data?.[0]?.table_menu_list?.map((category, index) => (
          <a
            key={index}
            href="##"
            onClick={() => handleCategoryClick(category)}
            className={`category-item ${
              selectedCategory === category ? "active selected" : ""
            }`}
          >
            {category.menu_category}
          </a>
        ))}
      </nav>

      {selectedCategory?.category_dishes?.map((item, index) => (
        <div key={index} className="menu-item">
          <div style={{ width: "1000px" }}>
            <h2>{item.dish_name}</h2>
            <p>
              <strong>
                {item.dish_currency} {item.dish_price}
              </strong>
            </p>
            <p>{item.dish_description}</p>
            {item.dish_Availability && (
              <div className="counter-container">
                <button onClick={() => decrement(item.dish_id)}>-</button>
                <p>{quantities[item.dish_id]}</p>
                <button onClick={() => increment(item.dish_id)}>+</button>
              </div>
            )}
            <p
              className={
                item.addonCat.length > 0 && item.dish_Availability
                  ? "item-available"
                  : "item-unavailable"
              }
              style={{
                color:
                  item.addonCat.length > 0 && item.dish_Availability
                    ? "green"
                    : "red",
              }}
            >
              {item.addonCat.length > 0 && item.dish_Availability
                ? "Customizations available"
                : "Not Available"}
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p className="calories">{item.dish_calories} Calories</p>
            <img src={item.dish_image} alt={item.dish_name} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
