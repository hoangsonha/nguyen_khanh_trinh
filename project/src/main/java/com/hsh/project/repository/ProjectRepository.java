package com.hsh.project.repository;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Page<Project> findAll(Specification<Project> spec, Pageable pageable);

    Project findByName(String name);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.employee.id = :userId")
    Page<Project> findAllByEmployeeId(@Param("userId") int userId, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.employee.id = :userId")
    Page<Project> findAllByEmployeeId(@Param("userId") int userId, Pageable pageable, Specification<Project> spec);

}
