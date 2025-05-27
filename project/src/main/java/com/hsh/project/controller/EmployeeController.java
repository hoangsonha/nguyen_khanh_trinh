package com.hsh.project.controller;

import com.hsh.project.dto.response.EmployeeResponseDTO;
import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.pojo.Employee;
import com.hsh.project.service.spec.EmployeeService;
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
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @Value("${application.default-current-page}")
    private int defaultCurrentPage;

    @Value("${application.default-page-size}")
    private int defaultPageSize;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<PagingResponse> getAllEmployee(@RequestParam(value = "currentPage", required = false) Integer currentPage,
                                                         @RequestParam(value = "pageSize", required = false) Integer pageSize) {
        int resolvedCurrentPage = (currentPage != null) ? currentPage : defaultCurrentPage;
        int resolvedPageSize = (pageSize != null) ? pageSize : defaultPageSize;
        PagingResponse results = employeeService.getAllAccountPaging(resolvedCurrentPage, resolvedPageSize);
        List<?> data = (List<?>) results.getData();
        return ResponseEntity.status(!data.isEmpty() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(results);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/non-paging")
    public ResponseEntity<ObjectResponse> getAllEmployeesNonPaging() {
        List<EmployeeResponseDTO> results = employeeService.getAccounts();
        return !results.isEmpty() ? ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "get all hub non paging successfully", results)) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", "get all hub non paging failed", results));
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<PagingResponse> searchEmployee(@RequestParam(value = "currentPage", required = false) Integer currentPage,
                                                         @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                                         @RequestParam(value = "userName", required = false, defaultValue = "") String userName,
                                                         @RequestParam(value = "fullName", required = false, defaultValue = "") String fullName,
                                                         @RequestParam(value = "email", required = false, defaultValue = "") String email) {
        int resolvedCurrentPage = (currentPage != null) ? currentPage : defaultCurrentPage;
        int resolvedPageSize = (pageSize != null) ? pageSize : defaultPageSize;

        PagingResponse results = employeeService.searchEmployees(resolvedCurrentPage, resolvedPageSize, userName, fullName, email);
        List<?> data = (List<?>) results.getData();
        return ResponseEntity.status(!data.isEmpty() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(results);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ObjectResponse> getEmployeeByID(@PathVariable("id") int id) {
        EmployeeResponseDTO hub = employeeService.getAccountById(id);
        return hub != null ?
                ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Get hub by ID successfully", hub)) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Get hub by ID failed", null));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<ObjectResponse> createEmployee(@Valid @RequestBody CreateEmployeeRequest req) {
        try {
            EmployeeResponseDTO employee = employeeService.createEmployee(req);
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
    public ResponseEntity<ObjectResponse> updateEmployee(@PathVariable("id") int id, @RequestBody UpdateEmployeeRequest req) {
        try {
            EmployeeResponseDTO employee = employeeService.updateEmployee(req, id);
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
    public ResponseEntity<ObjectResponse> deleteHubByID(@PathVariable("id") int hubID) {
        try {
            EmployeeResponseDTO hub = employeeService.deleteEmployee(hubID);
            if(hub != null) {
                return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Delete hub successfully", hub));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Delete hub failed", null));
        } catch (ElementNotFoundException e) {
            log.error("Error while updating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Update Employee failed" + e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error deleting hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Delete hub failed", null));
        }
    }

    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @PostMapping("/{id}/restore")
    public ResponseEntity<ObjectResponse> unDeleteHubByID(@PathVariable("id") int id) {
        try {
            EmployeeResponseDTO hub = employeeService.restoreEmployee(id);
            if(hub != null) {
                return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "UnDelete hub successfully", hub));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Employee is null", null));
        } catch (ElementNotFoundException e) {
            log.error("Error while updating hub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Update Employee failed" + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Undelete hub failed", null));
        }
    }


}
