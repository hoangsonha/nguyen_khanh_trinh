package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeResponseDTO {
    int id;
    String userName;
    String phone;
    String fullName;
    String code;
    String email;
    String roleName;
    boolean enabled;
    boolean nonLocked;
    boolean deleted;

    List<EmploymentHistoryResponseDTO> employmentHistories;
}
