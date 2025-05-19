package com.hsh.project.mapper;

import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.response.ProjectResponseDTO;
import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(source = "projectStatus", target = "projectStatus")
    @Mapping(source = "createdBy.id", target = "employeeId")
    @Mapping(source = "createdBy.fullName", target = "employeeName")
    @Mapping(source = "createdBy.userName", target = "employeeUserName")
    @Mapping(source = "createdBy.code", target = "employeeCode")
    @Mapping(source = "id", target = "id")
    @Mapping(source = "members", target = "members")
    @Mapping(source = "tasks", target = "tasks")
    ProjectResponseDTO projectToProjectResponseDTO(Project project);

}
