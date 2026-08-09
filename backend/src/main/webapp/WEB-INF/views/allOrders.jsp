<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
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
        <a class="header__logo logo" href="/"> <img class="logo__image" src="./images/Logo.png" alt="Mont Blank"
                                                    width="250" height="84"/> </a>
        <div class="header__menu services">
            <ul>
            </ul>
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
                    <h2>Orders</h2>
                    <p class="admin-page__subtitle">View and manage customer orders</p>
                </div>
                <div class="admin-page__actions">
                    <a href="/adminPanel" class="btn btn--ghost">Back to dashboard</a>
                </div>
            </div>

            <div class="admin-toolbar">
                <div class="admin-toolbar__left">
                    <span class="admin-badge">Total: <c:out value="${fn:length(orders)}"/></span>
                </div>
                <div class="admin-toolbar__right">
                    <input type="search" id="ordersSearch" class="admin-search-input" placeholder="Search by name, phone or address">
                </div>
            </div>

            <div class="admin-table-wrapper">
                <table class="admin-table" id="ordersTable">
                    <thead>
                    <tr>
                        <th class="admin-table__cell--number">Order ID</th>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Delivery</th>
                        <th>Payment</th>
                        <th>Comment</th>
                        <th>Total</th>
                        <th>Products</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <c:forEach var="order" items="${orders}">
                        <tr id="order-${order.id}" data-row>
                            <td class="admin-table__cell--number">${order.id}</td>
                            <td>${order.name}</td>
                            <td>${order.address}</td>
                            <td>${order.phone}</td>
                            <td>${order.delivery}</td>
                            <td>${order.payment}</td>
                            <td>${order.comment}</td>
                            <td>${order.total}</td>
                            <td>
                                <c:choose>
                                    <c:when test="${empty order.products}">
                                        <span class="admin-tag admin-tag--muted">No products</span>
                                    </c:when>
                                    <c:otherwise>
                                        <ul>
                                            <c:forEach var="product" items="${order.products}">
                                                <li>
                                                    <c:out value="${product.name}"/>
                                                    -
                                                    <c:out value="${product.price}"/>
                                                    ₪
                                                </li>
                                            </c:forEach>
                                        </ul>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <td>
                                <c:if test="${isAdmin}">
                                    <div class="admin-table__actions">
                                        <button type="button"
                                                class="btn btn--danger"
                                                data-action="delete-order"
                                                data-id="${order.id}">
                                            Delete
                                        </button>
                                    </div>
                                </c:if>
                            </td>
                        </tr>
                    </c:forEach>
                    </tbody>
                </table>
            </div>
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
        <div><img src="images/Logo.png" width="250" height="84" alt=""/>
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
            <img src="images/payment.webp" width="170" alt=""/></div>
    </div>
</footer>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        const searchInput = document.getElementById("ordersSearch");

        document.querySelectorAll('[data-action="delete-order"]').forEach(button => {
            button.addEventListener("click", () => {
                const orderId = button.getAttribute("data-id");

                fetch('/deleteOrder/' + orderId, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            const row = document.getElementById('order-' + orderId);
                            if (row) {
                                row.remove();
                            }
                        } else {
                            alert('Failed to delete order');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error deleting order');
                    });
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const term = searchInput.value.toLowerCase();
                document.querySelectorAll("#ordersTable tbody tr[data-row]").forEach(row => {
                    const cells = row.querySelectorAll("td");
                    const text = Array.from(cells)
                        .slice(1, 4) // name, address, phone
                        .map(td => td.textContent)
                        .join(" ")
                        .toLowerCase();
                    row.style.display = text.includes(term) ? "" : "none";
                });
            });
        }
    });
</script>
</body>
</html>