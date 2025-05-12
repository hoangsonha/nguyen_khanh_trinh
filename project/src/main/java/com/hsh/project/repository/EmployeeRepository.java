package com.hsh.project.repository;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByIdAndDeletedIsFalse(Integer id);

    List<Employee> findByRoleAndDeletedIsFalse(Role role);

    Employee getAccountByEmail(String email);

    Optional<Employee> getAccountByEmailAndDeletedIsFalse(String email);

}
