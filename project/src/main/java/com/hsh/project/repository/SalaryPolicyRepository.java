package com.hsh.project.repository;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.SalaryPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryPolicyRepository extends JpaRepository<SalaryPolicy, Integer> {


}
