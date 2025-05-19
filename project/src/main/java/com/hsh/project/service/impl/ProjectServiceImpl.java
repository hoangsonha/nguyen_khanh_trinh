package com.hsh.project.service.impl;

import com.hsh.project.configuration.CustomAccountDetail;
import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.ProjectCreateRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.dto.response.ProjectResponseDTO;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.mapper.ProjectMapper;
import com.hsh.project.pojo.*;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.pojo.enums.TaskStatus;
import com.hsh.project.repository.EmployeeRepository;
import com.hsh.project.repository.ProjectRepository;
import com.hsh.project.service.spec.ProjectService;
import com.hsh.project.utils.EmployeeSpecification;
import com.hsh.project.utils.ProjectSpecification;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectMapper projectMapper;

    @Override
    public PagingResponse getAllProjectPaging(Integer currentPage, Integer pageSize) {

        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = projectRepository.findAll(pageable);

        return !pageData.getContent().isEmpty() ? PagingResponse.builder()
                .code("Success")
                .message("Get all project paging successfully")
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .data(pageData.getContent().stream()
                        .map(projectMapper::projectToProjectResponseDTO)
                        .toList())
                .build() :
                PagingResponse.builder()
                        .code("Failed")
                        .message("Get all project paging failed")
                        .currentPage(currentPage)
                        .pageSize(pageSize)
                        .totalElements(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .data(pageData.getContent().stream()
                                .map(projectMapper::projectToProjectResponseDTO)
                                .toList())
                        .build();
    }

    @Override
    public PagingResponse searchProject(Integer currentPage, Integer pageSize, String name, String status) {
        Pageable pageable;

        Specification<Project> spec = Specification.where(null);

        List<String> keys = new ArrayList<>();
        List<String> values = new ArrayList<>();

        String searchName = "";
        if (StringUtils.hasText(name)) {
            searchName = name;
        }
        keys.add("name");
        values.add(searchName);

        String searchStatus = "";
        if (StringUtils.hasText(status)) {
            searchStatus = status;
        }
        keys.add("status");
        values.add(searchStatus);

        if(keys.size() == values.size()) {
            for(int i = 0; i < keys.size(); i++) {
                String field = keys.get(i);
                String value = values.get(i);
                Specification<Project> newSpec = ProjectSpecification.searchByField(field, value);
                if(newSpec != null) {
                    spec = spec.and(newSpec);
                }
            }
        }

        pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = projectRepository.findAll(spec, pageable);

        return !pageData.getContent().isEmpty() ? PagingResponse.builder()
                .code("Success")
                .message("Get all employees paging successfully")
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .data(pageData.getContent().stream()
                        .map(projectMapper::projectToProjectResponseDTO)
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
                                .map(projectMapper::projectToProjectResponseDTO)
                                .toList())
                        .build();
    }

    @Override
    public List<ProjectResponseDTO> getProjects() {

        return projectRepository.findAll().stream().map(projectMapper::projectToProjectResponseDTO).collect(Collectors.toList());
    }

    @Override
    public ProjectResponseDTO getProjectById(int id) {

        Project e = projectRepository.findById(id).orElse(null);

        if (e == null) {
            throw new ElementNotFoundException("Project not found");
        }

        return projectMapper.projectToProjectResponseDTO(e);
    }

    @Override
    public ProjectResponseDTO createProject(ProjectCreateRequest request) {

        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        Project employee = projectRepository.findByName(request.getName());

        if (employee != null) {
            throw new ElementExistException("Name already exists");
        }

        LocalDate now = LocalDate.now();

        if (request.getStartDate() != null) {
            if (request.getStartDate().isBefore(now)) {
                throw new BadRequestException("Start date cannot be before current date");
            }
        }

        if (request.getEndDate() != null) {
            if (request.getEndDate().isBefore(now)) {
                throw new BadRequestException("End date cannot be before current date");
            }
        }

        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getStartDate().isAfter(request.getEndDate())) {
                throw new BadRequestException("Start date cannot be after end date");
            }
        }

        Project newProject = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(user)
                .projectStatus(TaskStatus.valueOf(request.getProjectStatus()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .tasks(null)
                .members(null)
                .build();

        return projectMapper.projectToProjectResponseDTO(projectRepository.save(newProject));
    }

//    @Override
//    public ProjectResponseDTO updateProject(UpdateEmployeeRequest request, int id) {
//
//        Employee employee = employeeRepository.findById(id).orElse(null);
//
//        if (employee == null) {
//            throw new ElementNotFoundException("Employee not found");
//        } else {
//            if (request.getCode() != null) {
//                if (!employee.getCode().equals(request.getCode())) {
//                    Employee employee2 = employeeRepository.findByCode(request.getCode());
//                    if (employee2 != null) {
//                        throw new ElementExistException("Code already exists");
//                    }
//                }
//                employee.setCode(request.getCode());
//            }
//
//            if (!request.getPhone().matches("^0\\d{9}$")) {
//                throw new BadRequestException("Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số.");
//            }
//
//            if (request.getPhone() != null) {
//                if (!employee.getPhone().equals(request.getPhone())) {
//                    Employee employee2 = employeeRepository.findByPhone(request.getPhone());
//                    if (employee2 != null) {
//                        throw new ElementExistException("Phone already exists");
//                    }
//                }
//                employee.setCode(request.getCode());
//            }
//
//            if (request.getUserName() != null) {
//                employee.setUserName(request.getUserName());
//            }
//            if (request.getFullName() != null) {
//                employee.setFullName(request.getFullName());
//            }
//            if (request.getRoleName() != null) {
//                Role role = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(request.getRoleName()));
//                employee.setRole(role);
//            }
//            return accountMapper.accountToAccountDTO(employeeRepository.save(employee));
//        }
//    }

    @Override
    public Project getProjectsById(int id) {
        return projectRepository.findById(id).orElse(null);
    }

    @Override
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

}
