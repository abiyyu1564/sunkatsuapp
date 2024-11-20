package com.sunkatsu.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.models.ShoppingCart;
import com.sunkatsu.backend.services.ShoppingCartService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/carts")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService cartService;

    @Operation(
        summary = "Get all carts",
        description = "Get all carts"
    )
    @GetMapping
    public List<ShoppingCart> getAllCarts() {
        return cartService.findAllCart();
    }
    
    @Operation(
        summary="Initialize an empty cart",
        description="Create a new empty cart for user by userId"
    )
    @GetMapping("/empty")
    public ShoppingCart getEmptyCart(@RequestParam int UserId) {
        return cartService.createCart(new ShoppingCart(UserId));
    }
    
    @Operation(
        summary = "Poast a new cart",
        description = "Create new cart"
    )
    @PostMapping
    public ShoppingCart createShoppingCart(@RequestBody ShoppingCart cart) {
        return cartService.createCart(cart);
    }

    @Operation(
        summary = "Get cart by id",
        description = "Get one cart by id"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ShoppingCart> getCartById(@PathVariable int id) {
        return cartService.getCartById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
        summary = "Update cart",
        description = "Update cart by id"
    )
    @PutMapping("/{id}")
    public ResponseEntity<ShoppingCart> updateCart(@PathVariable int id, @RequestBody ShoppingCart cartDetails) {
        ShoppingCart updatedCart = cartService.updateCart(id, cartDetails);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.notFound().build();
    }

    @Operation(
        summary="Finish a cart",
        description="Finish a cart by id and returns a new Order"
    )
    @PostMapping("/{id}")
    public ResponseEntity<Order> finishCart(@PathVariable int id) {
        Order order = cartService.finishCart(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().build();
    }

    /*@DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable int id) {
        return cartService.deleteCart(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }*/

    @Operation(
        summary = "Delete a cart item from cart",
        description = "Delete a cart item from cart by their ids"
    )
    @DeleteMapping("/{cartId}/cart-items/{cartItemId}")
    public ResponseEntity<ShoppingCart> deleteCartItemFromShoppingCart(
        @PathVariable int cartId,
        @PathVariable int cartItemId) 
    {
        ShoppingCart updatedCart = cartService.deleteCartItemFromShoppingCart(cartId, cartItemId);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.notFound().build();
    }

    @Operation(
        summary="Add menu to cart",
        description="Add a single menu to cart"
    )
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