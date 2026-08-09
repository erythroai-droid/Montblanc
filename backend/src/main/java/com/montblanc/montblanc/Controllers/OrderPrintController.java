package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.Clases.Orders;
import com.montblanc.montblanc.Clases.User;
import com.montblanc.montblanc.Repositories.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;
import java.util.List;

@Controller
public class OrderPrintController {

    @Autowired
    OrdersRepository ordersRepository;

    @GetMapping("/allOrders")
    public String showOrders(Model model, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return "redirect:/";
        }
        List<Orders> orders;
        boolean isAdmin = "admin".equals(currentUser.getCategory());
        if (isAdmin) {
            orders = ordersRepository.findAll();
        } else {
            orders = ordersRepository.findByUserId(currentUser.getId());
        }

        model.addAttribute("orders", orders);
        model.addAttribute("isAdmin", isAdmin);
        return "/WEB-INF/views/allOrders.jsp";
    }
}
