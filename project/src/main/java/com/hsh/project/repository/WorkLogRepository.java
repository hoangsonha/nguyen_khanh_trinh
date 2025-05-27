package com.hsh.project.repository;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkLogRepository extends JpaRepository<WorkLog, Integer> {

}
