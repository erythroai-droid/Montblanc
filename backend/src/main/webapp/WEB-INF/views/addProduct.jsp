<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<!DOCTYPE html>
<html xmlns:c="http://www.w3.org/1999/XSL/Transform">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="E-shop of italian quality products">
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicon/favicon-16x16.png">
    <title>Mont Blanc</title>
    <link href="./style_admin.css" rel="stylesheet" type="text/css">
</head>
<body>
<header class="header">
    <div class="header__inner">
        <a class="header__logo logo" href="/"> <img class="logo__image" src="./images/Logo.png" alt="Mont Blanc"
                                                    width="250" height="84"/> </a>
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
        <li class="nav__menu-item"><a href="/addProduct">products</a></li>
        <li class="nav__menu-item"><a href="/addCategory">category</a></li>
        <li class="nav__menu-item"><a href="/">exit</a></li>
    </ul>
</nav>
<main>
    <section class="section_01">
        <div class="admin-page">
            <div class="admin-page__header">
                <div class="admin-page__title">
                    <h2>Products</h2>
                    <p class="admin-page__subtitle">Create and manage catalog items</p>
                </div>
                <div class="admin-page__actions">
                    <a href="/adminPanel" class="btn btn--ghost">Back to dashboard</a>
                </div>
            </div>

            <div class="admin-toolbar">
                <div class="admin-toolbar__left">
                    <span class="admin-badge">Total: <c:out value="${fn:length(products)}"/></span>
                </div>
                <div class="admin-toolbar__right">
                    <input type="search" id="productSearch" class="admin-search-input" placeholder="Search by name or category">
                </div>
            </div>

            <div class="orders_container">
                <div class="form-container">
                    <h4>Add Product</h4>
                    <form id="addProductForm" action="/addProduct" method="post" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="name">Product Name:</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="price">Price (₪):</label>
                            <input type="text" id="price" name="price" required>
                        </div>

                        <div class="form-group">
                            <label for="categoryId">Category:</label>
                            <select id="categoryId" name="categoryId" required>
                                <c:forEach var="category" items="${categories}">
                                    <option value="${category.id}">${category.name}</option>
                                </c:forEach>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Special Offers
                                <span>no</span>
                                <input type="radio" id="specialOffersFalse" checked name="special" value="false">

                                <span>yes</span>
                                <input type="radio" id="specialOffersTrue" name="special" value="true">

                            </label>
                        </div>

                        <div class="form-group" id="discountGroup">
                            <label for="discount">Discount (%):</label>
                            <input type="number" id="discount" name="discount" value="0">
                        </div>

                        <div class="form-group">
                            <label for="description">Description:</label>
                            <textarea id="description" name="description"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="image">Product Image:</label>
                            <input type="file" id="image" name="image" accept="image/*" required>
                        </div>
                        <button type="submit" id="refreshTable">Add Product</button>
                    </form>

                    <div id="messageContainer"></div>
                </div>
            </div>

            <div class="admin-table-wrapper" style="margin-top: 30px;">
                <table class="admin-table" id="productsTable">
                    <thead>
                    <tr>
                        <th class="admin-table__cell--number">ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Special</th>
                        <th>Discount</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <c:forEach var="product" items="${products}">
                        <tr data-row>
                            <td class="admin-table__cell--number"><span data-id="${product.id}">${product.id}</span></td>
                            <td class="admin-table__cell--image">
                                <img src="data:image/png;base64,${product.image}" alt="${product.name}">
                            </td>
                            <td data-name>
                                ${product.name}
                            </td>
                            <td>
                                <c:out value="${product.category != null ? product.category.name : '—'}"/>
                            </td>
                            <td>
                                <span data-price>${product.price}</span> ₪
                            </td>
                            <td>
                                <c:choose>
                                    <c:when test="${product.specialOffers}">
                                        <span class="admin-tag admin-tag--success">YES</span>
                                    </c:when>
                                    <c:otherwise>
                                        <span class="admin-tag admin-tag--muted">NO</span>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <td>
                                <c:out value="${product.discount}"/> %
                            </td>
                            <td>
                                <div class="admin-table__actions">
                                    <button type="button"
                                            class="btn btn--danger"
                                            data-action="delete-product"
                                            data-id="${product.id}">
                                        Delete
                                    </button>
                                </div>
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
            <img src="images/payment.webp" width="170" alt=""/>
        </div>
    </div>
</footer>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("addProductForm");
        const messageContainer = document.getElementById("messageContainer");
        const specialYes = document.getElementById("specialOffersTrue");
        const specialNo = document.getElementById("specialOffersFalse");
        const discountGroup = document.getElementById("discountGroup");
        const searchInput = document.getElementById("productSearch");

        function toggleDiscount() {
            if (specialYes.checked) {
                discountGroup.style.display = "block";
            } else {
                discountGroup.style.display = "none";
            }
        }

        toggleDiscount();
        specialYes.addEventListener("change", toggleDiscount);
        specialNo.addEventListener("change", toggleDiscount);

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const formData = new FormData(this);

            fetch("/addProduct", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    messageContainer.innerHTML = "";
                    const message = document.createElement("p");
                    message.textContent = data.message;
                    message.className = data.status === "success" ? "message" : "error";
                    messageContainer.appendChild(message);
                    setTimeout(() => location.reload(), 1000);
                })
                .catch(error => {
                    messageContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
                });
        });

        document.querySelectorAll('[data-action="delete-product"]').forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("data-id");
                const formData = new FormData();
                formData.append("id", productId);

                fetch("/deleteProduct", {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        messageContainer.innerHTML = "";
                        const message = document.createElement("p");
                        message.textContent = data.message;
                        message.className = data.status === "success" ? "message" : "error";
                        messageContainer.appendChild(message);
                        if (data.status === "success") {
                            const row = button.closest("tr");
                            if (row) {
                                row.remove();
                            }
                        }
                    })
                    .catch(error => {
                        messageContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
                    });
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const term = searchInput.value.toLowerCase();
                document.querySelectorAll("#productsTable tbody tr[data-row]").forEach(row => {
                    const nameCell = row.querySelector("td[data-name]");
                    const categoryCell = row.children[3];
                    const text = (
                        (nameCell ? nameCell.textContent : "") + " " +
                        (categoryCell ? categoryCell.textContent : "")
                    ).toLowerCase();
                    row.style.display = text.includes(term) ? "" : "none";
                });
            });
        }
    });

</script>

</body>
</html>