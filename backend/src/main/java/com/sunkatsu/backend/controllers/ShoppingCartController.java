package com.sunkatsu.backend.controllers;

import com.sunkatsu.backend.services.*;
import com.sunkatsu.backend.models.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService cartService;

    @GetMapping
    public List<ShoppingCart> getAllCarts() {
        return cartService.findAllCart();
    }
    
    @GetMapping("/empty")
    public ShoppingCart getEmptyCart(@RequestParam int UserId) {
        return cartService.createCart(new ShoppingCart(UserId));
    }
    
    @PostMapping
    public ShoppingCart createShoppingCart(@RequestBody ShoppingCart cart) {
        return cartService.createCart(cart);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShoppingCart> getCartById(@PathVariable int id) {
        return cartService.getCartById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShoppingCart> updateCart(@PathVariable int id, @RequestBody ShoppingCart cartDetails) {
        ShoppingCart updatedCart = cartService.updateCart(id, cartDetails);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}")
    public ResponseEntity<Order> finishCart(@PathVariable int id) {
        Order order = cartService.finishCart(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().build();
    }

    /*@DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable int id) {
        return cartService.deleteCart(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }*/

    @DeleteMapping("/{cartId}/cart-items/{cartItemId}")
    public ResponseEntity<ShoppingCart> deleteCartItemFromShoppingCart(
        @PathVariable int cartId,
        @PathVariable int cartItemId) 
    {
        ShoppingCart updatedCart = cartService.deleteCartItemFromShoppingCart(cartId, cartItemId);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{cartId}/add-menu")
    public ResponseEntity<ShoppingCart> addMenuToCart(
            @PathVariable int cartId,
            @RequestParam int menuId,
            @RequestParam int quantity,
            @RequestParam String deliver,
            @RequestParam String note) {

        ShoppingCart updatedCart = cartService.addMenuToCart(cartId, menuId, quantity, deliver, note);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.notFound().build();
    }
}