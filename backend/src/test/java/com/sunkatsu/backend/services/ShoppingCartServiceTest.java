package com.sunkatsu.backend.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.sunkatsu.backend.models.CartItem;
import com.sunkatsu.backend.models.Menu;
import com.sunkatsu.backend.models.ShoppingCart;
import com.sunkatsu.backend.repositories.MenuRepository;
import com.sunkatsu.backend.repositories.ShoppingCartRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ShoppingCartServiceTest {

    @Mock
    private MenuRepository menuRepository;

    @Mock
    private ShoppingCartRepository cartRepository;

    @Mock
    private SequenceGeneratorService sequenceGeneratorService;

    @InjectMocks
    private ShoppingCartService cartService;

    @Test
    public void ShoppingCartService_CreateCart_ReturnsCart() {
        ShoppingCart cart = new ShoppingCart(999, 1000, "take away", 0, null);
        
        when(sequenceGeneratorService.generateSequence(ShoppingCart.SEQUENCE_NAME)).thenReturn(1);
        when(cartRepository.save(Mockito.any(ShoppingCart.class))).thenReturn(cart);

        ShoppingCart savedCart = cartService.createCart(cart);

        Assertions.assertThat(savedCart).isNotNull();
        Assertions.assertThat(savedCart.getId()).isEqualTo(1);
    }

    @Test
    public void ShoppingCartService_GetCartById_ReturnsCart() {
        ShoppingCart cart = new ShoppingCart();
        cart.setId(1);
        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));

        ShoppingCart result = cartService.getCartById(1);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1);
    }

    @Test
    public void ShoppingCartService_AddMenuToCart_AddsMenuToCart() {
        ShoppingCart cart = new ShoppingCart();
        cart.setId(1);
  
        Menu menu = new Menu();
        menu.setId(1);
        menu.setPrice(100);
  
        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));
        when(menuRepository.findById(1)).thenReturn(Optional.of(menu));
        when(sequenceGeneratorService.generateSequence(CartItem.SEQUENCE_NAME)).thenReturn(1);
        when(cartRepository.save(any(ShoppingCart.class))).thenAnswer(invocation -> invocation.getArgument(0));
  
        ShoppingCart result = cartService.addMenuToCart(1, 1, 2, "take away", "note");
  
        assertThat(result).isNotNull();
        assertThat(result.getCartItems()).hasSize(1);
        assertThat(result.getTotal()).isEqualTo(200);
    }

    @Test
    public void ShoppingCartService_CartItemFromCart_RemovesACartItemFromCart() {
        ShoppingCart cart = new ShoppingCart();
        CartItem item1 = new CartItem();
        item1.setId(1);
        item1.setMenu(new Menu());
        item1.getMenu().setPrice(100);
        item1.setQuantity(2);
        CartItem item2 = new CartItem();
        item2.setId(2);
        item2.setMenu(new Menu());
        item2.getMenu().setPrice(150);
        item2.setQuantity(2);
        cart.setCartItems(new ArrayList<>(Arrays.asList(item1, item2)));

        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(ShoppingCart.class))).thenAnswer(invocation -> invocation.getArgument(0));
        ShoppingCart result = cartService.deleteCartItemFromShoppingCart(1, 1);

        assertThat(result).isNotNull();
        assertThat(result.getCartItems()).hasSize(1);
        assertThat(result.getCartItems().get(0).getId()).isEqualTo(2);
        verify(cartRepository, times(1)).save(cart);
    }

    @Test
    public void ShoppingCartService_incrementQty_IncrementsTheQtyOfACartItem() {
        ShoppingCart cart = new ShoppingCart();
        CartItem item = new CartItem();
        item.setId(1);
        item.setQuantity(1);
        cart.setCartItems(new ArrayList<>(Arrays.asList(item)));
  
        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(ShoppingCart.class))).thenAnswer(invocation -> invocation.getArgument(0));
  
        ShoppingCart result = cartService.incrementQuantity(1, 1);
  
        assertThat(result).isNotNull();
        assertThat(result.getCartItems().get(0).getQuantity()).isEqualTo(2);
    }

    @Test
    public void ShoppingCartService_decremetQty_decrementsTheQtyOfACartItem() {
        ShoppingCart cart = new ShoppingCart();
        CartItem item = new CartItem();
        item.setId(1);
        item.setQuantity(1);
        cart.setCartItems(new ArrayList<>(Arrays.asList(item)));
  
        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(ShoppingCart.class))).thenAnswer(invocation -> invocation.getArgument(0));
  
        ShoppingCart result = cartService.decrementQuantity(1, 1);
  
        assertThat(result).isNotNull();
        assertThat(result.getCartItems()).isEmpty();
    }

}

