package com.hsh.project.mapper;

import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.response.ProjectMemberResponseDTO;
import com.hsh.project.dto.response.ProjectResponseDTO;
import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Project;
import com.hsh.project.pojo.ProjectMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(source = "projectStatus", target = "projectStatus")
    @Mapping(source = "createdBy.id", target = "employeeId")
    @Mapping(source = "createdBy.fullName", target = "employeeFullName")
    @Mapping(source = "createdBy.email", target = "employeeEmail")
    @Mapping(source = "createdBy.code", target = "employeeCode")
    @Mapping(source = "id", target = "id")
    @Mapping(source = "members", target = "members")
    @Mapping(source = "tasks", target = "tasks")
    ProjectResponseDTO projectToProjectResponseDTO(Project project);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "employee.email", target = "employeeEmail")
    @Mapping(source = "employee.id", target = "employeeId")
    @Mapping(source = "employee.code", target = "employeeCode")
    ProjectMemberResponseDTO projectMemberToProjectMemberResponseDTO(ProjectMember projectMember);

}
