package com.sunkatsu.backend.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunkatsu.backend.models.ShoppingCart;
import com.sunkatsu.backend.services.CustomerService;
import com.sunkatsu.backend.services.JwtService;
import com.sunkatsu.backend.services.MyUserDetailService;
import com.sunkatsu.backend.services.ShoppingCartService;

@WebMvcTest(controllers = ShoppingCartController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class ShoppingCartControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private ShoppingCartService shoppingCartService;

    @MockBean
    private MyUserDetailService myUserDetailService;

    @MockBean
    private CustomerService customerService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void ShoppingCartController_GetAllCart_ReturnsAllCart() throws Exception {
        ShoppingCart cart1 = new ShoppingCart();
        cart1.setId(1);
        ShoppingCart cart2 = new ShoppingCart();
        cart2.setId(2);

        when(shoppingCartService.findAllCart()).thenReturn(Arrays.asList(cart1, cart2));

        mockMvc.perform(get("/api/carts"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void ShoppingCartController_CreateShoppingCart_CreatesACart() throws Exception {
        ShoppingCart cart = new ShoppingCart();
        cart.setId(1);
        cart.setDeliver("take away");

        when(shoppingCartService.createCart(any(ShoppingCart.class))).thenReturn(cart);

        mockMvc.perform(post("/api/carts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cart)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void ShoppingCartController_GetCartById_ReturnCoresspondingCart() throws Exception {
        ShoppingCart cart = new ShoppingCart();
        cart.setId(1);

        when(shoppingCartService.getCartById(1)).thenReturn(cart);

        mockMvc.perform(get("/api/carts/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void ShoppingCartControlelr_testGetCartById_NotFound() throws Exception {
        when(shoppingCartService.getCartById(1)).thenReturn(null);

        mockMvc.perform(get("/api/carts/1"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("id is not found"));
    }

    @Test
    public void ShoppingCartController_testAddMenuToCart_addsMenuToACart() throws Exception {
        ShoppingCart updatedCart = new ShoppingCart();
        updatedCart.setId(1);

        when(shoppingCartService.addMenuToCart(eq(1), eq(1), eq(2), eq("take away"), eq("note"))).thenReturn(updatedCart);

        mockMvc.perform(post("/api/carts/1/add-menu")
                .param("menuId", "1")
                .param("quantity", "2")
                .param("deliver", "take away")
                .param("note", "note"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void ShoppingCartController_testAddMenuToCart_InvalidDeliver() throws Exception {
        mockMvc.perform(post("/api/carts/1/add-menu")
                .param("menuId", "1")
                .param("quantity", "2")
                .param("deliver", "invalid")
                .param("note", "note"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Error : Invalid deliver method. Valid deliver: take away, in store"));
    }
    
    @Test
    public void ShoppingCartController_testDeleteCartItemFromShoppingCart_Success() throws Exception {
        ShoppingCart updatedCart = new ShoppingCart();
        updatedCart.setId(1);

        when(shoppingCartService.deleteCartItemFromShoppingCart(1, 2)).thenReturn(updatedCart);

        mockMvc.perform(delete("/api/carts/1/cart-items/2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void ShoppingCartController_testDeleteCartItemFromShoppingCart_NotFound() throws Exception {
        when(shoppingCartService.deleteCartItemFromShoppingCart(1, 2)).thenReturn(null);

        mockMvc.perform(delete("/api/carts/1/cart-items/2"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Invalid cart id or cart item id"));
    }
}
