import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import "./HamburgerMenu.css"

export const HamburgerMenu: React.FC = () => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(prev => !prev);

    return (
        <div className="hamburger-container">
            <button className="hamburger-button" onClick={toggle} aria-label="Меню">
                <span />
                <span />
                <span />
            </button>
            {open && (
                <nav className="hamburger-menu absolute z-50">
                    <NavLink to="/" className="menu-item" onClick={toggle}>
                        Главная
                    </NavLink>
                    <NavLink to="/deals" className="menu-item" onClick={toggle}>
                        Список сделок
                    </NavLink>
                </nav>
            )}
        </div>
    );
}