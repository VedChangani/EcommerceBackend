package com.example.SpringBootBackend.controller;

import com.example.SpringBootBackend.model.Product;
import com.example.SpringBootBackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts(){
        return new ResponseEntity<>(productService.getProducts(), HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductByID(@PathVariable int id){
        Product product = productService.getProductBtId(id);

        if(product == null){
            return new ResponseEntity<>(product,HttpStatus.NOT_FOUND);
        }
        else{
            return new ResponseEntity<>(product, HttpStatus.OK);
        }
    }

    @GetMapping("/product/{id}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int id){
        Product product = productService.getProductBtId(id);
        return new ResponseEntity<>(product.getImageData(), HttpStatus.OK);
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart("product") Product product, @RequestPart("imageFile") MultipartFile imageFile){
        Product savedproduct = null;
        System.out.println(imageFile.getOriginalFilename());
        System.out.println(product);

        try {
            savedproduct = productService.addProduct(product,imageFile);
            return new ResponseEntity<>(savedproduct,HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
