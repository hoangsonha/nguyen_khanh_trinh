package com.hsh.project.pojo;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "employee")
public class Employee extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(columnDefinition = "NVARCHAR(255)", nullable = false, unique = true)
    String userName;

    @Column(columnDefinition = "NVARCHAR(255)", nullable = false)
    String fullName;

    @Column(unique = true, nullable = false)
    String email;

    @Column(unique = true, nullable = false)
    String code;

    @Column(unique = true, nullable = false)
    String phone;

    @Column(nullable = false)
    String password;

    @Builder.Default
    boolean enabled = true;

    @Builder.Default
    boolean nonLocked = true;

    @Column(length = 2048)
    String accessToken;

    @Column(length = 2048)
    String refreshToken;

    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role;

    @OneToMany(mappedBy = "employee")
    List<ProjectMember> memberships;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    @OrderBy("startDate DESC")
    List<EmploymentHistory> employmentHistories;
}
