package com.hsh.project.service.impl;

import com.hsh.project.dto.response.RoleResponseDTO;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.exception.ParseEnumException;
import com.hsh.project.mapper.RoleMapper;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.repository.RoleRepository;
import com.hsh.project.service.spec.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<RoleResponseDTO> findAll() {
        return RoleMapper.INSTANCE.toDTOs(roleRepository.findAllByDeletedIsFalse());
    }

    @Override
    public Role getRoleByRoleName(EnumRoleNameType roleName) {
        return Optional.ofNullable(roleRepository.getRoleByRoleName(roleName))
                .orElseThrow(() -> new ElementNotFoundException("Không tìm thấy vai trò"));
    }

}
