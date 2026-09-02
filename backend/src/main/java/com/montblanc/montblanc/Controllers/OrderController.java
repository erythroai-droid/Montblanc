package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.EmailService;
import com.montblanc.montblanc.Clases.OrderProducts;
import com.montblanc.montblanc.Clases.Orders;
import com.montblanc.montblanc.Repositories.OrdersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.montblanc.montblanc.Clases.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    OrdersRepository ordersRepository;

    @Autowired
    private EmailService emailService;

    private static final String LOGO_CID = "logomontblanc";
    private static final String PRODUCT_CID_PREFIX = "product-";

    @PostMapping("/order")
    public ResponseEntity<?> order(@RequestBody Orders orders, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser != null) {
            orders.setUserId(currentUser.getId());
        }

        List<OrderProducts> productList = orders.getProducts() != null ? new ArrayList<>(orders.getProducts()) : new ArrayList<>();

        for (OrderProducts product : productList) {
            product.setOrders(orders);
        }

        try {
            logger.info("Processing order for email: {}, userId: {}", orders.getEmail(), orders.getUserId());
            ordersRepository.save(orders);
        } catch (Exception e) {
            logger.error("Error saving order to database", e);
            return ResponseEntity.status(500).body(Map.of("status", "error", "message", "Failed to save order"));
        }

        try {
            Map<String, byte[]> inlineImages = new LinkedHashMap<>();

            byte[] logoBytes = null;
            try (InputStream is = OrderController.class.getClassLoader().getResourceAsStream("static/images/Logo.png")) {
                if (is != null) {
                    logoBytes = is.readAllBytes();
                }
            }
            if (logoBytes != null && logoBytes.length > 0) {
                inlineImages.put(LOGO_CID, logoBytes);
            } else {
                logger.warn("Logo.png not found, email will be sent without logo");
            }

            StringBuilder productRows = new StringBuilder();
            int productIndex = 0;
            for (OrderProducts orderProducts : productList) {
                String productCid = PRODUCT_CID_PREFIX + productIndex;
                byte[] productImageBytes = decodeBase64Image(orderProducts.getImage());
                String productImgCell;
                if (productImageBytes != null && productImageBytes.length > 0) {
                    inlineImages.put(productCid, productImageBytes);
                    productImgCell = "<td width='50' style='padding:8px;border-bottom:1px solid #e0e0e0;' align='center'><img src='cid:" + productCid + "' width='50' height='50' alt='" + HtmlUtils.htmlEscape(orderProducts.getName()) + "' style='display:block;object-fit:cover;border-radius:4px;'/></td>";
                } else {
                    productImgCell = "<td width='50' style='padding:8px;border-bottom:1px solid #e0e0e0;' align='center'></td>";
                }
                productRows.append("<tr>")
                        .append(productImgCell)
                        .append("<td style='padding:8px;border-bottom:1px solid #e0e0e0;font-size:14px;color:#333333;' align='left'>")
                        .append(HtmlUtils.htmlEscape(orderProducts.getName()))
                        .append("</td>")
                        .append("<td width='60' style='padding:8px;border-bottom:1px solid #e0e0e0;font-size:14px;color:#333333;' align='center'>")
                        .append(orderProducts.getValue())
                        .append("</td>")
                        .append("<td width='80' style='padding:8px;border-bottom:1px solid #e0e0e0;font-size:14px;color:#333333;' align='right'>")
                        .append(orderProducts.getPrice())
                        .append(" ₪</td>")
                        .append("</tr>");
                productIndex++;
            }

            String logoImg = "<img src='cid:" + LOGO_CID + "' width='120' height='39' alt='Mont Blanc' style='display:block;vertical-align:middle;'/>";

            String emailBody =
                    "<!DOCTYPE html>" +
                            "<html lang='en'>" +
                            "<head>" +
                            "<meta charset='UTF-8' />" +
                            "<meta http-equiv='X-UA-Compatible' content='IE=edge' />" +
                            "<meta name='viewport' content='width=device-width, initial-scale=1.0' />" +
                            "<title>Order Confirmation</title>" +
                            "</head>" +
                            "<body style='margin:0;padding:0;background-color:#f4f4f4;'>" +
                            "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='background-color:#f4f4f4;padding:20px 0;'>" +
                            "<tr>" +
                            "<td align='center'>" +
                            "<table role='presentation' cellpadding='0' cellspacing='0' width='600' style='width:600px;max-width:100%;background-color:#ffffff;border-radius:4px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;'>" +
                            "<tr>" +
                            "<td style='background-color:#46BB22;padding:16px 24px;'>" +
                            "<table role='presentation' cellpadding='0' cellspacing='0' width='100%'>" +
                            "<tr>" +
                            "<td align='left' style='vertical-align:middle;'>" + logoImg + "</td>" +
                            "<td align='right' style='color:#ffffff;font-size:18px;font-weight:bold;vertical-align:middle;'>Order № " + orders.getId() + "</td>" +
                            "</tr>" +
                            "</table>" +
                            "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td style='padding:24px 24px 16px 24px;font-size:16px;color:#333333;'>" +
                            "<p style='margin:0 0 8px 0;'>Hello" + (orders.getName() != null && !orders.getName().isBlank() ? ", " + HtmlUtils.htmlEscape(orders.getName().trim()) : "") + ",</p>" +
                            "<p style='margin:0 0 16px 0;'>Thank you for your order at MontBlanc. Here are the details of your purchase:</p>" +
                            "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td style='padding:0 24px 24px 24px;'>" +
                            "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='border-collapse:collapse;border:1px solid #e0e0e0;border-radius:4px;overflow:hidden;'>" +
                            "<tr style='background-color:#f8f8f8;'>" +
                            "<th width='50' align='center' style='padding:8px;font-size:13px;color:#666666;font-weight:bold;border-bottom:1px solid #e0e0e0;'></th>" +
                            "<th align='left' style='padding:8px;font-size:13px;color:#666666;font-weight:bold;border-bottom:1px solid #e0e0e0;'>Name</th>" +
                            "<th align='center' width='60' style='padding:8px;font-size:13px;color:#666666;font-weight:bold;border-bottom:1px solid #e0e0e0;'>Qty</th>" +
                            "<th align='right' width='80' style='padding:8px;font-size:13px;color:#666666;font-weight:bold;border-bottom:1px solid #e0e0e0;'>Price</th>" +
                            "</tr>" +
                            productRows +
                            "<tr>" +
                            "<td colspan='3' align='right' style='padding:12px 8px;font-size:14px;color:#333333;font-weight:bold;border-top:1px solid #e0e0e0;'>Total:</td>" +
                            "<td align='right' style='padding:12px 8px;font-size:14px;color:#333333;font-weight:bold;border-top:1px solid #e0e0e0;'>" + orders.getTotal() + " ₪</td>" +
                            "</tr>" +
                            "</table>" +
                            "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td style='padding:0 24px 24px 24px;font-size:14px;color:#333333;'>" +
                            "<p style='margin:0 0 4px 0;'><strong>Delivery:</strong> " + orders.getDelivery() + "</p>" +
                            "<p style='margin:0 0 16px 0;'><strong>Payment:</strong> " + orders.getPayment() + "</p>" +
                            "<p style='margin:0;color:#777777;font-size:12px;'>If you did not place this order or believe this email was sent to you by mistake, please contact our support.</p>" +
                            "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td style='background-color:#f8f8f8;padding:16px 24px;font-size:12px;color:#999999;text-align:center;'>" +
                            "© MontBlanc. All rights reserved." +
                            "</td>" +
                            "</tr>" +
                            "</table>" +
                            "</td>" +
                            "</tr>" +
                            "</table>" +
                            "</body>" +
                            "</html>";

            String finalBody = emailBody;
            if (!inlineImages.containsKey(LOGO_CID)) {
                finalBody = finalBody.replace(logoImg, "");
            }
            logger.info("Before sending email to: {}", orders.getEmail());
            if (!inlineImages.isEmpty()) {
                emailService.sendWithInlineImages(orders.getEmail(), "Order № " + orders.getId() + " from MontBlanc", finalBody, inlineImages);
            } else {
                emailService.sendMultipartMessage(orders.getEmail(), "Order № " + orders.getId() + " from MontBlanc", finalBody);
            }
            logger.info("After sending email to: {}", orders.getEmail());
        } catch (Exception e) {
            logger.warn("Order #{} was saved, but failed to send email to {}: {}", orders.getId(), orders.getEmail(), e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Order placed successfully",
                "orderId", orders.getId()
        ));
    }

    private byte[] decodeBase64Image(String imageData) {
        if (imageData == null || imageData.isBlank()) {
            return null;
        }
        try {
            String base64 = imageData;
            if (base64.contains(",")) {
                base64 = base64.substring(base64.indexOf(',') + 1);
            }
            return Base64.getDecoder().decode(base64.trim());
        } catch (IllegalArgumentException e) {
            logger.debug("Failed to decode product image base64", e);
            return null;
        }
    }


    @DeleteMapping("/deleteOrder/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, String>> deleteOrder(@PathVariable("id") Long id, HttpSession session) {
        Map<String, String> response = new HashMap<>();
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null || !"admin".equals(currentUser.getCategory())) {
                response.put("status", "error");
                response.put("message", "Forbidden: only admin can delete orders");
                return ResponseEntity.status(403).body(response);
            }
            logger.info("Received DELETE request for order ID: {}", id);
            if (ordersRepository.existsById(id)) {
                ordersRepository.deleteById(id);
                logger.info("Order with ID {} deleted successfully", id);
                response.put("status", "success");
                response.put("message", "Order deleted");
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Order with ID {} not found", id);
                response.put("status", "error");
                response.put("message", "Order with ID " + id + " not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            logger.error("Error deleting order with ID {}", id, e);
            response.put("status", "error");
            response.put("message", "Error while deleting: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

