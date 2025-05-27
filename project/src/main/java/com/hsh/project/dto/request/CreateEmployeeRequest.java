package com.hsh.project.dto.request;

import com.hsh.project.pojo.enums.SalaryType;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateEmployeeRequest {

    @NotBlank(message = "Username must not be blank")
    private String userName;

    @NotBlank(message = "Full name must not be blank")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email must not be blank")
    private String email;

    @NotBlank(message = "Employee code must not be blank")
    private String code;

    @NotBlank(message = "Phone number must not be blank")
    private String phone;

    @NotBlank(message = "Password must not be blank")
    @Size(max = 100, min = 1, message = "Password must be between 1 and 100 characters")
    private String password;

    @NotNull(message = "Role must not be null")
    private String roleName;

    @NotNull(message = "Start date must not be null")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Salary type must not be null")
    private SalaryType salaryType; // Enum: FIXED, HOURLY

    @NotNull(message = "Base salary must not be null")
    private BigDecimal baseSalary;

    private String note;
}
