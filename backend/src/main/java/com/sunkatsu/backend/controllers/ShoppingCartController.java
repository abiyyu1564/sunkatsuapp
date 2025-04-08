package com.sunkatsu.backend.controllers;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.dto.Message;
import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.models.ShoppingCart;
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
        var cart = customerService.getCartByCustomerId(String.valueOf(UserId));
        if (cart != null) {
            return ResponseEntity.badRequest().body(new Message("Cart already exist for this user"));
        }
        var customer = customerService.getCustomerById(String.valueOf(UserId));
        return customer != null ? ResponseEntity.ok(cartService.createCart(new ShoppingCart(UserId))) : ResponseEntity.badRequest().body("UserId is not valid");
    }
    
    @Operation(
        summary = "Post a new cart",
        description = "Create new cart"
    )
    @PostMapping
    public ResponseEntity<Object> createShoppingCart(@RequestBody ShoppingCart cart) {
        var deliver = cart.getDeliver();
        try {
            deliver = URLDecoder.decode(cart.getDeliver(), StandardCharsets.UTF_8.toString());
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(new Message("Input tidak valid"));
        }
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchDeliver = pattern.matcher(deliver);
        if (matchDeliver.find()) {
            ResponseEntity.badRequest().body(new Message("Invalid deliver type!"));
        }
        return ResponseEntity.ok().body(cartService.createCart(cart));
    }

    @Operation(
        summary = "Get cart by id",
        description = "Get one cart by id"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Object> getCartById(@PathVariable int id) {
        return cartService.getCartById(id) != null ? ResponseEntity.ok(cartService.getCartById(id)) : ResponseEntity.badRequest().body(new Message("id is not found"));
    }

    @Operation(
        summary = "Update cart",
        description = "Update cart by id"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCart(@PathVariable int id, @RequestBody ShoppingCart cartDetails) {
        ShoppingCart updatedCart = cartService.updateCart(id, cartDetails);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.badRequest().body(new Message("Id is not valid"));
    }

    @Operation(
        summary = "Increment the quantity of a cart item",
        description = "Increment the quantity of a cart item by its cart id and cart item id"
    )
    @PostMapping("/increment")
    public ResponseEntity<Object> incrementQuantity(@RequestParam int id, @RequestParam int cartItemId) {
        ShoppingCart updatedCart = cartService.incrementQuantity(id, cartItemId);
        return updatedCart != null 
            ? ResponseEntity.ok(updatedCart) 
            : ResponseEntity.badRequest().body(new Message("id is not found"));
    }

    @Operation(
        summary = "Decrement the quantity of a cart item",
        description = "Decrement the quantity of a cart item by its cart id and cart item id"
    )
    @PostMapping("/decrement")
    public ResponseEntity<Object> decrementQuantity(@RequestParam int id, @RequestParam int cartItemId) {
        ShoppingCart updatedCart = cartService.decrementQuantity(id, cartItemId);
        return updatedCart != null 
            ? ResponseEntity.ok(updatedCart) 
            : ResponseEntity.badRequest().body(new Message("id is not found"));
    }

    @Operation(
        summary="Finish a cart",
        description="Finish a cart by id and returns a new Order"
    )
    @PostMapping("/{id}")
    public ResponseEntity<Object> finishCart(@PathVariable int id) {
        Order order = cartService.finishCart(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().body(new Message("Id is not valid"));
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
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.badRequest().body(new Message("Invalid cart id or cart item id"));
    }

    @Operation(
        summary="Add menu to cart",
        description="Add a single menu to cart. Valid deliver: take away, in store"
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
            return ResponseEntity.badRequest().body(new Message("Error : Invalid deliver method, note or quantity"));
        }

        if (!deliver.equals("take away") && !deliver.equals("in store")) {
            return ResponseEntity.badRequest().body(new Message("Error : Invalid deliver method. Valid deliver: take away, in store"));
        }
        ShoppingCart updatedCart = cartService.addMenuToCart(cartId, menuId, quantity, deliver, note);
        return updatedCart != null ? ResponseEntity.ok(updatedCart) : ResponseEntity.badRequest().body(new Message("Error : Something went wrong"));
    }
}