package com.hsh.project.utils;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Project;
import org.springframework.data.jpa.domain.Specification;

public class ProjectSpecification {
    public static Specification<Project> searchByField(String field, String value) {
        return (root, query, criteriaBuilder) -> {
            if (value == null || value.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            switch (field) {
                case "name":
                    return criteriaBuilder.like(root.get("name"), "%" + value + "%");
                case "projectStatus":
                    return criteriaBuilder.equal(root.get("projectStatus"), value);
                default:
                    return null;
            }
        };
    }
}
