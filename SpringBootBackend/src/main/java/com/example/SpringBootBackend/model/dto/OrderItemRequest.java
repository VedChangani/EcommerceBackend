package com.example.SpringBootBackend.model.dto;

public record OrderItemRequest (
        int productId,
        int quantity
){}
