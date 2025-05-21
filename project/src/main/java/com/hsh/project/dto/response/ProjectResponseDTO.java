package com.hsh.project.dto.response;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.ProjectMember;
import com.hsh.project.pojo.Task;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProjectResponseDTO {
    int id;
    String name;
    String description;
    LocalDate startDate;
    LocalDate endDate;
    String projectStatus;
    int employeeId;
    String employeeEmail;
    String employeeFullName;
    String employeeCode;
    List<ProjectMemberResponseDTO> members;
    List<Task> tasks;
}
