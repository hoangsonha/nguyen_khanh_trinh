package com.hsh.project.service.impl;

import com.hsh.project.configuration.CustomAccountDetail;
import com.hsh.project.dto.response.EmployeeResponseDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.mapper.EmployeeMapper;
import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.EmploymentHistory;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.SalaryPolicy;
import com.hsh.project.pojo.enums.EmploymentStatus;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.pojo.enums.SalaryType;
import com.hsh.project.repository.EmployeeRepository;
import com.hsh.project.repository.RoleRepository;
import com.hsh.project.repository.SalaryPolicyRepository;
import com.hsh.project.service.spec.EmployeeService;
import com.hsh.project.utils.EmployeeSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public PagingResponse getAllAccountPaging(Integer currentPage, Integer pageSize) {

        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = employeeRepository.findAll(pageable);

        return !pageData.getContent().isEmpty() ? PagingResponse.builder()
                .code("Success")
                .message("Get all account paging successfully")
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .data(pageData.getContent().stream()
                        .map(employeeMapper::employeeToEmployeeResponseDTO)
                        .toList())
                .build() :
                PagingResponse.builder()
                        .code("Failed")
                        .message("Get all account paging failed")
                        .currentPage(currentPage)
                        .pageSize(pageSize)
                        .totalElements(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .data(pageData.getContent().stream()
                                .map(employeeMapper::employeeToEmployeeResponseDTO)
                                .toList())
                        .build();
    }

    @Override
    public PagingResponse searchEmployees(Integer currentPage, Integer pageSize, String userName, String fullName, String email) {
        Pageable pageable;
        Specification<Employee> spec = Specification.where(null);

        List<String> keys = new ArrayList<>();
        List<String> values = new ArrayList<>();

        String searchName = "";
        if (StringUtils.hasText(userName)) {
            searchName = userName;
        }
        keys.add("userName");
        values.add(searchName);

        String searchFullName = "";
        if (StringUtils.hasText(fullName)) {
            searchFullName = fullName;
        }
        keys.add("fullName");
        values.add(searchFullName);

        String searchEmail = "";
        if (StringUtils.hasText(email)) {
            searchEmail = email;
        }
        keys.add("email");
        values.add(searchEmail);

        if(keys.size() == values.size()) {
            for(int i = 0; i < keys.size(); i++) {
                String field = keys.get(i);
                String value = values.get(i);
                Specification<Employee> newSpec = EmployeeSpecification.searchByField(field, value);
                if(newSpec != null) {
                    spec = spec.and(newSpec);
                }
            }
        }

        pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = employeeRepository.findAll(spec, pageable);

        return !pageData.getContent().isEmpty() ? PagingResponse.builder()
                .code("Success")
                .message("Get all employees paging successfully")
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .data(pageData.getContent().stream()
                        .map(employeeMapper::employeeToEmployeeResponseDTO)
                        .toList())
                .build() :
                PagingResponse.builder()
                        .code("Failed")
                        .message("Get all employees paging failed")
                        .currentPage(currentPage)
                        .pageSize(pageSize)
                        .totalElements(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .data(pageData.getContent().stream()
                                .map(employeeMapper::employeeToEmployeeResponseDTO)
                                .toList())
                        .build();
    }

    @Override
    public List<EmployeeResponseDTO> getAccounts() {
        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        return employeeRepository.findAll().stream()
                .filter(e -> !e.getId().equals(user.getId()))
                .filter(e -> e.getRole() != null && e.getRole().getRoleName() == EnumRoleNameType.ROLE_USER)
                .map(employeeMapper::employeeToEmployeeResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponseDTO getAccountById(int id) {

        Employee e = employeeRepository.findById(id).orElse(null);

        if (e == null) {
            throw new ElementNotFoundException("Employee not found");
        }

        return employeeMapper.employeeToEmployeeResponseDTO(e);
    }

    @Transactional
    @Override
    public EmployeeResponseDTO createEmployee(CreateEmployeeRequest request) {

        Employee employee = employeeRepository.findByEmail(request.getEmail());
        Employee employee2 = employeeRepository.findByCode(request.getCode());
        Employee employee3 = employeeRepository.findByPhone(request.getPhone());

        if (!request.getPhone().matches("^0\\d{9}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số.");
        }

        if (employee != null) {
            throw new ElementExistException("Email already exists");
        }
        if (employee2 != null) {
            throw new ElementExistException("Code already exists");
        }
        if (employee3 != null) {
            throw new ElementExistException("Phone already exists");
        }

        Role role = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(request.getRoleName()));

        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        Employee newEmployee = Employee.builder()
                .userName(request.getUserName())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .code(request.getCode())
                .phone(request.getPhone())
                .password(bCryptPasswordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .nonLocked(true)
                .build();

        if (request.getStartDate() != null) {

            List<EmploymentHistory> list = new ArrayList<>();

            EmploymentHistory employmentHistory = EmploymentHistory.builder()
                    .employee(newEmployee)
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate() != null ? request.getEndDate() : null)
                    .status(EmploymentStatus.ACTIVE)
                    .note(request.getNote())
                    .isNewest(true)
                    .build();

            list.add(employmentHistory);

            SalaryPolicy salaryPolicy = SalaryPolicy.builder()
                    .employmentHistory(employmentHistory)
                    .baseSalary(request.getBaseSalary())
                    .effectiveFrom(request.getStartDate())
                    .effectiveTo(request.getEndDate() != null ? request.getEndDate() : null)
                    .salaryType(request.getSalaryType())
                    .modifiedBy(user.getEmail())
                    .isNewest(true)
                    .build();

            employmentHistory.setSalaryPolicies(List.of(salaryPolicy));

            newEmployee.setEmploymentHistories(list);
        }

        return employeeMapper.employeeToEmployeeResponseDTO(employeeRepository.save(newEmployee));
    }

    @Transactional
    @Override
    public EmployeeResponseDTO updateEmployee(UpdateEmployeeRequest request, int id) {
        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Employee not found"));

        if (!employee.isEnabled() && employee.isDeleted()) {
            throw new BadRequestException("Employee is deleted. Please restore employee first");
        }

        // Code, phone validation như bạn có ở trên...
        if (isChanged(employee.getCode(), request.getCode())) {
            if (employeeRepository.findByCode(request.getCode()) != null) {
                throw new ElementExistException("Code already exists");
            }
            employee.setCode(request.getCode());
        }

        if (!request.getPhone().matches("^0\\d{9}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số.");
        }
        if (isChanged(employee.getPhone(), request.getPhone())) {
            if (employeeRepository.findByPhone(request.getPhone()) != null) {
                throw new ElementExistException("Phone already exists");
            }
            employee.setPhone(request.getPhone());
        }

        applyIfChanged(employee.getUserName(), request.getUserName(), employee::setUserName);
        applyIfChanged(employee.getFullName(), request.getFullName(), employee::setFullName);

        // Role
        if (isChanged(employee.getRole().getRoleName().name(), request.getRoleName())) {
            Role newRole = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(request.getRoleName()));
            employee.setRole(newRole);
        }

        handleSalaryPolicyChange(request, employee, user);

        return employeeMapper.employeeToEmployeeResponseDTO(employeeRepository.save(employee));
    }

    private void handleSalaryPolicyChange(UpdateEmployeeRequest request, Employee employee, Employee modifiedByUser) {
        List<EmploymentHistory> histories = employee.getEmploymentHistories();
        if (histories == null || histories.isEmpty()) return;

        EmploymentHistory latestHistory = histories.stream()
                .filter(EmploymentHistory::getIsNewest)
                .findFirst()
                .orElse(null);
        if (latestHistory == null) return;

        List<SalaryPolicy> currentPolicies = latestHistory.getSalaryPolicies();
        if (currentPolicies == null || currentPolicies.isEmpty()) return;

        SalaryPolicy latestPolicy = currentPolicies.stream()
                .filter(SalaryPolicy::getIsNewest)
                .findFirst()
                .orElse(null);
        if (latestPolicy == null) return;

        boolean startDateChanged = isChanged(latestHistory.getStartDate(), request.getStartDate());
        boolean baseSalaryChanged = request.getBaseSalary() != null && !latestPolicy.getBaseSalary().equals(request.getBaseSalary());
        boolean salaryTypeChanged = request.getSalaryType() != null && !latestPolicy.getSalaryType().name().equals(request.getSalaryType());

        boolean needNewPolicy = startDateChanged || baseSalaryChanged || salaryTypeChanged;

        if (latestHistory.getStatus() == EmploymentStatus.TERMINATED) {
            if (startDateChanged && request.getStartDate().isAfter(latestHistory.getEndDate())) {
                // Đánh dấu EmploymentHistory và Policy cũ không còn là mới nhất
                latestHistory.setIsNewest(false);
                latestPolicy.setIsNewest(false);

                EmploymentHistory newHistory = EmploymentHistory.builder()
                        .employee(employee)
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .status(EmploymentStatus.ACTIVE)
                        .note(request.getNote())
                        .isNewest(true)
                        .build();

                SalaryPolicy newPolicy = SalaryPolicy.builder()
                        .employmentHistory(newHistory)
                        .baseSalary(request.getBaseSalary())
                        .salaryType(SalaryType.valueOf(request.getSalaryType()))
                        .effectiveFrom(request.getStartDate())
                        .effectiveTo(request.getEndDate())
                        .modifiedBy(modifiedByUser.getEmail())
                        .isNewest(true)
                        .build();

                newHistory.setSalaryPolicies(List.of(newPolicy));
                histories.add(newHistory);
            } else {
                throw new BadRequestException("StartDate phải sau EndDate của lần làm việc trước.");
            }
            return;
        }

        // Trường hợp đang ACTIVE và có thay đổi
        if (latestHistory.getStatus() == EmploymentStatus.ACTIVE && needNewPolicy) {
            latestPolicy.setEffectiveTo(request.getStartDate());
            latestPolicy.setModifiedBy(modifiedByUser.getEmail());
            latestPolicy.setIsNewest(false);
            latestPolicy.setDeleted(true);

            SalaryPolicy newPolicy = SalaryPolicy.builder()
                    .employmentHistory(latestHistory)
                    .baseSalary(baseSalaryChanged ? request.getBaseSalary() : latestPolicy.getBaseSalary())
                    .salaryType(salaryTypeChanged ? SalaryType.valueOf(request.getSalaryType()) : latestPolicy.getSalaryType())
                    .effectiveFrom(startDateChanged ? request.getStartDate() : latestPolicy.getEffectiveFrom())
                    .effectiveTo(request.getEndDate())
                    .modifiedBy(modifiedByUser.getEmail())
                    .isNewest(true)
                    .build();

            currentPolicies.add(newPolicy);
            latestHistory.setSalaryPolicies(currentPolicies);

            if (startDateChanged) {
                latestHistory.setStartDate(request.getStartDate());
            }
        }
    }

    private <T> boolean isChanged(T currentValue, T newValue) {
        if (currentValue == null) return newValue != null;
        return !currentValue.equals(newValue);
    }

    private <T> void applyIfChanged(T oldValue, T newValue, Consumer<T> setter) {
        if (isChanged(oldValue, newValue)) {
            setter.accept(newValue);
        }
    }

    @Override
    public Employee getEmployeeById(int id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public EmployeeResponseDTO deleteEmployee(int id) {
        Employee employee = getEmployeeById(id);
        if (employee == null) {
            throw new ElementNotFoundException("Employee not found.");
        }
        employee.setDeleted(true);
        employee.setEnabled(false);

        List<EmploymentHistory> histories = employee.getEmploymentHistories();

        EmploymentHistory latestHistory = histories.stream()
                .filter(EmploymentHistory::getIsNewest)
                .findFirst()
                .orElse(null);

        List<SalaryPolicy> currentPolicies = latestHistory.getSalaryPolicies();

        LocalDate now = LocalDate.now();

        SalaryPolicy latestPolicy = currentPolicies.stream()
                .filter(SalaryPolicy::getIsNewest)
                .findFirst()
                .orElse(null);

        latestPolicy.setEffectiveTo(now);
        latestPolicy.setDeleted(true);

        latestHistory.setEndDate(now);
        latestHistory.setStatus(EmploymentStatus.TERMINATED);
        latestHistory.setDeleted(true);

        return employeeMapper.employeeToEmployeeResponseDTO(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponseDTO restoreEmployee(int id) {
        Employee employee = getEmployeeById(id);
        if (employee == null) {
            throw new ElementNotFoundException("Employee not found.");
        }
        employee.setDeleted(false);
        employee.setEnabled(true);
        return employeeMapper.employeeToEmployeeResponseDTO(employeeRepository.save(employee));
    }


}
