package com.hsh.project.mapper;

import com.hsh.project.dto.response.EmployeeResponseDTO;
import com.hsh.project.dto.response.EmploymentHistoryResponseDTO;
import com.hsh.project.dto.response.SalaryPolicyResponseDTO;
import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.EmploymentHistory;
import com.hsh.project.pojo.SalaryPolicy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.LocalDate;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    EmployeeMapper INSTANCE = Mappers.getMapper(EmployeeMapper.class);

    @Mapping(source = "role.roleName", target = "roleName")
    @Mapping(source = "enabled", target = "enabled")
    @Mapping(source = "nonLocked", target = "nonLocked")
    @Mapping(source = "deleted", target = "deleted")
    @Mapping(source = "id", target = "id")
    @Mapping(source = "employmentHistories", target = "employmentHistories")
    EmployeeResponseDTO employeeToEmployeeResponseDTO(Employee user);

    @Mapping(source = "status", target = "status")
    @Mapping(source = "id", target = "id")
    @Mapping(source = "isNewest", target = "isNewest")
    EmploymentHistoryResponseDTO toEmploymentHistoryDTO(EmploymentHistory history);

    @Mapping(source = "salaryType", target = "salaryType")
    @Mapping(source = "id", target = "id")
    @Mapping(source = "isNewest", target = "isNewest")
    SalaryPolicyResponseDTO toSalaryPolicyDTO(SalaryPolicy salary);

}
