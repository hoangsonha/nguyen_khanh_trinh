package com.hsh.project.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BaseEntity {

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDate createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDate updatedAt;

    boolean deleted = false;
}
