package com.hsh.project.dto.request;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProjectCreateRequest {

    String name;
    String description;
    LocalDate startDate;
    LocalDate endDate;
    String projectStatus;
    List<Integer> employeeIds;

}
