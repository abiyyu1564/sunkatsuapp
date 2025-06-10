package com.sunkatsu.backend.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.stream.Collectors;

import org.springdoc.core.converters.models.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.models.CartItem;
import com.sunkatsu.backend.models.Customer;
import com.sunkatsu.backend.models.Favorite;
import com.sunkatsu.backend.models.Menu;
import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.repositories.FavoriteRepository;
import com.sunkatsu.backend.repositories.MenuRepository;
import com.sunkatsu.backend.repositories.OrderRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    private FavoriteRepository favoriteRepository;

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order findOrderById(int id) {
        return orderRepository.findById(id).isPresent() ? orderRepository.findById(id).get() : null;
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
        List<Order> orders = orderRepository.findAll();

        // Prioritas status: Accepted > Not Paid > Finished
        List<String> statusPriority = List.of("Accepted", "Not Paid", "Finished");

        // Sort orders berdasarkan prioritas status
        return orders.stream()
                .sorted(Comparator.comparingInt(o -> statusPriority.indexOf(o.getStatus())))
                .collect(Collectors.toList());
    }

    public List<Order> getOrderByUserId(int Userid) {
        List<Order> orders = orderRepository.findAllByUserID(Userid);

        // Prioritas status: Accepted > Not Paid > Finished
        List<String> statusPriority = List.of("Accepted", "Not Paid", "Finished");

        // Sort orders berdasarkan prioritas status
        return orders.stream()
                .sorted(Comparator.comparingInt(o -> statusPriority.indexOf(o.getStatus())))
                .collect(Collectors.toList());
    }

    public List<Order> getOrderByStatus(String status) {
        return orderRepository.findAllByStatus(status);
    }

    public Order acceptOrder(int id) {
        Optional<Order> orderOpt = orderRepository.findById(id); 
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus("Accepted");
            order.setPaymentDeadline(null); 
            return orderRepository.save(order);
        }
        return null;
    }

    public Order finishOrder(int id) {
        Optional<Order> orderOpt = orderRepository.findById(id); 
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            Customer customer = customerService.getCustomerById(String.valueOf(order.getUserID()));

            for (CartItem c : order.getCartItems()) {
                List<Favorite> favs = favoriteRepository.findAllByUserIDAndMenu(Integer.parseInt(customer.getId()), c.getMenu());
                if (!favs.isEmpty()) {
                    // Update the first, delete the rest
                    Favorite fav = favs.get(0);
                    fav.setTimesBought(fav.getTimesBought() + c.getQuantity());
                    favoriteRepository.save(fav);
                    // Remove duplicates
                    for (int i = 1; i < favs.size(); i++) {
                        favoriteRepository.delete(favs.get(i));
                    }
                } else {
                    Favorite favBaru = new Favorite(
                        sequenceGeneratorService.generateSequence(Favorite.SEQUENCE_NAME),
                        c.getQuantity(),
                        c.getMenu(),
                        Integer.parseInt(customer.getId())
                    );
                    favoriteRepository.save(favBaru);
                }
            }
            ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Asia/Jakarta"));
            order.setStatus("Finished");
            order.setPaymentDeadline(null); // Disable TTL
            order.setFinishedAt(Date.from(zonedDateTime.toInstant()));
            return orderRepository.save(order);
        }
        return null;
    }

    public void deleteCanceledOrder() {
        var orders = orderRepository.findAll();
        for (Order o : orders) {
            if (o.getStatus().equals("Canceled")) {
                orderRepository.delete(o);
            }

        }
    }

    public void checkOrderToCancel() {
        var orders = orderRepository.findAll();
        Date now = new Date();
        for (Order o : orders) {
            if (o.getPaymentDeadline() != null) {
                if (now.after(o.getPaymentDeadline())) {
                    orderRepository.delete(o);
                }
            }
        }
    }

}
