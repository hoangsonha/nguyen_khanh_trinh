package com.hsh.project.dto.request;

import com.hsh.project.pojo.enums.SalaryType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateEmployeeRequest {

    String userName;
    String fullName;
    String code;
    String phone;
    String roleName;

     LocalDate startDate; // chỉ set nếu là quay lại
     LocalDate endDate;
     String salaryType;
     BigDecimal baseSalary;
     String note;
}
