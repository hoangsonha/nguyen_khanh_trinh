package com.hsh.project.pojo;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.YearMonth;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "salaries")
public class Salary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long id;

     BigDecimal baseSalary;
     BigDecimal bonus;

     YearMonth payMonth;

    @ManyToOne
    @JoinColumn(name = "employee_id")
     Employee employee;

}
