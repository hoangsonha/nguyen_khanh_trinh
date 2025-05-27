package com.hsh.project.dto.request;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.enums.TaskStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "Project name must not be blank")
    private String name;

    private String description;

    // Start date must be today or in the future
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    // End date must be today or in the future
    @FutureOrPresent(message = "End date must be today or in the future")
    private LocalDate endDate;

    @NotBlank(message = "Project status must not be blank")
    private String projectStatus;

    private List<Integer> employeeIds;
}
