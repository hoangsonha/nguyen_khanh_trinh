package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProjectMemberResponseDTO {
    Integer id;
    String roleInProject;
    String employeeEmail;
    int employeeId;
    String employeeCode;
    String status;
}
