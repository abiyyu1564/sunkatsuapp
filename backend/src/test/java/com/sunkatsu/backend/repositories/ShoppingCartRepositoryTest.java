package com.sunkatsu.backend.repositories;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.sunkatsu.backend.models.Customer;
import com.sunkatsu.backend.models.ShoppingCart;

@DataMongoTest
@ExtendWith(SpringExtension.class)
public class ShoppingCartRepositoryTest {

    @Autowired
    private ShoppingCartRepository cartRepository;

    @Test
    public void ShoppingCartRepository_Save_ReturnSavedShoppingCart() {
        // Arrange
        ShoppingCart cart = new ShoppingCart(999, 100, "take away", 0, null);

        // Act
        ShoppingCart savedCart = cartRepository.save(cart);

        // Assert
        Assertions.assertThat(savedCart).isNotNull();
        Assertions.assertThat(savedCart.getId()).isGreaterThan(0);

        //Tear down
        cartRepository.delete(savedCart);
    }

    @Test
    public void ShoppingCartRepository_FindAll_ReturnMoreThanOneCarts() {
        // Arrange
        ShoppingCart cart = new ShoppingCart(999, 100, "take away", 0, null);
        
        ShoppingCart cart2 = new ShoppingCart(998, 150, "take away", 0, null);

        cartRepository.save(cart);
        cartRepository.save(cart2);

        // Act
        List<ShoppingCart> cartList = cartRepository.findAll();


        // Assert
        Assertions.assertThat(cartList).isNotNull();
        Assertions.assertThat(cartList.size()).isGreaterThanOrEqualTo(2);

        // Tear Down
        cartRepository.delete(cart);
        cartRepository.delete(cart2);
    }

    @Test
    public void ShoppingCartRepository_FindById_ReturnOneCartById() {
        // Arrange
        ShoppingCart cart = new ShoppingCart(999, 100, "take away", 0, null);
        cartRepository.save(cart);
    
        // Act
        ShoppingCart foundCart = cartRepository.findById(999).get();

        // Assert
        Assertions.assertThat(foundCart).isNotNull();

        // Tear down
        cartRepository.delete(cart);
    }

    @Test
    public void ShoppingCartRepository_DeleteById_DeletesExistingCartById() {
        //Arrange
        ShoppingCart cart = new ShoppingCart(999, 100, "take away", 0, null);
        cartRepository.save(cart);

        //Act
        cartRepository.deleteById(999);

        // Assert
        Assertions.assertThat(cartRepository.findById(999)).isEmpty();
    }

    @Test
    public void ShoppingCartRepository_findByUserId_ReturnsCartWithCorespondingUserId() {
        // Arrange
        ShoppingCart cart1 = new ShoppingCart(999, 100, "take away", 999, null);
        ShoppingCart cart2 = new ShoppingCart(998, 100, "take away", 998, null);
        cartRepository.save(cart1);
        cartRepository.save(cart2);

        //Act
        ShoppingCart foundCart1 = cartRepository.findByUserID(999);
        ShoppingCart foundCart2 = cartRepository.findByUserID(998);

        // Assert
        Assertions.assertThat(foundCart1).isNotNull();
        Assertions.assertThat(foundCart2).isNotNull();
        Assertions.assertThat(foundCart1.getId()).isEqualTo(cart1.getId());
        Assertions.assertThat(foundCart2.getId()).isEqualTo(cart2.getId());

        // Tear down
        cartRepository.delete(foundCart2);
        cartRepository.delete(foundCart1);
    }
}

