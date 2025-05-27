package com.hsh.project.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmploymentHistoryResponseDTO {
    int id;
    LocalDate startDate;
    LocalDate endDate;
    String status;
    String note;
    Boolean isNewest;

    List<SalaryPolicyResponseDTO> salaryPolicies;
}
