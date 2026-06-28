package com.example.SpringBootBackend.service;

import com.example.SpringBootBackend.model.Product;
import com.example.SpringBootBackend.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    public List<Product> getProducts() {
        return productRepo.findAll();
    }
}
