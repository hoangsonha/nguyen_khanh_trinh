package com.hsh.project.controller;

import com.hsh.project.configuration.CustomAccountDetail;
import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.repository.EmployeeRepository;
import com.hsh.project.repository.RoleRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@Tag(name = "Employee", description = "Các hoạt động liên quan đến quản lý người dùng")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<AccountDTO> getAll() {

        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        return employeeRepository.findAll().stream()
                .filter(e -> !e.getId().equals(user.getId()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('USER')")
    @GetMapping("/{id}")
    public AccountDTO getUser(@PathVariable Integer id) {

        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        Employee user_found = employeeRepository.findById(id).get();

        AccountDTO final_user = mapToDTO(user_found);

        return final_user;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<AccountDTO> create(@Valid @RequestBody CreateEmployeeRequest req) {
        Role role = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(req.getRoleName()));

        Employee check_exist = employeeRepository.getAccountByEmail(req.getEmail());

        if (check_exist != null) {
            throw new ElementExistException("Email đã tồn tại");
        }

        Employee employee = Employee.builder()
                .userName(req.getUserName())
                .fullName(req.getFullName())
                .email(req.getEmail())
                .code(req.getCode())
                .phone(req.getPhone())
                .password(bCryptPasswordEncoder.encode(req.getPassword()))
                .enabled(true)
                .nonLocked(true)
                .role(role)
                .build();

        employeeRepository.save(employee);
        return ResponseEntity.ok(mapToDTO(employee));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> update(@PathVariable Integer id, @Valid @RequestBody UpdateEmployeeRequest req) {
//        Employee employee = employeeRepository.findById(id).orElseThrow();
        Role role = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(req.getRoleName()));

        Employee employee = employeeRepository.findById(id).get();

        if (employee == null) {
            throw new ElementExistException("Nhân viên không tồn tại");
        }

        employee.setUserName(req.getUserName());
        employee.setFullName(req.getFullName());
        employee.setEmail(req.getEmail());
        employee.setCode(req.getCode());
        employee.setPhone(req.getPhone());
        employee.setRole(role);

        employeeRepository.save(employee);
        return ResponseEntity.ok(mapToDTO(employee));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Employee employee = employeeRepository.findById(id).get();
        if(employee != null) {
            employee.setDeleted(true);
            employeeRepository.save(employee);
        }
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/restore/{id}")
    public ResponseEntity<Void> resotre(@PathVariable Integer id) {
        Employee employee = employeeRepository.findById(id).get();
        if(employee != null) {
            employee.setDeleted(false);
            employeeRepository.save(employee);
        }
        return ResponseEntity.ok().build();
    }

    private AccountDTO mapToDTO(Employee e) {
        return AccountDTO.builder()
                .id(e.getId())
                .email(e.getEmail())
                .phone(e.getPhone())
                .code(e.getCode())
                .userName(e.getUserName())
                .fullName(e.getFullName())
                .roleName(e.getRole().getRoleName().name())
                .enabled(e.isEnabled())
                .nonLocked(e.isNonLocked())
                .deleted(e.isDeleted())
                .build();

    }

}
