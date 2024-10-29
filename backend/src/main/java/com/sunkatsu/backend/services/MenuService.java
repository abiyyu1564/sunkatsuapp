package com.sunkatsu.backend.services;

import org.springframework.stereotype.Service;
import com.sunkatsu.backend.models.*;
import com.sunkatsu.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public Menu createMenu(Menu menu) {
        menu.setId(sequenceGeneratorService.generateSequence(Menu.SEQUENCE_NAME));
        return menuRepository.save(menu);
    }

    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    public Optional<Menu> getMenuById(int id) {
        return menuRepository.findById(id);
    }

    public Menu updateMenu(int id, Menu menuDetails) {
        return menuRepository.findById(id).map(menu -> {
            menu.setName(menuDetails.getName());
            menu.setImageURL(menuDetails.getImageURL());
            menu.setImage(menuDetails.getImage());
            menu.setPrice(menuDetails.getPrice());
            menu.setDesc(menuDetails.getDesc());
            menu.setNumsBought(menuDetails.getNumsBought());
            return menuRepository.save(menu);
        }).orElse(null);
    }

    public boolean deleteMenu(int id) {
        if (menuRepository.existsById(id)) {
            menuRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
