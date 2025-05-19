package com.hsh.project.service.spec;

import com.hsh.project.dto.response.RoleResponseDTO;
import com.hsh.project.exception.ParseEnumException;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.enums.EnumRoleNameType;

import java.util.List;

public interface RoleService {
    List<RoleResponseDTO> findAll();
    Role getRoleByRoleName(EnumRoleNameType enumRoleNameType);
}
