<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en" xmlns:c="http://www.w3.org/1999/XSL/Transform">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description"
          content="E-shop of italian quality products">
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicon/favicon-16x16.png">
    <title>Mont Blank</title>
    <script src="scripts/shoppingCart.js" defer></script>
    <link href="./style_admin.css" rel="stylesheet" type="text/css">
</head>
<body>
<header class="header">
    <div class="header__inner">
        <a class="header__logo logo" href="/">
            <img class="logo__image" src="./images/Logo.svg" alt="Mont Blanc" width="250" height="84"/>
        </a>
        <div class="header__menu services">
            <ul></ul>
        </div>
        <div class="header__contact phone">
            <p class="tel">050 145-28-41</p>
            <p class="time">support 0800 574 54 44 </p>
        </div>
        <div class="header__contact time">
            <p class="tel">Store Opening</p>
            <p class="time">daily from 8.00 to 21.00 </p>
        </div>
    </div>
</header>
<nav class="nav">
    <ul class="nav__menu">
        <li class="nav__menu-item"><a href="/adminPanel">main page</a></li>
        <li class="nav__menu-item"><a href="/allOrders">orders</a></li>
        <c:if test="${isAdmin}">
            <li class="nav__menu-item"><a href="/addProduct">products</a></li>
            <li class="nav__menu-item"><a href="/addCategory">category</a></li>
        </c:if>
        <li class="nav__menu-item"><a href="/">exit</a></li>
    </ul>
</nav>
<main>

    <section class="section_01">
        <div class="admin-page">
            <div class="admin-page__header">
                <div class="admin-page__title">
                    <h2>Admin Panel</h2>
                    <p class="admin-page__subtitle">Welcome, ${userName}!</p>
                </div>
                <c:if test="${isAdmin}">
                    <div class="admin-page__actions">
                        <a href="/allOrders" class="btn btn--ghost">View Orders</a>
                        <a href="/addProduct" class="btn btn--primary">Manage Products</a>
                        <a href="/addCategory" class="btn btn--ghost">Manage Categories</a>
                    </div>
                </c:if>
                <c:if test="${!isAdmin}">
                    <div class="admin-page__actions">
                        <a href="/allOrders" class="btn btn--ghost">My Orders</a>
                    </div>
                </c:if>
            </div>

            <c:if test="${isAdmin}">
                <div class="admin-card-grid">
                    <div class="admin-card">
                        <span class="admin-card__label">Total Orders</span>
                        <span class="admin-card__value">${orderCount}</span>
                        <span class="admin-card__description">All orders stored in the database</span>
                    </div>
                    <div class="admin-card">
                        <span class="admin-card__label">Products</span>
                        <span class="admin-card__value">${productCount}</span>
                        <span class="admin-card__description">Items available in the catalog</span>
                    </div>
                </div>
            </c:if>
            <c:if test="${!isAdmin}">
                <div class="admin-card-grid">
                    <div class="admin-card">
                        <span class="admin-card__label">My Orders</span>
                        <span class="admin-card__value">${userOrderCount}</span>
                        <span class="admin-card__description">Your orders in the system</span>
                    </div>
                </div>
            </c:if>
        </div>
    </section>

    <section class="section_04">
        <div class="section_04__container">
            <div class="section_04__container phone"><span class="black">phone:</span> 050 145-28-41</div>
            <div class="section_04__container email"><span class="black">e-mail:</span> info@montblank.com</div>
            <div class="section_04__container support"><span class="black">support:</span> support@montblank.com</div>
        </div>
    </section>

</main>
<footer class="footer">
    <div class="footer__container">
        <div><img src="images/Logo.svg" width="250" height="84" alt=""/>
            <p class="tel">050 145-28-41</p>
            <p class="time">daily from 8.00 to 21.00 </p>
        </div>
        <div>
            <h5>For buyers</h5>
            <ul>
                <li class="header__menu-item"><a href="/">Brand </a></li>
                <li class="header__menu-item"><a href="/">Recipes </a></li>
                <li class="header__menu-item"><a href="/">How to order</a></li>
                <li class="header__menu-item"><a href="/">Return of goods </a></li>
                <li class="header__menu-item"><a href="/">Loyalty program</a></li>
            </ul>
        </div>
        <div>
            <h5>information</h5>
            <ul>
                <li class="header__menu-item"><a href="/">Delivery and payment </a></li>
                <li class="header__menu-item"><a href="/">Contacts and details</a></li>
                <li class="header__menu-item"><a href="/">Privacy policy</a></li>
                <li class="header__menu-item"><a href="/">Consent to data processing </a></li>
            </ul>
        </div>
        <div>
            <h5>We accept payment</h5>
            <img src="images/payment.webp" width="170" alt=""/>
        </div>
    </div>
</footer>

</body>
</html>