package com.hsh.project.controller;

import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.ProjectCreateRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.dto.response.ProjectResponseDTO;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Project;
import com.hsh.project.pojo.enums.TaskStatus;
import com.hsh.project.service.spec.EmployeeService;
import com.hsh.project.service.spec.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @Value("${application.default-current-page}")
    private int defaultCurrentPage;

    @Value("${application.default-page-size}")
    private int defaultPageSize;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<PagingResponse> getAllProject(@RequestParam(value = "currentPage", required = false) Integer currentPage,
                                                         @RequestParam(value = "pageSize", required = false) Integer pageSize) {
        int resolvedCurrentPage = (currentPage != null) ? currentPage : defaultCurrentPage;
        int resolvedPageSize = (pageSize != null) ? pageSize : defaultPageSize;
        PagingResponse results = projectService.getAllProjectPaging(resolvedCurrentPage, resolvedPageSize);
        List<?> data = (List<?>) results.getData();
        return ResponseEntity.status(!data.isEmpty() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(results);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('MANAGER')")
    @GetMapping("/{id}/employee")
    public ResponseEntity<PagingResponse> getAllProjectByUserId(@RequestParam(value = "currentPage", required = false) Integer currentPage,
                                                                @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                                                @PathVariable("id") int id) {
        int resolvedCurrentPage = (currentPage != null) ? currentPage : defaultCurrentPage;
        int resolvedPageSize = (pageSize != null) ? pageSize : defaultPageSize;
        PagingResponse results = projectService.getAllProjectByUserId(resolvedCurrentPage, resolvedPageSize, id);
        List<?> data = (List<?>) results.getData();
        return ResponseEntity.status(!data.isEmpty() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(results);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/search/{id}/employee")
    public ResponseEntity<PagingResponse> searchProjectByEmployeeId(@RequestParam(value = "currentPage", required = false) Integer currentPage,
                                                                    @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                                                    @RequestParam(value = "name", required = false, defaultValue = "") String name,
                                                                    @RequestParam(value = "status", required = false, defaultValue = "") String status,
                                                                    @PathVariable("id") int id) {
        int resolvedCurrentPage = (currentPage != null) ? currentPage : defaultCurrentPage;
        int resolvedPageSize = (pageSize != null) ? pageSize : defaultPageSize;

        PagingResponse results = projectService.searchProjectByEmployeeId(resolvedCurrentPage, resolvedPageSize, name, status, id);
        List<?> data = (List<?>) results.getData();
        return ResponseEntity.status(!data.isEmpty() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(results);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/non-paging")
    public ResponseEntity<ObjectResponse> getAllProjectNonPaging() {
        List<ProjectResponseDTO> results = projectService.getProjects();
        return !results.isEmpty() ? ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "get all hub non paging successfully", results)) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", "get all hub non paging failed", results));
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<PagingResponse> searchProject(@RequestParam(value = "currentPage", required = false) Integer currentPage,
                                                         @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                                         @RequestParam(value = "name", required = false, defaultValue = "") String name,
                                                         @RequestParam(value = "status", required = false, defaultValue = "") String status) {
        int resolvedCurrentPage = (currentPage != null) ? currentPage : defaultCurrentPage;
        int resolvedPageSize = (pageSize != null) ? pageSize : defaultPageSize;

        PagingResponse results = projectService.searchProject(resolvedCurrentPage, resolvedPageSize, name, status);
        List<?> data = (List<?>) results.getData();
        return ResponseEntity.status(!data.isEmpty() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(results);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ObjectResponse> getProjectByID(@PathVariable("id") int id) {
        ProjectResponseDTO hub = projectService.getProjectById(id);
        return hub != null ?
                ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Get hub by ID successfully", hub)) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Get hub by ID failed", null));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<ObjectResponse> createProject(@Valid @RequestBody ProjectCreateRequest req) {
        try {
            ProjectResponseDTO employee = projectService.createProject(req);
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Create hub successfully", employee));
        } catch (BadRequestException e) {
            log.error("Error creating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementExistException e) {
            log.error("Error creating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error creating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Create hub failed", null));
        }
    }

    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ObjectResponse> updateProject(@PathVariable("id") int id, @RequestBody ProjectCreateRequest req) {
        try {
            ProjectResponseDTO employee = projectService.updateProject(req, id);
            if (employee != null) {
                return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Update hub successfully", employee));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Update hub failed. Hub is null", null));
        } catch (BadRequestException e) {
            log.error("Error creating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementExistException e) {
            log.error("Error while updating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementNotFoundException e) {
            log.error("Error while updating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Update Employee failed. Employee not found", null));
        } catch (Exception e) {
            log.error("Error updating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Update hub failed", null));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ObjectResponse> deleteProjectByID(@PathVariable("id") int hubID) {
        try {
            Project hub = projectService.getProjectsById(hubID);
            if (hub != null) {
                hub.setDeleted(true);
                hub.setProjectStatus(TaskStatus.cancelled);
                return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Delete hub successfully", projectService.saveProject(hub)));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Delete hub failed", null));
        } catch (Exception e) {
            log.error("Error deleting hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Delete hub failed", null));
        }
    }

    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @PostMapping("/{id}/restore")
    public ResponseEntity<ObjectResponse> unDeleteProjectByID(@PathVariable("id") int id) {
        try {
            Project hub = projectService.getProjectsById(id);
            if (hub != null) {
                hub.setDeleted(false);
                hub.setProjectStatus(TaskStatus.not_started);
                return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "UnDelete hub successfully", projectService.saveProject(hub)));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Employee is null", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Undelete hub failed", null));
        }
    }

}