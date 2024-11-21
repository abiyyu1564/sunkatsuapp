package com.sunkatsu.backend.controllers;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
import com.sunkatsu.backend.models.User;
import com.sunkatsu.backend.services.CustomerService;
import com.sunkatsu.backend.services.ShoppingCartService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/carts")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService cartService;

    @Autowired
    private CustomerService customerService;

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
    public ResponseEntity<Object> getEmptyCart(@RequestParam int UserId) {
        var customer = customerService.getCustomerById(String.valueOf(UserId));
        return customer != null ? ResponseEntity.ok(cartService.createCart(new ShoppingCart(UserId))) : ResponseEntity.badRequest().body("UserId is not valid");
    }
    
    @Operation(
        summary = "Poast a new cart",
        description = "Create new cart"
    )
    @PostMapping
    public ResponseEntity<Object> createShoppingCart(@RequestBody ShoppingCart cart) {
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchDeliver = pattern.matcher(cart.getDeliver());
        if (matchDeliver.find()) {
            ResponseEntity.badRequest().body("Invalid deliver type!");
        }
        return ResponseEntity.ok().body(cartService.createCart(cart));
    }

    @Operation(
        summary = "Get cart by id",
        description = "Get one cart by id"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Object> getCartById(@PathVariable int id) {
        return cartService.getCartById(id) != null ? ResponseEntity.ok(cartService.getCartById(id)) : ResponseEntity.badRequest().body("id is not found");
    }

    @Operation(
        summary = "Update cart",
        description = "Update cart by id"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCart(@PathVariable int id, @RequestBody ShoppingCart cartDetails) {
        ShoppingCart updatedCart = cartService.updateCart(id, cartDetails);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.badRequest().body("Id is not valid");
    }

    @Operation(
        summary="Finish a cart",
        description="Finish a cart by id and returns a new Order"
    )
    @PostMapping("/{id}")
    public ResponseEntity<Object> finishCart(@PathVariable int id) {
        Order order = cartService.finishCart(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().body("Id is not valid");
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
    public ResponseEntity<Object> deleteCartItemFromShoppingCart(
        @PathVariable int cartId,
        @PathVariable int cartItemId) 
    {
        ShoppingCart updatedCart = cartService.deleteCartItemFromShoppingCart(cartId, cartItemId);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.badRequest().body("Invalid cart id or cart item id");
    }

    @Operation(
        summary="Add menu to cart",
        description="Add a single menu to cart"
    )
    @PostMapping("/{cartId}/add-menu")
    public ResponseEntity<Object> addMenuToCart(
            @PathVariable int cartId,
            @RequestParam int menuId,
            @RequestParam int quantity,
            @RequestParam String deliver,
            @RequestParam String note) {

        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchDeliver = pattern.matcher(deliver);
        Matcher matchNote = pattern.matcher(note);
        if (matchDeliver.find() || matchNote.find() || quantity < 0) {
            return ResponseEntity.badRequest().body("Invalid deliver method, note or quantity");
        }
        ShoppingCart updatedCart = cartService.addMenuToCart(cartId, menuId, quantity, deliver, note);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.badRequest().body("Something went wrong");
    }
}