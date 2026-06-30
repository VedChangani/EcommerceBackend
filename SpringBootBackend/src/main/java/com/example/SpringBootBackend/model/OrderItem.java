package com.example.SpringBootBackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int quantity;

    @ManyToOne
    private Product product;

    @ManyToOne(fetch=FetchType.LAZY)
    private Order order;

    private BigDecimal totalPrice;
}
