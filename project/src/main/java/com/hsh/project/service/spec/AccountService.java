package com.hsh.project.service.spec;

import com.hsh.project.dto.response.EmployeeResponseDTO;
import com.hsh.project.dto.request.AccountRegisterRequest;
import com.hsh.project.dto.response.TokenResponse;
import com.hsh.project.pojo.Employee;
import jakarta.servlet.http.HttpServletRequest;


public interface AccountService {

    EmployeeResponseDTO registerAccount(AccountRegisterRequest accountRegisterRequest);

    TokenResponse refreshToken(String refreshToken);

    TokenResponse login(String email, String password);

    boolean logout(HttpServletRequest request);

    Employee getUserById(Integer id);

}
