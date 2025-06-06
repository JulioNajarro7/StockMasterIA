import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="btn position-fixed"
      style={{ bottom: 20, left: 20, zIndex: 1000 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Cambiar tema"
    >
      {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
}

export default ThemeToggle;
