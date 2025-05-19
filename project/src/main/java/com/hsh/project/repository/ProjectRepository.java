package com.hsh.project.repository;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Page<Project> findAll(Specification<Project> spec, Pageable pageable);

    Project findByName(String name);
}
