package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EmploymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "employee_history")
// Theo dõi các lần vào làm / nghỉ việc / quay lại làm
public class EmploymentHistory extends BaseEntity  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    Employee employee;

    LocalDate startDate;
    LocalDate endDate; // null nếu đang làm

    @Enumerated(EnumType.STRING)
    EmploymentStatus status;

    String note;

    Boolean isNewest;

    @OneToMany(mappedBy = "employmentHistory", cascade = CascadeType.ALL)
    @OrderBy("effectiveFrom DESC")
    List<SalaryPolicy> salaryPolicies;

}
