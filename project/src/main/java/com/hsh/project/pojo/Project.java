package com.hsh.project.pojo;

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
@Table(name = "projects")
public class Project extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = false, unique = true)
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    LocalDate startDate;
    LocalDate endDate;

    @Enumerated(EnumType.STRING)
    TaskStatus projectStatus;

    @ManyToOne
    @JoinColumn(name = "created_by")
    Employee createdBy;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    List<ProjectMember> members;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    List<Task> tasks;

}
