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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
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
    public PagingResponse searchProjectByEmployeeId(Integer currentPage, Integer pageSize, String name, String status, int id) {
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

        var pageData = projectRepository.findAllByEmployeeId(id, pageable, spec);

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
    public PagingResponse getAllProjectByUserId(Integer currentPage, Integer pageSize, int userId) {
        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = projectRepository.findAllByEmployeeId(userId, pageable);

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

    @Transactional
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
        } else {
            throw new BadRequestException("Project must have a start date");
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

        if (!request.getEmployeeIds().isEmpty()) {
            List<Employee> allEmployees = employeeRepository.findAllById(request.getEmployeeIds());

            List<ProjectMember> li = new ArrayList<>();

            for (Employee e : allEmployees) {
                ProjectMember pm = ProjectMember.builder()
                        .employee(e)
                        .project(newProject)
                        .roleInProject(e.getRole().getRoleName().toString())
                        .status(String.valueOf(TaskStatus.in_progress))
                        .build();
                li.add(pm);
            }

            newProject.setMembers(li);
        }

        return projectMapper.projectToProjectResponseDTO(projectRepository.save(newProject));
    }

    @Transactional
    @Override
    public ProjectResponseDTO updateProject(ProjectCreateRequest request, int id) {

        Project project = projectRepository.findById(id).orElse(null);

        if (project == null) {
            throw new ElementNotFoundException("Project not found");
        } else {
            if (request.getName() != null) {
                project.setName(request.getName());
            }
            if (request.getDescription() != null) {
                project.setDescription(request.getDescription());
            }

            if (request.getStartDate() != null && request.getEndDate() != null) {
//                LocalDate now = LocalDate.now();
                LocalDate previousStartDate = project.getStartDate();
                LocalDate previousEndDate = project.getEndDate();

//                if (request.getEndDate().isBefore(now)) {
//                    throw new BadRequestException("End date cannot be before current date");
//                }
//                if (request.getStartDate().isBefore(now)) {
//                    throw new BadRequestException("Start date cannot be before current date");
//                }
                if (request.getStartDate().isAfter(request.getEndDate())) {
                    throw new BadRequestException("Start date cannot be after end date");
                }

                if (!request.getStartDate().equals(previousStartDate)) {
                    if (request.getStartDate().isBefore(previousStartDate)) {
                        throw new BadRequestException("Start date cannot be before previous date");
                    }
                    project.setStartDate(request.getStartDate());
                }
                if (!request.getEndDate().equals(previousEndDate)) {
                    if (request.getEndDate().isBefore(request.getStartDate())) {
                        throw new BadRequestException("End date cannot be before start date");
                    }
                    project.setEndDate(request.getEndDate());
                }
            }
            if (request.getProjectStatus() != null) {
                project.setProjectStatus(TaskStatus.valueOf(request.getProjectStatus()));
            }

            List<Integer> newEmployeeIds = request.getEmployeeIds();

            if (newEmployeeIds != null) {
                Set<Integer> existingEmployeeIds = project.getMembers().stream()
                        .map(pm -> pm.getEmployee().getId())
                        .collect(Collectors.toSet());

                Set<Integer> newEmployeeIdSet = new HashSet<>(newEmployeeIds);

                // Xoá các thành viên không còn trong danh sách mới
                project.getMembers().removeIf(pm -> !newEmployeeIdSet.contains(pm.getEmployee().getId()));

                // Thêm các thành viên mới
                for (Integer newId : newEmployeeIdSet) {
                    if (!existingEmployeeIds.contains(newId)) {
                        Employee e = employeeRepository.findById(newId)
                                .orElseThrow(() -> new ElementNotFoundException("Employee not found"));

                        ProjectMember pm = ProjectMember.builder()
                                .employee(e)
                                .project(project)
                                .roleInProject(e.getRole().getRoleName().toString())
                                .status(String.valueOf(TaskStatus.in_progress))
                                .build();

                        project.getMembers().add(pm);
                    }
                }
            }

            return projectMapper.projectToProjectResponseDTO(projectRepository.save(project));
        }
    }

    @Override
    public Project getProjectsById(int id) {
        return projectRepository.findById(id).orElse(null);
    }

    @Override
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

}
