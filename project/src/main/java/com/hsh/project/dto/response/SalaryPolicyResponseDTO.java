package com.hsh.project.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalaryPolicyResponseDTO {
    int id;
    String salaryType;
    BigDecimal baseSalary;
    LocalDate effectiveFrom;
    LocalDate effectiveTo;
    Boolean isNewest;
}
