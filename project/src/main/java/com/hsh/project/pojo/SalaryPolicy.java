package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.SalaryType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "employee_policy")
// 	Lưu chính sách lương của từng giai đoạn làm việc
public class SalaryPolicy extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "employment_history_id", nullable = false)
    EmploymentHistory employmentHistory;

    @Enumerated(EnumType.STRING)
    SalaryType salaryType;

    BigDecimal baseSalary; // Nếu FIXED: tính theo tháng. Nếu HOURLY: tính theo giờ

    LocalDate effectiveFrom;
    LocalDate effectiveTo; // null nếu chưa kết thúc

     String modifiedBy;
     String reason;

     Boolean isNewest;

}
