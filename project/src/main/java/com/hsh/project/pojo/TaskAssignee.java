package com.hsh.project.pojo;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "task_assignees", uniqueConstraints = @UniqueConstraint(columnNames = {"task_id", "employee_id"}))
public class TaskAssignee extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Integer id;

     String status;

    @Column(name = "comment")
     String comment;

    @ManyToOne
    @JoinColumn(name = "task_id")
     Task task;

    @ManyToOne
    @JoinColumn(name = "employee_id")
     Employee employee;

}
