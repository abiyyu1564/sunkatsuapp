package com.sunkatsu.backend.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.models.Customer;
import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.repositories.OrderRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(int id, Order orderDetails) {
        return orderRepository.findById(id).map(order -> {
            order.setDeliver(orderDetails.getDeliver());
            order.setTotal(orderDetails.getTotal());
            order.setUserID(orderDetails.getUserID());
            order.setCartItems(orderDetails.getCartItems());
            order.setPaymentDeadline(orderDetails.getPaymentDeadline());
            order.setStatus(orderDetails.getStatus());
            return orderRepository.save(order);
        }).orElse(null);
    }

    public Order createOrder(int total, String deliver, int userId) {
        Customer customer = customerService.getCustomerById(String.valueOf(userId));
        if (customer == null) {
            return null;
        }
        // Mengatur payment deadline menjadi 2 jam dari sekarang
        Date paymentDeadline = Order.calculatePaymentDeadline();
        Order order = new Order(
            sequenceGeneratorService.generateSequence(Order.SEQUENCE_NAME),
            total, deliver, userId, null, paymentDeadline, "Not Paid"
        );
        return orderRepository.save(order);
    }


    public void deleteOrder(int id) throws Exception {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            orderRepository.deleteById(id);
        }
        throw new Exception("Invalid order id");
    }

    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }

    public Order getOrderByUserId(int Userid) {
        return orderRepository.findByUserID(Userid);
    }

    public List<Order> getOrderByStatus(String status) {
        return orderRepository.findAllByStatus(status);
    }

    public Order acceptOrder(int id) {
        Optional<Order> orderOpt = orderRepository.findById(id); 
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus("Accepted");
            order.setPaymentDeadline(null); // Disable TTL
            return orderRepository.save(order);
        }
        return null;
    }

    public Order finishOrder(int id) {
        Optional<Order> orderOpt = orderRepository.findById(id); 
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus("Finished");
            order.setPaymentDeadline(null); // Disable TTL
            return orderRepository.save(order);
        }
        return null;
    }

}
