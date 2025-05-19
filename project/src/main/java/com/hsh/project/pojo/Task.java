package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.pojo.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "tasks")
public class Task extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    LocalDate startDate;
    LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    TaskStatus taskStatus;

    @ManyToOne
    @JoinColumn(name = "project_id")
    Project project;

    @ManyToOne
    @JoinColumn(name = "created_by")
    Employee createdBy;

    @OneToMany(mappedBy = "task")
    List<TaskAssignee> assignees;

}
