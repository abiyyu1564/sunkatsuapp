package com.sunkatsu.backend.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
   
import com.sunkatsu.backend.models.CartItem;
import com.sunkatsu.backend.models.Menu;
import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.models.ShoppingCart;
import com.sunkatsu.backend.repositories.MenuRepository;
import com.sunkatsu.backend.repositories.OrderRepository;
import com.sunkatsu.backend.repositories.ShoppingCartRepository;

@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartRepository cartRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public List<ShoppingCart> findAllCart() {
        return cartRepository.findAll();
    }
    public ShoppingCart createCart(ShoppingCart cart) {
        cart.setId(sequenceGeneratorService.generateSequence(ShoppingCart.SEQUENCE_NAME));
        cart.calculateTotal();
        return cartRepository.save(cart);
    }

    public ShoppingCart getCartById(int id) {
        return cartRepository.findById(id).isPresent() ? cartRepository.findById(id).get() : null;
    }

    public ShoppingCart updateCart(int id, ShoppingCart cart) {
        cart.calculateTotal();
        return cartRepository.save(cart);
    }

    public boolean deleteCart(int id) {
        if (cartRepository.existsById(id)) {
            cartRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public ShoppingCart addMenuToCart(int cartId, int menuId, int quantity, String deliver, String note) {
        Optional<ShoppingCart> cartOpt = cartRepository.findById(cartId);
        Optional<Menu> menuOpt = menuRepository.findById(menuId);

        if (cartOpt.isPresent() && menuOpt.isPresent()) {
            ShoppingCart cart = cartOpt.get();
            Menu menu = menuOpt.get();

            if (cart.getCartItems().isEmpty()) {
                if (deliver == null) {
                    return null;
                }
                cart.setDeliver(deliver);
            }

            CartItem newItem = new CartItem(sequenceGeneratorService.generateSequence(CartItem.SEQUENCE_NAME), note, quantity, menu);
            cart.addCartItem(newItem);
            cart.calculateTotal();
            return cartRepository.save(cart);
        }
        return null;
    }

    public Order finishCart(int cartId) {
        Optional<ShoppingCart> cartOpt = cartRepository.findById(cartId);

        if (cartOpt.isPresent()) {
            ShoppingCart cart = cartOpt.get();
            cartRepository.deleteById(cart.getId());

            Order order = new Order(sequenceGeneratorService.generateSequence(Order.SEQUENCE_NAME), cart.getTotal(), cart.getDeliver(), cart.getUserID(), cart.getCartItems(), Order.calculatePaymentDeadline(), "Not Paid");
            return orderRepository.save(order);
        }
        return null;
    }

    public ShoppingCart deleteCartItemFromShoppingCart(int cartId, int cartItemId) {
        Optional<ShoppingCart> cartOpt = cartRepository.findById(cartId);
        
        if (cartOpt.isPresent()) {
            ShoppingCart cart = cartOpt.get();
            // Cari item di dalam cart dan hapus berdasarkan cartItemId
            boolean itemRemoved = cart.getCartItems().removeIf(cartItem -> cartItem.getId() == cartItemId);
            
            if (itemRemoved) {
                cart.calculateTotal(); // Hitung ulang total setelah penghapusan
                cartRepository.save(cart); // Simpan kembali keranjang yang diperbarui
                return cart;
            }
        }
        return null; // Jika cart tidak ditemukan atau item tidak ada
    }

    public ShoppingCart incrementQuantity(int id, int cartItemId) {
        Optional<ShoppingCart> cartOpt = cartRepository.findById(id);
    
        if (cartOpt.isPresent()) {
            ShoppingCart cart = cartOpt.get();
            
            for (CartItem cartItem : cart.getCartItems()) {
                if (cartItem.getId() == cartItemId) {
                    cartItem.setQuantity(cartItem.getQuantity() +1);
                    break; 
                }
            }
            cartRepository.save(cart);
            return cart;
        }
        return null;
    }
    
    public ShoppingCart decrementQuantity(int id, int cartItemId) {
        Optional<ShoppingCart> cartOpt = cartRepository.findById(id);
    
        if (cartOpt.isPresent()) {
            ShoppingCart cart = cartOpt.get();
    
            for (int i = 0; i < cart.getCartItems().size(); i++) {
                CartItem cartItem = cart.getCartItems().get(i);
                if (cartItem.getId() == cartItemId) {
                    if (cartItem.getQuantity() > 1) {
                        cartItem.setQuantity(cartItem.getQuantity() - 1);
                    } else {
                        cart.getCartItems().remove(i); 
                    }
                    break; 
                }
            }
            cartRepository.save(cart); 
            return cart;
        }
        return null;
    }
    

    /*public ShoppingCart updateMenuInCart(int cartId, int cartItemId, int quantity, String note) {
        Optional<ShoppingCart> cartOpt = cartRepository.findById(cartId);
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);

        if (cartOpt.isPresent() && cartItemOpt.isPresent()) {
            CartItem cartItem = cartItemOpt.get();
            ShoppingCart cart = cartOpt.get();
            cartItem.setNote(note);
            cartItem.setQuantity(quantity);
            return cart;
        }
        return null;
    }*/
}
