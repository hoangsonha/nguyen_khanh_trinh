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
@Table(name = "project_members", uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "employee_id"}))
public class ProjectMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String roleInProject;

    @ManyToOne
    @JoinColumn(name = "project_id")
    Project project;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    Employee employee;

    String status;

}
