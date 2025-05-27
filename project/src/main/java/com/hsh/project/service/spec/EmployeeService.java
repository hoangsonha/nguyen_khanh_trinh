package com.hsh.project.service.spec;

import com.hsh.project.dto.response.EmployeeResponseDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.pojo.Employee;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface EmployeeService {

    PagingResponse getAllAccountPaging(Integer currentPage, Integer pageSize);

    PagingResponse searchEmployees(Integer currentPage, Integer pageSize, String userName, String fullName, String email);

    List<EmployeeResponseDTO> getAccounts();

    EmployeeResponseDTO getAccountById(int id);

    EmployeeResponseDTO createEmployee(CreateEmployeeRequest request) throws BadRequestException;

    EmployeeResponseDTO updateEmployee(UpdateEmployeeRequest request, int id);

    Employee getEmployeeById(int id);

    Employee saveEmployee(Employee employee);

    EmployeeResponseDTO deleteEmployee(int id);

    EmployeeResponseDTO restoreEmployee(int id);

}
