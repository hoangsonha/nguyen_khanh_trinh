package com.hsh.project.service.spec;

import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.ProjectCreateRequest;
import com.hsh.project.dto.response.ProjectResponseDTO;
import com.hsh.project.pojo.Project;

import java.util.List;

public interface ProjectService {
    PagingResponse getAllProjectPaging(Integer currentPage, Integer pageSize);

    PagingResponse searchProject(Integer currentPage, Integer pageSize, String name, String status);

    PagingResponse searchProjectByEmployeeId(Integer currentPage, Integer pageSize, String name, String status, int id);

    PagingResponse getAllProjectByUserId(Integer currentPage, Integer pageSize, int userId);

    List<ProjectResponseDTO> getProjects();

    ProjectResponseDTO getProjectById(int id);

    ProjectResponseDTO createProject(ProjectCreateRequest request);

    ProjectResponseDTO updateProject(ProjectCreateRequest request, int id);

    Project getProjectsById(int id);

    Project saveProject(Project project);

}
